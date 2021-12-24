import { BaseModel, CoreGen } from "../core";
import { DataSourceName, mysqlDataSources } from "../global";
import { PoolConnection } from "mysql2/promise";

export class ModelEnhancer extends CoreGen<BaseModel> {
  /**
   * 各数据源事务连接
   * @protected
   */
  protected connections?: Record<DataSourceName, PoolConnection>;
  /**
   * 事务名
   * @protected
   */
  protected transactionName?: string;
  /**
   * 使用的数据源
   * @protected
   */
  protected dataSource: DataSourceName = "default";
  protected modelDataSource: DataSourceName | undefined;

  protected getCache<V extends BaseModel>(key: symbol, ins: new (...args: any) => V): V {
    if (!this.cache.has(key)) {
      const self = this;
      const instance = new ins(this.ctx, {
        get dataSource() {
          return self.modelDataSource || self.dataSource;
        },
        set dataSource(dataSource: DataSourceName) {
          self.modelDataSource = dataSource;
        },
        get connection() {
          return new Promise(async (resolve) => {
            self.modelDataSource = this.dataSource;
            const dataSource = self.modelDataSource || self.dataSource;
            const connections = self.connections;

            if (connections) {
              if (!connections[dataSource]) {
                await self.beginTransaction(self.transactionName!);
              }

              return resolve(connections[dataSource]);
            }

            return resolve(mysqlDataSources[dataSource]);
          });
        },
      });
      this.cache.set(key, instance);
    }
    return this.cache.get(key) as V;
  }

  useDataSource(dataSource: DataSourceName) {
    if (!mysqlDataSources[dataSource]) {
      throw new this.ctx.errors.DatabaseError(`数据源 ${dataSource} 不存在`);
    }
    this.ctx.log.debug("使用数据源[%s]", dataSource);
    this.dataSource = dataSource;
  }

  async beginTransaction(name: string) {
    const { errors, log } = this.ctx;

    if (!name) {
      throw new errors.DatabaseError("`name` 不能为空");
    }

    if (!this.connections) {
      this.connections = {} as any;
    }

    const dataSource = this.modelDataSource || this.dataSource;
    const connections = this.connections!;
    if (connections[dataSource]) {
      log.debug(`合并数据源[%s]事务[%s]`, dataSource, name);
      return;
    }

    const conn = await mysqlDataSources[dataSource].getConnection();
    connections[dataSource] = conn;
    await conn.beginTransaction();
    this.transactionName = name;
    log.debug(`开始数据源[%s]事务[%s]`, dataSource, name);
  }

  async endTransaction() {
    if (!this.connections) {
      return;
    }

    const { log } = this.ctx;
    const dataSources = Object.keys(this.connections) as DataSourceName[];
    const name = this.transactionName;
    for (const dataSource of dataSources) {
      const conn = this.connections[dataSource];
      try {
        await conn.commit();
        log.debug("commit数据源[%s]事务[%s]成功", dataSource, name);
      } catch (err) {
        await conn.rollback();
        log.error({
          msg: `commit数据源[${dataSource}]事务[${name}]失败`,
          dataSources,
          err,
        });
      } finally {
        await conn.release();
      }
    }
    this.releaseTransaction();
  }

  async rollbackTransaction() {
    if (!this.connections) {
      return;
    }

    const { log } = this.ctx;
    const dataSources = Object.keys(this.connections) as DataSourceName[];
    const name = this.transactionName;
    for (const dataSource of dataSources) {
      const conn = this.connections[dataSource];
      try {
        await conn.rollback();
        log.debug("回滚数据源[%s]事务[%s]成功", dataSource, name);
      } catch (err) {
        log.error({
          msg: `回滚数据源[${dataSource}]事务[${name}]失败`,
          dataSources,
          err,
        });
      } finally {
        await conn.release();
      }
    }
    this.releaseTransaction();
  }

  protected releaseTransaction() {
    // 防止释放连接后还被使用
    this.connections = undefined;
  }
}
