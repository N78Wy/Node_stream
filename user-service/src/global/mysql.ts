/**
 * @file
 * @author Yourtion Guo <yourtion@gmail.com>
 */
import { createPool, Pool, PoolOptions } from "mysql2/promise";
import { logger } from "./logger";
import { IConfig } from "./gen/config.gen";

export type DataSourceName = keyof IConfig["mysql"]["dataSources"] | "default";

export let mysql!: Pool;
export let mysqlDataSources = {} as Record<DataSourceName, Pool>;

export async function newMysql(config: PoolOptions, dataSource: DataSourceName = "default") {
  const client = createPool(config);
  const conn = await client.getConnection();
  logger.debug("MySQL dataSource %s connected", dataSource);
  conn.release();
  return client;
}

export function setGlobalMysql(client: Pool, dataSources?: Record<DataSourceName, Pool>) {
  mysql = client;

  if (dataSources) {
    for (const key of Object.keys(dataSources) as DataSourceName[]) {
      mysqlDataSources[key] = dataSources[key];
    }
  }
}

export function clearMysqlDataSource() {
  for (const key of Object.keys(mysqlDataSources)) {
    delete (mysqlDataSources as any)[key];
  }
}
