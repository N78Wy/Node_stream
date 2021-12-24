/**
 * @file api安全中间件,主要用于接口防刷
 */
import ms from "ms";
import { redis } from "../global";
import { Context } from "../web";
import { md5 } from "../global/base/utils";
import { ErrorReason } from "@gz/web";

export enum SignFailType {
  // 没携带签名
  NoSign = 1,
  // 已过期的签名
  ExpiredSign,
  // 错误的签名
  ErrorSign,
}

export type SignOptions = {
  // 秘钥,用于生成签名,需要跟前端协商保持一致
  secret: string;
  // 签名带有时间戳,允许该时间戳与服务器之间的误差不超过多少ms,默认1分钟
  allowTimeErrorMs?: number;
  // 验证失败后的错误处理,默认直接抛错
  failHandler?(ctx: Context, failType: SignFailType): void;
  // 是否启用请求头混淆,启用后签名等信息不再从常规的x-Signature请求头里拿
  // 而是从cookle拿,注意是l不是i
  // 之所以用cookle是为了迷惑攻击者,攻击者即使知道签名计算方法也难以找到放签名的位置
  confuse?: boolean;
  shouldCheckSign?(ctx: Context): boolean;
};

const defaultSignFailHandler = (ctx: Context, failType: SignFailType) => {
  switch (failType) {
    case SignFailType.NoSign:
      throw new ctx.errors.ExceInvalidError("签名没有携带");
    case SignFailType.ExpiredSign:
      throw new ctx.errors.ExceInvalidError("签名已过期");
    case SignFailType.ErrorSign:
      throw new ctx.errors.ExceInvalidError("签名错误");
  }
};

/**
 * 检查签名,一定程度上能防止用户绕过前端界面直接用脚本调用接口
 * @param options
 */
export function checkSignMiddleware(options: SignOptions) {
  return async (ctx: Context) => {
    const { config } = ctx;

    if (!config.sign.enable || (options.shouldCheckSign ? !options.shouldCheckSign(ctx) : false)) {
      return ctx.next();
    }

    const { allowTimeErrorMs = 60000, secret, failHandler = defaultSignFailHandler, confuse } = options;

    const headers = ctx.request.headers;
    const log = ctx.log.child({
      ...headers,
      ...ctx.session.data,
      ip: ctx.request.$ip,
      params: ctx.request.params,
      query: ctx.request.query,
      body: ctx.request.body,
    });
    let nonce: string;
    let sign: string;
    const timestamp = headers["x-timestamp"] as string;

    if (confuse) {
      if (!headers.cookle) {
        log.warn("签名没有携带");
        return failHandler(ctx, SignFailType.NoSign);
      }

      [nonce, sign] = (headers.cookle as string).split("|").slice(-2);
    } else {
      nonce = headers["x-nonce"] as string;
      sign = headers["x-signature"] as string;
    }

    if (!nonce || !timestamp || !sign) {
      log.warn("签名没有携带");
      return failHandler(ctx, SignFailType.NoSign);
    }

    const timeError = Date.now() - parseInt(timestamp, 10);

    if (timeError > allowTimeErrorMs || timeError < -allowTimeErrorMs) {
      log.warn("签名已过期");
      return failHandler(ctx, SignFailType.ExpiredSign);
    }

    const requestParams: Record<string, any> = {
      // 不能用ctx.request.$params,因为执行签名的时候可能还没这个参数
      // 同时不能加路径参数,因为前端不会将路径参数用于签名
      ...ctx.request.query,
      ...ctx.request.body,
      timestamp,
      nonce,
      salt: secret,
    };
    if (ctx.request.getHeader("authorization")) {
      requestParams.token = ctx.session.id;
    }
    const keys = Object.keys(requestParams);
    const params = new Array<string>(keys.length);
    keys.sort();
    for (let i = 0, len = keys.length; i < len; i++) {
      const key = keys[i];
      const val = requestParams[key];
      params[i] = `${key}=${val}`;
    }
    if (md5(params.join("&")) !== sign) {
      log.warn("签名错误");
      return failHandler(ctx, SignFailType.ErrorSign);
    }

    ctx.next();
  };
}

export type BlockFrequentlyOptions = {
  // 一定时间内最多可以请求多少次
  limit: number;
  // 时间,如 1s, 2m, 3d, 4h, 格式具体可看 https://github.com/vercel/ms
  limitTime: string;
  // 封禁多久,格式同limitTime
  blockTime: string;
  // 获取计数用的key
  getKey(ctx: Context): string;
  // 封禁后如何处理,默认抛错
  blockHandler?(ctx: Context): void;
};

const defaultBlockFrequentlyHandler = (ctx: Context) => {
  throw new ctx.errors.RateLimited();
};

redis.defineCommand("blockFrequently", {
  numberOfKeys: 2,
  lua: `
-- KEYS[1] 计数key
-- ARGV[1] 多少ms内
-- ARGV[2] 几次
-- ARGV[3] 封禁时间(ms)
if redis.call('exists', KEYS[1]) == 0
then
  redis.call('psetex', KEYS[1], ARGV[1], '1')
  return 1
end

local num = redis.call('incr', KEYS[1])
if num == tonumber(ARGV[2]) + 1
then
  redis.call('pexpire', KEYS[1], ARGV[3])
end
return num
`,
});

declare module "ioredis" {
  interface Redis {
    blockFrequently(key: string, limitMs: number, limit: number, blockMs: number): Promise<number>;
  }
}

/**
 * 如果接口一定时间内请求过多,对其作出特殊处理
 * @param options
 * @example
 * api
 *   .get('/test')
 *   .middleware(blockFrequently({
 *     // 30秒同个ip最多请求20次
 *     getKey(ctx: Context) {
 *       return `block:${ctx.request.$ip}`
 *     },
 *     limit: 20,
 *     limitTime: "30s",
 *     // 否则封禁15天
 *     blockTime: "15d",
 *     // 封禁处理,可选择报错或者再抽奖接口固定返回不中奖
 *     blockHandler(ctx: Context) {
 *       throw new ctx.errors.RateLimited("请求太多了,休息一下吧")
 *     }
 *   }))
 */
export function blockFrequently(options: BlockFrequentlyOptions) {
  return async (ctx: Context) => {
    const { limit, limitTime, blockTime, getKey, blockHandler = defaultBlockFrequentlyHandler } = options;
    const key = getKey(ctx);
    const times = await redis.blockFrequently(key, ms(limitTime), limit, ms(blockTime));
    if (times > limit) {
      ctx.log.warn({
        ...ctx.request.headers,
        ip: ctx.request.$ip,
        params: ctx.request.params,
        query: ctx.request.query,
        body: ctx.request.body,
        limit,
        blockTime,
        limitTime,
        key,
        times,
        msg: "请求接口次数过多",
      });
      return blockHandler(ctx);
    }
    ctx.next();
  };
}

const defaultBlockFrequentlyFailHandler = (ctx: Context) => {
  throw new ctx.errors.RateLimited("错误次数过多,请稍后重试");
};

export type BlockFrequentlyFailOptions = BlockFrequentlyOptions & {
  // 如果接口没报错,是否重置之前累计的报错次数,默认重置
  resetOnSuccess?: boolean;
  shouldIgnoreError?(err: ErrorReason): boolean;
};

/**
 * 如果接口一定时间报错过多,对其作出特殊处理
 * @param options
 */
export function blockFrequentlyFail(options: BlockFrequentlyFailOptions) {
  return async (ctx: Context) => {
    const {
      getKey,
      limit,
      limitTime,
      blockHandler = defaultBlockFrequentlyFailHandler,
      blockTime,
      resetOnSuccess = true,
      shouldIgnoreError,
    } = options;
    const key = getKey(ctx);
    const times = await redis.blockFrequently(key, ms(limitTime), limit, ms(blockTime));
    if (times > limit) {
      ctx.log.warn({
        ...ctx.request.headers,
        ...ctx.session.data,
        ip: ctx.request.$ip,
        params: ctx.request.params,
        query: ctx.request.query,
        body: ctx.request.body,
        limit,
        blockTime,
        limitTime,
        key,
        times,
        msg: "请求接口报错次数过多",
      });
      return blockHandler(ctx);
    }
    let success = true;
    ctx.onError(async (err) => {
      success = shouldIgnoreError ? !shouldIgnoreError(err) : false;
    });
    if (resetOnSuccess) {
      // 成功时删除错误次数
      ctx.onFinish(async () => {
        success && (await redis.del(key));
      });
    }
    ctx.next();
  };
}
