/**
 * @file 服务注册,用于服务发现
 */
import { config } from "./config";
import { etcd } from "./etcd";
import { logger } from "./logger";
import { pkg } from "./pkg";
import { cpus, hostname, NetworkInterfaceInfoIPv4, networkInterfaces } from "os";
import { defaults } from "lodash";

const localIp = ([].concat(...(Object.values(networkInterfaces()) as any)) as NetworkInterfaceInfoIPv4[]).find(
  (details) => details.family === "IPv4" && !details.internal
)!.address;

export type ServiceInfo = {
  ip: string;
  port: number;
  weight: number;
  name: string;
  env: string;
  hostname: string;
};

export class Discover {
  protected keys: string[] = [];
  /**
   * 注册服务
   */
  async registerService(info: Partial<ServiceInfo> & { port: number }) {
    defaults(info, { ip: localIp, weight: cpus().length, hostname: hostname(), env: config.env, name: pkg.name });
    const key = `/node/discover/${info.env}/${info.name}/${info.hostname}`;
    this.keys.push(key);
    await etcd.lease(10).put(key).value(JSON.stringify(info));
    logger.info({
      msg: "注册服务",
      key,
      info,
    });
  }

  /**
   * 注销服务
   */
  async deregisterService() {
    for (const key of this.keys) {
      await etcd.delete().key(key).exec();
      logger.info({
        msg: "注销服务",
        key,
      });
    }
  }

  async getService(name: string, env = config.env) {
    const key = `/node/discover/${env}/${name}/`;
    const map = (await etcd.getAll().prefix(key).json()) as Record<string, ServiceInfo>;
    const keys = Object.keys(map);
    const len = keys.length;
    const services = new Array<ServiceInfo>(len);
    for (let i = 0; i < len; i++) {
      services[i] = map[keys[i]];
    }
    return services;
  }

  async onServiceChange(handler: (infos: ServiceInfo[]) => void, name: string, env = config.env) {
    const key = `/node/discover/${env}/${name}/`;
    const watcher = await etcd.watch().prefix(key).create();
    watcher.on("data", async () => {
      handler(await this.getService(name, env));
    });
  }
}

export const discover = new Discover();
