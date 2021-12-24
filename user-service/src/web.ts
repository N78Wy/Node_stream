import * as base from "@gz/web";
import { TemplateRenderData } from "@gz/web";
import * as send from "send";
import { Query, RowDataPacket } from "mysql2/promise";
import { config, errors, ILogger, logger, Model, pkg, Service, utils } from "./global";
import { Readable } from "stream";

export * from "@gz/web";

export type MiddlewareHandle = (ctx: Context, err?: base.ErrorReason) => Promise<void> | void;

export class Router extends base.Router<Context> {
  protected contextConstructor = Context;
}

export class Context extends base.Context<Request, Response> {
  protected requestConstructor = Request;
  protected responseConstructor = Response;

  /** 请求ID */
  public $reqId = "";
  /** 错误信息 */
  public errors = errors;
  /** 配置 */
  public config = config;
  /** 服务 */
  public service = new Service(this);
  /** 模型 */
  public model = new Model(this);
  /** 日志 */
  public log!: ILogger;

  /** 请求的接口名称 */
  public title = "";

  public inited() {
    this.$reqId = this.$reqId || String(this.request.getHeader("X-Request-Id") || utils.createRequestId());
    this.log = this.log || logger.child({ reqId: this.$reqId, path: (this.request.req as any).originalUrl });
    this.response.setHeader("X-Request-Id", this.$reqId);
    this.response.setHeader("X-Project", pkg.name || "");
  }
}

// 扩展 Request
export class Request extends base.Request {
  /** 参数 */
  public $params: Record<string, any> = {};
  /** excel parse */
  public $sheet: any[] = [];

  /** IP地址 */
  public get $ip() {
    const ip = String(
      this.req.headers["x-real-ip"] || this.req.headers["x-forwarded-for"] || this.req.socket.remoteAddress
    ).match(/\d+\.\d+\.\d+\.\d+/);
    return (ip && ip[0]) || "";
  }

  /** User-Agent */
  public get $ua() {
    return this.headers["user-agent"] || "";
  }
}

// 扩展 Response
export class Response extends base.Response {
  public body: any;
  public originalResponseFunc?: () => Promise<any>;

  /** 返回成功 */
  public ok(data: any) {
    this.json({ ok: true, result: data !== undefined ? data : {} });
  }

  /** 返回 操作成功 操作失败 */
  public isOk(ok: boolean | number = true) {
    this.ok(ok ? "操作成功" : "操作失败");
  }

  public json(data: any) {
    this.body = data;
    this.originalResponseFunc = async () => {
      super.json(data);
    };
  }

  /**
   * 出错返回
   * @param err 错误
   * @param code 错误码
   */
  public err(err: any, code?: number) {
    const errMsg = err.message || JSON.stringify(err);
    this.json({
      ok: false,
      error_code: code || err.code || -1,
      message: errMsg,
      msg: err.msg || errMsg,
    });
  }

  /** 文件下载功能 */
  public download(filename: string, filetype: string, buffer: Buffer) {
    this.originalResponseFunc = async () => {
      this.type(filetype);
      this.setHeader("Content-Description", "File Transfer");
      this.setHeader("Content-Disposition", `attachment; filename=${filename}.${filetype}`);
      this.setHeader("Content-Length", String(buffer.length));
      this.end(buffer);
    };
  }

  /** 导出csv */
  public csv(filename: string, header: Array<String>, query: Query) {
    this.originalResponseFunc = async () => {
      this.setHeaders({
        "Content-Type": "application/octet-stream;charset=utf-8",
        "Content-Disposition": `attachment; filename=${filename}`,
      });
      this.write("\uFEFF");
      this.write(header.map((item) => utils.csvStringParser(item)).join(",") + "\n");
      query.on("result", (row: RowDataPacket) => {
        const arr = Object.keys(row).map((key: string) => row[key]);
        this.write(arr.map((item) => utils.csvStringParser(item)).join(",") + "\n");
      });
      query.on("end", () => {
        this.end();
      });
    };
  }

  public html(str: Buffer | string) {
    this.originalResponseFunc = async () => {
      super.html(str);
    };
  }

  public file(file: string, options: send.SendOptions) {
    this.originalResponseFunc = async () => {
      super.file(file, options);
    };
  }

  public redirectTemporary(url: string, content?: string) {
    this.originalResponseFunc = async () => {
      super.redirectTemporary(url, content);
    };
  }

  public redirectPermanent(url: string, content?: string) {
    this.originalResponseFunc = async () => {
      super.redirectPermanent(url, content);
    };
  }

  public async render(name: string, data?: TemplateRenderData) {
    this.originalResponseFunc = async () => {
      return super.render(name, data);
    };
  }

  public async gzip(data: string | Buffer | Readable, contentType?: string) {
    this.originalResponseFunc = async () => {
      return super.gzip(data, contentType);
    };
  }
}
