/**
 * @file 中间件
 * @author Yourtion Guo <yourtion@gmail.com>
 */
import { Context } from "../web";
const env = process.env.NODE_ENV || "dev";

/**
 * 后门接口生产环境屏蔽掉
 * @param ctx
 */
export async function blockBackApi(ctx: Context) {
  if (/^\/api\/back/.test((ctx.request.req as any).originalUrl) && env == "production") {
    throw new ctx.errors.PermissionsError("该接口不允许生成环境访问");
  }
  ctx.next();
}
