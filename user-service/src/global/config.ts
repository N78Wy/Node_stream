/**
 * @file config
 * @author Yourtion Guo <yourtion@gmail.com>
 */

import fs from "fs";
import _ from "lodash";
import path from "path";
import { IConfig } from "./gen/config.gen";
import { etcd } from "./etcd";
import { pkg } from "./pkg";
import { EventEmitter } from "events";
import { logger } from "./logger";
import { hostname } from "os";
import toml from "@iarna/toml";

export const env = process.env.NODE_ENV || "dev";
// 不用pm2启动时固定为主进程,使用pm2启动时,将第一个进程作为主进程
export const isMasterInstance = process.env.NODE_APP_INSTANCE === undefined || process.env.NODE_APP_INSTANCE === "0";
const ispro = env === "production";

// 数组使用覆盖,不要合并
function customizeMerge(objValue: any, srcValue: any) {
  if (_.isArray(objValue)) {
    return srcValue;
  }
}

export let config = {
  env,
  ispro,
} as IConfig;

// 修正在 watch 模式下 MaxListenersExceededWarning
if (!ispro) {
  process.stdout.setMaxListeners(Infinity);
}

export function setConfig(c: any) {
  config = c;
}

class ConfigLoader extends EventEmitter {
  // 配置,越后面的优先级越高
  private configs: any[] = [];

  constructor(private readonly type: "remote" | "file" | string = "file") {
    super();
  }

  /**
   * 加载配置
   */
  async load() {
    if (this.type !== "remote") {
      await this.loadLocal();
      return config;
    }

    // 尝试连接配置中心
    try {
      await etcd.get("/node/");
      await this.loadRemote();
    } catch (err) {
      setTimeout(async () => {
        logger.info({
          msg: "尝试重新连接配置中心",
        });
        await this.load();
      }, 60000);
      logger.error({
        msg: "连接配置中心失败,已回退至文件配置",
        err,
      });
      await this.loadLocal();
    }
    return config;
  }

  /**
   * 配置下线
   */
  async unload() {
    if (!isMasterInstance || this.type !== "remote") {
      return;
    }

    this.syncRemoteConfigToLocal();
  }

  private syncRemoteConfigToLocal() {
    const baseConfig = {};
    const envConfig = {};
    for (const c of this.configs.slice(0, -1)) {
      _.mergeWith(baseConfig, c, customizeMerge);
      _.mergeWith(envConfig, c, customizeMerge);
    }
    _.mergeWith(envConfig, this.configs[this.configs.length - 1], customizeMerge);
    ConfigLoader.writeLocalConfig("base.toml", toml.stringify(baseConfig));
    ConfigLoader.writeLocalConfig(`${env}.toml`, toml.stringify(envConfig));
    logger.info({
      msg: "同步配置中心配置至本地",
      filenames: ["base.toml", `${env}.toml`],
    });
  }

  private async loadLocal() {
    this.configs.length = 0;
    const files = ["base", env, `${env}.${process.env.NODE_APP_INSTANCE || 0}`];
    for (let i = 0, len = files.length; i < len; i++) {
      this.configs[i] = toml.parse(ConfigLoader.readLocalConfig(files[i] + ".toml"));
    }
    this.updateConfig();
  }

  /**
   * 读取配置中心配置
   * @private
   */
  private async loadRemote() {
    this.configs.length = 0;
    const host = hostname();
    const keys = [
      // 全局配置
      `/node/global/config/base.toml`,
      `/node/global/config/${env}.toml`,
      // 个人全局配置
      `/node/${pkg.username}/global/config/base.toml`,
      `/node/${pkg.username}/global/config/${env}.toml`,
      // 机器配置
      `/node/${pkg.username}/machine/${host}/config/base.toml`,
      `/node/${pkg.username}/machine/${host}/config/${env}.toml`,
      // 项目配置
      `/node/${pkg.username}/projects/${pkg.name}/config/base.toml`,
      `/node/${pkg.username}/projects/${pkg.name}/config/${env}.toml`,
    ];
    logger.info({
      msg: "读取配置中心配置",
      keys,
    });

    for (let i = 0, len = keys.length; i < len; i++) {
      const key = keys[i];
      const filename = key.slice(key.lastIndexOf("/") + 1);
      const exists = await etcd.get(key).exists();

      if (!exists && isMasterInstance) {
        if (key.includes("/projects/")) {
          logger.info({
            msg: "初始化项目配置",
            key,
          });
          await etcd.put(key).value(ConfigLoader.readLocalConfig(filename)).exec();
        } else if (!key.startsWith("/node/global/")) {
          logger.info({
            msg: "初始化个人全局配置",
            key,
          });
          await etcd.put(key).value("").exec();
        }
      }

      this.configs[i] = toml.parse((await etcd.get(key).string("utf8")) || "");
      const watcher = await etcd.watch().key(key).create();
      watcher.on("put", async () => {
        try {
          const value = (await etcd.get(key).string("utf8")) || "";
          this.configs[i] = toml.parse(value);
          logger.info({
            msg: "配置中心配置更新",
            key,
          });
          this.updateConfig();
          this.syncRemoteConfigToLocal();
        } catch (err) {
          logger.error({
            msg: "配置中心配置更新失败",
            key,
            err,
          });
        }
      });
    }
    this.updateConfig();
  }

  private static getPath(filename: string) {
    return path.resolve(__dirname, "../../config", filename);
  }

  private static writeLocalConfig(filename: string, value: string) {
    logger.info("写入本地配置%s", filename);
    fs.writeFileSync(this.getPath(filename), value);
  }

  private static readLocalConfig(filename: string) {
    const filepath = this.getPath(filename);
    if (!fs.existsSync(filepath)) {
      logger.info("配置%s不存在,忽略", filename);
      return "";
    }

    logger.info("读取配置%s", filename);
    return fs.readFileSync(filepath, "utf8");
  }

  private updateConfig() {
    const oldConfig = _.cloneDeep(config);
    const newConfig: any = {};
    Object.assign(newConfig, {
      env,
      ispro,
    });
    for (const c of this.configs) {
      _.mergeWith(newConfig, c, customizeMerge);
    }
    // 清除所有属性,再设置上去,不要使用 config = newConfig,防止破坏引用
    for (const key of Object.keys(config)) {
      delete config[key];
    }
    Object.assign(config, newConfig);
    this.emit("update", oldConfig, _.cloneDeep(newConfig));
  }

  on(event: "update", listener: (oldConfig: IConfig, newConfig: IConfig) => void): this {
    return super.on(event, listener);
  }

  emit(event: "update", oldConfig: IConfig, newConfig: IConfig): boolean {
    return super.emit(event, oldConfig, newConfig);
  }
}

export let configLoader = new ConfigLoader(process.env.NODE_CONFIG_TYPE);

export function setConfigLoader(c: ConfigLoader) {
  // 转移以监听的事件
  for (const listener of configLoader.listeners("update")) {
    c.on("update", listener as any);
  }
  configLoader = c;
}
