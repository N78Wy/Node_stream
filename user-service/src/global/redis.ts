/**
 * @file Redis 初始化
 * @author Yourtion Guo <yourtion@gmail.com>
 */

import Redis from "ioredis";
import { logger } from "./logger";
import { pkg } from "./pkg";

export let redis!: Redis.Redis;

export async function newRedis(config: Redis.RedisOptions) {
  const client = new Redis({
    ...config,
    keyPrefix: config.keyPrefix || pkg.shortName + ":",
  });
  logger.debug("Redis connected");
  client.on("error", (err) => logger.error(err));
  return client;
}

export function setGlobalRedis(client: Redis.Redis) {
  redis = client;
}
