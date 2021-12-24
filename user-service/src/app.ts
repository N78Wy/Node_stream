/**
 * @file app 入口文件
 */

import { resolve } from "path";
import { component, Context } from "./web";
import {
  config,
  configLoader,
  DataSourceName,
  errors,
  logger,
  Model,
  newLogger,
  newMysql,
  newRedis,
  Service,
  setGlobalLogger,
  setGlobalMysql,
  setGlobalRedis,
} from "./global";
import { apiService } from "./api";
import "dayjs/locale/zh-cn";
import * as base from "@gz/web";
import "./event-bus";
import dayjs from "dayjs";
import cluster from "cluster";
import { Pool } from "mysql2/promise";

dayjs.locale("zh-cn");

export class Application extends base.Application<Context> {
  /** 日志 */
  public log = logger.child({ type: "app" });
  /** 错误信息 */
  public errors = errors;
  /** 配置 */
  public config = config;
  /** 服务 */
  public service = new Service(this);
  /** 模型 */
  public model = new Model(this);
  protected contextConstructor = Context;

  async start() {
    const { compose, overrideConfigLoader, checkFrameworkVersionCompatible } = require("./compose");
    // 先覆盖所有模块configLoader实例,否则第一次配置加载无法触发update事件
    overrideConfigLoader();
    configLoader.on("update", async (oldConfig, newConfig) => {
      logger.info("配置加载成功");
      if (JSON.stringify(oldConfig.logger) !== JSON.stringify(newConfig.logger)) {
        logger.flush();
        const l = newLogger(newConfig.logger);
        setGlobalLogger(l);
        this.log = l;
      }
    });
    const config = await configLoader.load();
    if (config.mysql?.dataSources) {
      const dataSources = {} as Record<DataSourceName, Pool>;
      const keys = Object.keys(config.mysql.dataSources) as DataSourceName[];
      if (!keys.includes("default")) {
        throw new Error("mysql dataSource must include default");
      }
      for (const key of keys) {
        dataSources[key] = await newMysql(config.mysql.dataSources[key], key);
      }
      setGlobalMysql(dataSources.default, dataSources);
    }
    config.redis && setGlobalRedis(await newRedis(config.redis));

    // 配置初始化完毕,覆盖各模块mysql,redis等实例
    compose();
    const { router } = require("./routers");
    // 检查项目内依赖的服务版本是否兼容服务内依赖的服务版本
    checkFrameworkVersionCompatible();
    // 静态文件
    this.use("/h5", component.serveStatic(resolve(__dirname, "../public/h5")));
    this.use("/admin", component.serveStatic(resolve(__dirname, "../public/admin")));
    this.use(apiService.privateInfo.info.basePath || "/", router);
    if (!process.env.RUN_CODE) {
      await global.eventBus.emit("app:start", { app: this, isMaster: cluster.isMaster });
    }
  }
}

export const app = new Application();
