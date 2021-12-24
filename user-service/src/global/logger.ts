/**
 * @file 日志类
 * @author Yourtion Guo <yourtion@gmail.com>
 */

import path from "path";
import { createWriteStream } from "fs";
import pino from "pino";
import dayjs from "dayjs";
import { pkg } from "./pkg";
import { IConfigLogger } from "./gen/config.gen";

/**
 * 日志接口
 *
 * 级别排序为：TRACE < DEBUG < INFO < WARN < ERROR < FATAL。默认级别为DEBUG。
 * 开发环境中开TRACE，在线上环境开INFO
 */
export interface ILogger {
  /**
   * 追踪
   *
   * 输出详尽的调试信息，只是开发阶段使用
   */
  trace(format: Error | object | any, ...params: any[]): void;

  /**
   * 调试
   *
   * 用于细粒度信息事件，调试程序的时候需要的关注的事情
   */
  debug(format: Error | object | any, ...params: any[]): void;

  /**
   * 信息
   *
   * 突出强调应用程序的运行过程，或者用于记录程序运行状态
   * （如：mysql 执行）
   */
  info(format: Error | object | any, ...params: any[]): void;

  /**
   * 警告
   *
   * 出现潜在错误的情形，但是错误为预料之内，已经被捕获处理
   * （如：外部请求出错、数据库慢查询）
   */
  warn(format: Error | object | any, ...params: any[]): void;

  /**
   * 错误
   *
   * 虽然发生错误事件，但仍然不影响系统的继续运行，但是需要引起重视的
   * （如：请求返回预期外的结果）
   */
  error(format: Error | object | any, ...params: any[]): void;

  /**
   * 严重错误
   *
   * 错误事件将会导致应用程序的退出
   * （一般不使用，因为程序在最外层做了错误捕获）
   */
  fatal(format: Error | object | any, ...params: any[]): void;

  /**
   * 创建子logger
   * @param bindings
   */
  child(bindings: Record<string, any>): ILogger;

  /**
   * 刷新日志到硬盘
   */
  flush(): void;
}

// 在 PM2 以 cluster 模式部署时候需要注意不同实例写入不同文件
// 再指定的环境 再创建可写流
function createFileStream() {
  return createWriteStream(path.resolve(__dirname, `../../logs/web.${process.env.NODE_APP_INSTANCE || 0}.log`), {
    flags: "a+",
  });
}

export function newLogger(
  { out, level, prettyPrint }: IConfigLogger = { level: "debug", out: "console", prettyPrint: true }
): ILogger {
  const stream = out === "file" ? createFileStream() : process.stdout;
  const format = "YYYY-MM-DD HH:mm:ss.SSS";
  const opt: pino.LoggerOptions = {
    level: level || "debug",
    base: null,
    prettyPrint:
      out !== "file" && prettyPrint
        ? ({ timeTransOnly: true, forceColor: true, translateTime: "SYS:HH:MM:ss.l" } as any)
        : false,
    serializers: {
      // 该参数的作用是 改变对应下面配置的 key 的顶级属性,只遍历指定属性，防止展开过多的属性影响性能
      err: pino.stdSerializers.err,
      req: pino.stdSerializers.req,
      res: pino.stdSerializers.res,
    } as Record<string, any>,
    timestamp() {
      return `,"time":"${dayjs().format(format)}"`;
    },
    formatters: {
      level(level) {
        return {
          level,
        };
      },
    },
  };

  return pino(opt, stream).child({ srv: pkg.name });
}

export let logger = newLogger();

export function setGlobalLogger(l: ILogger) {
  logger = l;
}
