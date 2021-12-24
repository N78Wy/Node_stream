import Redlock from "redlock";
import { errors, redis } from "../global";
import { md5 } from "../global/base/utils";
import { Context } from "../web";

const lockKey = (value: string) => `loginLock:${value}`;
const LOCK_TTL = 3000;

export default function loginLock(key: string) {
  return async function (ctx: Context) {
    let lock: Redlock.Lock;

    let value = ctx.request.$params[key];

    if (value === undefined) {
      return ctx.next();
    }

    if (value.length > 64) {
      value = md5(value);
    }

    try {
      lock = await new Redlock([redis]).lock(lockKey(value), LOCK_TTL);
    } catch (e) {
      throw new errors.RateLimited();
    }

    ctx.onFinish(async () => {
      await lock.unlock();
    });

    ctx.next();
  };
}
