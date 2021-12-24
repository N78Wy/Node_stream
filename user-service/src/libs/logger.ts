import pino from "pino";
import { Context } from "../web";
import { IError } from "../global";

export function loggerMiddleware(defaultLevel: pino.Level = "info") {
  return function (ctx: Context) {
    const start = Date.now();
    let err: any;
    ctx.onError((e) => {
      err = e;
    });

    ctx.onFinish(function () {
      let level = defaultLevel;
      const spent = Date.now() - start;
      const obj: Record<string, any> = {
        ...ctx.request.headers,
        ...ctx.session.data,
        statusCode: ctx.response.statusCode,
        type: "access",
        spent,
        err,
        method: ctx.request.method,
        ip: ctx.request.$ip,
        params: ctx.request.params,
        query: ctx.request.query,
        body: ctx.request.body,
        response: ctx.response.body,
      };

      if (obj.statusCode >= 500) {
        level = "error";
      } else if (err) {
        level = "error";
        if (err instanceof Error && "code" in err) {
          const e = err as IError;
          // 内部错误或数据库错误则是error,其他是warn
          level = e.code === -1000 || e.code === -1007 ? "error" : "warn";
        }
        obj.code = err.code || -1;
      } else if (obj.statusCode >= 400 || spent >= 1000) {
        level = "warn";
      }
      ctx.log[level](obj);
    });

    ctx.next();
  };
}
