/**
 * @file base model 基础模块
 * @author Yourtion Guo <yourtion@gmail.com>
 */
import { AdvancedCondition, AdvancedUpdate, RawCondition } from "@leizm/sql";
import { strict as assert } from "assert";
import Knex from "knex";
import { Pool, PoolConnection, QueryOptions, ResultSetHeader } from "mysql2/promise";
import { XOR } from "ts-xor";
import { BaseModel } from "../core";
import { config, DataSourceName, errors, mysql } from "../global";
import { notifySlowSql } from "../libs/dingding";
import { Context } from "../web";

const knex = Knex({
  client: "mysql2",
});

export type TableField<T> = Extract<keyof T, string>;
export type TableFields<T> = ReadonlyArray<TableField<T>>;
export type TableRecord<TTable, TFields extends TableFields<TTable> = TableFields<TTable>> = {
  [P in Extract<keyof TTable, TFields[number]>]: TTable[P];
};
export type IRecord<K> = Partial<K> | Partial<Pick<AdvancedUpdate, keyof K>>;
export type IConditions<K> = Partial<K> | Partial<Pick<AdvancedCondition, keyof K>> | RawCondition;
export type IPrimary = string | number;
export type Orders<T> = ReadonlyArray<[TableField<T>, "ASC" | "DESC"]>;
export type WithJoinInnerTable<T> = T extends WithJoinTable<infer U, infer Options> ? U : never;

export type WithJoinOptions<T> = {
  where?: IConditions<T>;
  select?: TableFields<T>;
  orderBy?: Orders<T>;
  groupBy?: TableFields<T>;
  values?: any[];
  on: string;
};

export type WithJoinTable<
  T,
  TAlias extends string = string,
  TOptions extends WithJoinOptions<T> = WithJoinOptions<T>
> = {
  type: "LEFT" | "RIGHT" | "INNER";
  table: string;
  alias: TAlias;
  where?: TOptions["where"];
  select: NonNullable<TOptions["select"]>;
  orderBy?: TOptions["orderBy"];
  groupBy?: TOptions["groupBy"];
  values?: any[];
  on: string;
};

export type BaseQueryOptions = {
  // 数据库连接
  connection?: Pool | PoolConnection;
  // 使用哪个数据源
  dataSource?: DataSourceName;
};

export type JoinOptions<T, TAlias extends string = string> = BaseQueryOptions & {
  // 表别名
  readonly alias?: TAlias;
  where?: IConditions<T>;
  select?: TableFields<T>;
  orderBy?: Orders<T>;
  groupBy?: TableFields<T>;
  // 页数,从1开始
  page?: number;
  // 拿几个数据
  pageSize?: number;
  // 从第几个数据开始拿
  offset?: number;
  // 拿几个数据
  limit?: number;
  // 是否返回嵌套对象格式的数据
  nestTables?: boolean;
};

export type GetOneOptions<T> = BaseQueryOptions & {
  where?: IConditions<T>;
  select?: TableFields<T>;
  orderBy?: Orders<T>;
  groupBy?: TableFields<T>;
  distinct?: boolean;
};

export type GetOptions<T> = GetOneOptions<T> & {
  // 页数,从1开始
  page?: number;
  // 拿几个数据
  pageSize?: number;
  // 从第几个数据开始拿
  offset?: number;
  // 拿几个数据
  limit?: number;
};

export type UpdateOptions<T> = BaseQueryOptions & {
  where?: IConditions<T>;
  set: IRecord<T>;
  limit?: number;
};

export type DeleteOptions<T> = BaseQueryOptions & {
  where?: IConditions<T>;
  limit?: number;
};

export type InsertOptions<T> = BaseQueryOptions & {
  connection?: Pool | PoolConnection;
  value: Partial<T>;
  dataSource?: DataSourceName;
};

export type BatchInsertOptions<T> = BaseQueryOptions & {
  values: Partial<T>[];
} & XOR<
    { ignore?: true },
    {
      duplicate?: Partial<
        {
          [P in keyof T]:
            | T[P]
            | {
                /** x = VALUES(x) */
                $values?: true;
                /** x = VALUES(x) + y */
                $incr?: number;
                /** x = VALUES(x) - y */
                $decr?: number;
                /** x = y (y不做任何转义) */
                $raw?: {
                  sql: string;
                  values?: any[];
                };
              };
        }
      >;
    }
  >;

export type CountOptions<T> = BaseQueryOptions & {
  columns?: TableField<T> | TableFields<T> | string;
  where?: IConditions<T>;
  distinct?: boolean;
};

export type CreateOrUpdateOptions<T> = BaseQueryOptions & {
  connection?: Pool | PoolConnection;
  values: Partial<T> | Partial<T>[];
  set: IRecord<T>;
};

/** 删除对象中的 undefined */
function removeUndefined(object: Record<string, any>) {
  Object.keys(object).forEach((key) => object[key] === undefined && delete object[key]);
  return object;
}

function handleSet(builder: Knex.QueryBuilder, set: IRecord<any>) {
  const keys = Object.keys(set);
  for (let i = 0, len = keys.length; i < len; i++) {
    const key = keys[i];
    const val = set[key];

    switch (Object.prototype.toString.call(val)) {
      case "[object Object]":
        const opKeys = Object.keys(val as any);
        for (let j = 0, len = opKeys.length; j < len; j++) {
          const op = opKeys[j];
          const opVal = (val as any)[op];
          switch (op) {
            case "$incr":
              builder.increment(key, opVal);
              break;
            case "$decr":
              builder.decrement(key, opVal);
              break;
            case "$raw":
              builder.update({
                [key]: knex.raw(opVal),
              });
              break;
          }
        }
        break;
      default:
        builder.update(key, val);
        break;
    }
  }
}

/**
 * 返回根据对象生成的 SQL WHERE 语句
 */
function handleCondition(builder: Knex.QueryBuilder, condition: IConditions<any>): Knex.QueryBuilder {
  for (const key of Object.keys(condition)) {
    const val = (condition as any)[key];
    if (val === undefined) {
      continue;
    }
    if (Object.prototype.toString.call(val) === "[object Object]") {
      for (const op of Object.keys(val)) {
        switch (op) {
          case "$isNull":
            builder.whereNull(key);
            break;
          case "$isNotNull":
            builder.whereNotNull(key);
            break;
          case "$lt":
            builder.where(key, "<", val.$lt);
            break;
          case "$lte":
            builder.where(key, "<=", val.$lte);
            break;
          case "$gt":
            builder.where(key, ">", val.$gt);
            break;
          case "$gte":
            builder.where(key, ">=", val.$gte);
            break;
          case "$eq":
            builder.where(key, "=", val.$eq);
            break;
          case "$ne":
            builder.where(key, "<>", val.$ne);
            break;
          case "$in":
            builder.whereIn(key, val.$in);
            break;
          case "$notIn":
            builder.whereNotIn(key, val.$notIn);
            break;
          case "$like":
            builder.where(key, "LIKE", val.$like);
            break;
          case "$notLike":
            builder.where(key, "NOT LIKE", val.$notLike);
            break;
          case "$raw":
            builder.where(key, "=", val.$raw);
            break;
          default:
            throw new Error(`condition type ${op} does not supported`);
        }
      }
    } else {
      builder.where(key, "=", val);
    }
  }
  return builder;
}

/** 初始化参数 */
export interface IBaseOptions<T, TTableName> {
  table: string;
  tableWithoutPrefix: TTableName;
  /** 主键 key */
  primaryKey: string;
  /** 默认字段 */
  fields: TableFields<T>;
  /** 连接 */
  connection: Pool | PoolConnection;
  dataSource?: DataSourceName;
}

/**
 * @todo 下一版本会加入hook
 */
export interface ModelHooks<T> {
  before(type: "select", options: GetOptions<T>): Promise<void> | void;
  before(type: "update", options: UpdateOptions<T>): Promise<void> | void;
  before(type: "insert", options: InsertOptions<T>): Promise<void> | void;
  before(type: "batchInsert", options: BatchInsertOptions<T>): Promise<void> | void;
  before(type: "delete", options: DeleteOptions<T>): Promise<void> | void;

  after(type: "select", options: GetOptions<T>): Promise<void> | void;
  after(type: "update", options: UpdateOptions<T>): Promise<void> | void;
  after(type: "insert", options: InsertOptions<T>): Promise<void> | void;
  after(type: "batchInsert", options: BatchInsertOptions<T>): Promise<void> | void;
  after(type: "delete", options: DeleteOptions<T>): Promise<void> | void;
}

export default class Base<T, TTableName extends string> extends BaseModel {
  /**
   * Creates an instance of Base.
   * @param ctx
   * @param options
   */
  constructor(ctx: Context, public options: IBaseOptions<T, TTableName>) {
    super(ctx);
  }

  /** 数据库错误处理 */
  errorHandler(err: any) {
    const dataSource = this.options.dataSource || "default";
    const log = this.ctx.log;
    log.error({
      msg: `数据源[${dataSource}] 执行错误`,
      err,
      code: err.code,
      dataSource,
      sql: err.sql,
    });
    // 如果是自定义错误直接抛出
    if (err.code && !isNaN(err.code - 0)) throw err;
    // 判断条件
    switch (err.code) {
      case "ER_DUP_ENTRY":
        throw new errors.RepeatError();
      default:
        throw new errors.DatabaseError(err.sqlMessage || err);
    }
  }

  protected async runQuery<T extends any = any>(
    sqlOrOptions: string | QueryOptions,
    values?: readonly any[],
    connection?: Pool | PoolConnection,
    prepareStatement?: boolean
  ): Promise<T> {
    connection = connection || (await this.options.connection);
    const dataSource = this.options.dataSource;
    const sql = typeof sqlOrOptions === "string" ? sqlOrOptions : sqlOrOptions.sql;
    const log = this.ctx.log;
    log.debug({
      msg: `数据源[${dataSource}] - ${sql}`,
      values,
    });
    const startTime = Date.now();
    try {
      if (prepareStatement) {
        return (await connection.execute(sqlOrOptions as any, values))[0] as T;
      } else {
        return (await connection.query(sqlOrOptions as any, values))[0] as T;
      }
    } catch (err) {
      // 预编译语句可创建数量达到上限,尝试回退至客户端替换参数
      if (err.code === "ER_MAX_PREPARED_STMT_COUNT_REACHED") {
        log.error({
          msg: "预编译语句超限",
          sql,
          dataSource,
          values,
          err,
        });
        return this.runQuery<T>(sqlOrOptions, values, connection, false);
      }
      this.errorHandler(err);
      throw new errors.DatabaseError(err);
    } finally {
      const nowTime = Date.now();
      const spent = nowTime - startTime;
      if (spent > (config.orm?.logSlowQuery || 1000)) {
        log.warn("数据源[%s] 慢查询: [%dms] %s", dataSource, spent, sql);
        notifySlowSql(sql, spent);
      }
    }
  }

  /**
   * 查询方法（内部查询尽可能调用这个，会打印Log）
   * @param sql 数据库查询语句
   * @param values 参数
   * @param connection 数据库连接
   */
  async query<T = any>(
    sqlOrOptions: string | QueryOptions,
    values?: readonly any[],
    connection?: Pool | PoolConnection
  ) {
    return this.runQuery<T>(sqlOrOptions, values, connection, false);
  }

  /**
   * 执行sql语句,走预编译
   * @param sqlOrOptions
   * @param values
   * @param connection
   */
  async execute<T = any>(
    sqlOrOptions: string | QueryOptions,
    values: readonly any[],
    connection?: Pool | PoolConnection
  ) {
    // 关闭预编译或者没有参数都走query
    if (config.orm?.prepareStatement === false || !values || !values.length) {
      return this.query<T>(sqlOrOptions, values, connection);
    }

    return this.runQuery<T>(sqlOrOptions, values, connection, true);
  }

  /** QueryBuilder 生成器 */
  builder() {
    return knex.queryBuilder().table(this.options.table);
  }

  /** 清空表 */
  async truncateTable() {
    return this.query("TRUNCATE TABLE `" + this.options.table + "`;");
  }

  /**
   * 插入一条数据
   */
  async insert({ connection, value, dataSource }: InsertOptions<T>) {
    this.useDataSource(dataSource);
    const { sql, bindings } = this.builder().insert(removeUndefined(value)).toSQL();
    return this.execute<ResultSetHeader>(sql, bindings, connection);
  }

  /**
   * 批量插入数据
   * @example
   * //ignore
   * await ctx.model.batchInsert({
   *    values : [],
   *    ignore : true
   * })
   * //duplicate
   * await ctx.model.batchInsert({
   *    values : [],
   *    duplicate : {
   *        id : { $values : true }
   *    }
   * })
   */
  async batchInsert({ connection, values, ignore, duplicate, dataSource }: BatchInsertOptions<T>) {
    this.useDataSource(dataSource);
    assert(values.length > 0, "values不能为空数组");
    assert(!(ignore && duplicate), "ignore和duplicate不能同时使用");

    for (let i = 0, len = values.length; i < len; i++) {
      removeUndefined(values[i]);
    }

    let { sql, bindings } = this.builder().insert(values).toSQL();
    //ignore
    if (ignore) {
      sql = `INSERT IGNORE ${sql.slice(6)} `;
    } else if (duplicate) {
      let keys = Object.keys(duplicate);
      sql += `ON DUPLICATE KEY UPDATE `;
      const len = keys.length;
      let arr = new Array(len);
      for (let i = 0; i < len; i++) {
        const key = keys[i];
        const val = (duplicate as any)[key];

        if (Object.prototype.toString.call(val) === "[object Object]") {
          if (val.$values) {
            arr[i] = `${key}=VALUES(${key})`;
          } else if (val.$incr) {
            arr[i] = `${key}=VALUES(${key}) + ?`;
            (bindings as any).push(val.$incr);
          } else if (val.$decr) {
            arr[i] = `${key}=VALUES(${key}) - ?`;
            (bindings as any).push(val.$decr);
          } else if (val.$raw) {
            arr[i] = `${key}=${val.$raw.sql}`;
            if (val.$raw.values) {
              (bindings as any).push(...val.$raw.values);
            }
          } else {
            throw new this.ctx.errors.InternalError("不支持的类型");
          }
        } else {
          (bindings as any).push(val);
          arr[i] = `${key}=?`;
        }
      }
      sql = sql + arr.join(",");
    }
    return (await this.execute<ResultSetHeader>(sql, bindings, connection)).affectedRows;
  }

  async update({ connection, where, set, limit, dataSource }: UpdateOptions<T>) {
    this.useDataSource(dataSource);
    const builder = this.builder();
    if (where) {
      handleCondition(builder, where);
    }
    handleSet(builder, set);
    if (limit) {
      builder.limit(limit);
    }
    const { sql, bindings } = builder.toSQL();
    return (await this.execute<ResultSetHeader>(sql, bindings, connection)).affectedRows;
  }

  async updateByPrimary(primary: IPrimary, options: Omit<UpdateOptions<T>, "where">) {
    assert(primary, "primary不能为空");
    return this.update({
      where: {
        [this.options.primaryKey]: primary,
      },
      ...options,
    });
  }

  async createOrUpdate<TOptions extends CreateOrUpdateOptions<T>>({ connection, values, set, dataSource }: TOptions) {
    this.useDataSource(dataSource);
    if (Array.isArray(values)) {
      assert(values.length, "values不能为空数组");
    } else {
      assert(values, "values不能为空");
      removeUndefined(values);
    }
    const { sql, bindings } = this.builder().insert(values).toSQL();
    const builder = knex.queryBuilder();
    handleSet(builder, set);
    const updateSQL = builder.toSQL();
    return this.execute<ResultSetHeader>(
      `${sql} on duplicate key update ${updateSQL.sql.slice(12)}`,
      [...bindings, ...updateSQL.bindings],
      connection
    );
  }

  /**
   * 计算数据表 count
   */
  async count<TOptions extends CountOptions<T>>({ connection, where, columns = "*", distinct, dataSource }: TOptions) {
    this.useDataSource(dataSource);
    const builder = this.builder();
    if (where) {
      handleCondition(builder, where);
    }
    if (distinct) {
      builder.countDistinct({ c: columns });
    } else {
      assert(typeof columns === "string", "distinct为false的情况下,columns必须为string");
      builder.count({
        c: columns,
      });
    }
    const { sql, bindings } = builder.toSQL();
    return (await this.execute<{ c: number }[]>(sql, bindings, connection))[0].c;
  }

  async getOne<TOptions extends GetOneOptions<T>>(
    options?: TOptions
  ): Promise<TableRecord<T, NonNullable<TOptions["select"]>> | undefined> {
    return (
      await this.list<TOptions>({
        ...options,
        offset: 0,
        limit: 1,
      } as TOptions)
    )[0];
  }

  async getOneByPrimary<TOptions extends Omit<GetOneOptions<T>, "where">>(primary: IPrimary, options?: TOptions) {
    assert(primary, "primary不能为空");
    return this.getOne<TOptions>({
      where: {
        [this.options.primaryKey]: primary,
      },
      ...options,
    } as TOptions);
  }

  async list<TOptions extends GetOptions<T>>(
    {
      connection,
      where,
      select = this.options.fields,
      orderBy,
      offset = 0,
      limit = 999,
      distinct,
      groupBy,
      page,
      pageSize,
      dataSource,
    }: TOptions = {} as TOptions
  ) {
    this.useDataSource(dataSource);
    const builder = this.builder();

    if (distinct) {
      builder.distinct(...select);
    } else {
      builder.select(...select);
    }

    if (where) {
      handleCondition(builder, where);
    }

    if (orderBy) {
      for (const [column, by] of orderBy) {
        builder.orderBy(column, by);
      }
    }

    if (page && pageSize) {
      offset = (page - 1) * pageSize;
      limit = pageSize;
    }

    if (groupBy) {
      builder.groupBy(...groupBy);
    }

    const { sql, bindings } = builder.offset(offset).limit(limit).toSQL();
    return this.execute<TableRecord<T, NonNullable<TOptions["select"]>>[]>(sql, bindings, connection);
  }

  /**
   * 根据条件获取分页内容（比列表多出总数计算）
   */
  async page<TOptions extends GetOptions<T>>(options: TOptions) {
    const [list, count] = await Promise.all([this.list(options), this.count(options)]);
    return {
      list,
      count,
    };
  }

  async delete({ connection, where, limit = 1, dataSource }: DeleteOptions<T>) {
    this.useDataSource(dataSource);
    const builder = this.builder().delete();
    if (where) {
      handleCondition(builder, where);
    }
    const { sql, bindings } = builder.toSQL();
    // 不要用 builder.limit(limit),这货为了兼容postgre不支持limit
    (bindings as any).push(limit);
    return (await this.execute<ResultSetHeader>(sql + " LIMIT ?", bindings, connection)).affectedRows;
  }

  async deleteByPrimary(primary: IPrimary, options?: Omit<DeleteOptions<T>, "where">) {
    assert(primary, "primary不能为空");
    return this.delete({
      where: {
        [this.options.primaryKey]: primary,
      },
      ...options,
    });
  }

  /**
   * 执行事务（通过传入方法）
   *
   * @param {String} name
   * @param {Function} func
   */
  async transactions<TFn extends (conn: PoolConnection) => Promise<any>>(
    name: string,
    func: TFn
  ): Promise<ReturnType<TFn>> {
    const { errors, log } = this.ctx;
    if (!name) {
      throw new errors.DatabaseError("`name` 不能为空");
    }
    log.debug(`开始事务[${name}]`);
    const connection = await mysql.getConnection();
    await connection.beginTransaction(); // 开始事务
    try {
      const result = await func(connection);
      await connection.commit(); // 提交事务
      log.debug(`完成事务[${name}]`);
      return result;
    } catch (err) {
      // 回滚错误
      await connection.rollback();
      log.debug(`回退事务[${name}]`);
      this.errorHandler(err);
    } finally {
      connection.release();
    }
  }

  /**
   * @example
   * await model.user.join(
   * {
   *   select: ['id']
   * },
   * model.userPrize.withInnerJoin({
   *   on: 'user_prize.user_id = user.id',
   *   select: ['prize_name']
   * },
   * model.userTask.withInnerJoin({
   *   on: 'user_task.user_id = user.id',
   *   select: ['task_id']
   * }))
   */
  join<TOptions extends JoinOptions<T>, TTable1 extends WithJoinTable<any>>(
    options: TOptions,
    table1: TTable1
  ): Promise<
    Array<
      TOptions["nestTables"] extends true
        ? {
            [P in [TTableName][number]]: TableRecord<T, NonNullable<TOptions["select"]>>;
          } &
            {
              // @ts-ignore
              [P in TTable1["alias"]]: TableRecord<WithJoinInnerTable<TTable1>, TTable1["select"]>;
            }
        : TableRecord<T, NonNullable<TOptions["select"]>> &
            // @ts-ignore
            TableRecord<WithJoinInnerTable<TTable1>, NonNullable<TTable1["select"]>>
    >
  >;
  join<TOptions extends JoinOptions<T>, TTable1 extends WithJoinTable<any>, TTable2 extends WithJoinTable<any>>(
    options: TOptions,
    table1: TTable1,
    table2: TTable2
  ): Promise<
    Array<
      TOptions["nestTables"] extends true
        ? {
            [P in [TTableName][number]]: TableRecord<T, NonNullable<TOptions["select"]>>;
          } &
            {
              // @ts-ignore
              [P in TTable1["alias"]]: TableRecord<WithJoinInnerTable<TTable1>, TTable1["select"]>;
            } &
            {
              // @ts-ignore
              [P in TTable2["alias"]]: TableRecord<WithJoinInnerTable<TTable2>, TTable2["select"]>;
            }
        : TableRecord<T, NonNullable<TOptions["select"]>> &
            // @ts-ignore
            TableRecord<WithJoinInnerTable<TTable1>, NonNullable<TTable1["select"]>> &
            // @ts-ignore
            TableRecord<WithJoinInnerTable<TTable2>, NonNullable<TTable2["select"]>>
    >
  >;
  join<TOptions extends JoinOptions<T>, TTables extends WithJoinTable<any>[]>(
    options: TOptions,
    ...tables: TTables
  ): Promise<
    Array<
      TOptions["nestTables"] extends true
        ? {
            [P in [TTableName][number]]: TableRecord<T, NonNullable<TOptions["select"]>>;
          } &
            {
              [P in TTables[number]["alias"]]: TableRecord<
                WithJoinInnerTable<TTables[number]>,
                // @ts-ignore
                NonNullable<TTables[number]["select"]>
              >;
            }
        : TableRecord<T, NonNullable<TOptions["select"]>> & Record<string, any>
    >
  >;
  async join<TOptions extends JoinOptions<T>, TTables extends WithJoinTable<any>[]>(
    options: TOptions,
    ...tables: TTables
  ) {
    this.useDataSource(options.dataSource);
    const builder = knex.queryBuilder();
    this.buildJoinSql(builder, false, options, ...tables);
    const { sql, bindings } = builder.toSQL();
    return this.execute<any>({ sql, nestTables: options.nestTables }, bindings, options.connection);
  }

  /**
   * @example
   * await model.user.joinPage(
   * {
   *   select: ['id']
   * },
   * model.userPrize.withInnerJoin({
   *   on: 'user_prize.user_id = user.id',
   *   select: ['prize_name']
   * },
   * model.userTask.withInnerJoin({
   *   on: 'user_task.user_id = user.id',
   *   select: ['task_id']
   * }))
   */
  joinPage<TOptions extends JoinOptions<T>, TTable1 extends WithJoinTable<any>>(
    options: TOptions,
    table1: TTable1
  ): Promise<{
    list: Array<
      TOptions["nestTables"] extends true
        ? {
            [P in [TTableName][number]]: TableRecord<T, NonNullable<TOptions["select"]>>;
          } &
            {
              // @ts-ignore
              [P in TTable1["alias"]]: TableRecord<WithJoinInnerTable<TTable1>, TTable1["select"]>;
            }
        : TableRecord<T, NonNullable<TOptions["select"]>> &
            // @ts-ignore
            TableRecord<WithJoinInnerTable<TTable1>, NonNullable<TTable1["select"]>>
    >;
    count: number;
  }>;
  joinPage<TOptions extends JoinOptions<T>, TTable1 extends WithJoinTable<any>, TTable2 extends WithJoinTable<any>>(
    options: TOptions,
    table1: TTable1,
    table2: TTable2
  ): Promise<{
    list: Array<
      TOptions["nestTables"] extends true
        ? {
            [P in [TTableName][number]]: TableRecord<T, NonNullable<TOptions["select"]>>;
          } &
            {
              // @ts-ignore
              [P in TTable1["alias"]]: TableRecord<WithJoinInnerTable<TTable1>, TTable1["select"]>;
            } &
            {
              // @ts-ignore
              [P in TTable2["alias"]]: TableRecord<WithJoinInnerTable<TTable2>, TTable2["select"]>;
            }
        : TableRecord<T, NonNullable<TOptions["select"]>> &
            // @ts-ignore
            TableRecord<WithJoinInnerTable<TTable1>, NonNullable<TTable1["select"]>> &
            // @ts-ignore
            TableRecord<WithJoinInnerTable<TTable2>, NonNullable<TTable2["select"]>>
    >;
    count: number;
  }>;
  joinPage<TOptions extends JoinOptions<T>, TTables extends WithJoinTable<any>[]>(
    options: TOptions,
    ...tables: TTables
  ): Promise<{
    list: Array<
      TOptions["nestTables"] extends true
        ? {
            [P in [TTableName][number]]: TableRecord<T, NonNullable<TOptions["select"]>>;
          } &
            {
              [P in TTables[number]["alias"]]: TableRecord<
                WithJoinInnerTable<TTables[number]>,
                // @ts-ignore
                NonNullable<TTables[number]["select"]>
              >;
            }
        : TableRecord<T, NonNullable<TOptions["select"]>> & Record<string, any>
    >;
    count: number;
  }>;
  async joinPage<TOptions extends JoinOptions<T>, TTables extends WithJoinTable<any>[]>(
    options: TOptions,
    ...tables: TTables
  ) {
    this.useDataSource(options.dataSource);
    const builder = knex.queryBuilder();
    const countBuilder = knex.queryBuilder();
    this.buildJoinSql(builder, false, options, ...tables);
    this.buildJoinSql(countBuilder, true, options, ...tables);
    const { sql, bindings } = builder.toSQL();
    const { sql: countSql, bindings: countBindings } = countBuilder.toSQL();
    return {
      list: await this.execute<any>({ sql, nestTables: options.nestTables }, bindings, options.connection),
      count: (await this.execute<{ c: number }[]>({ sql: countSql }, countBindings, options.connection))[0].c,
    };
  }

  private buildJoinSql(
    builder: Knex.QueryBuilder,
    selectCount: boolean,
    options: JoinOptions<any>,
    ...tables: WithJoinTable<any>[]
  ) {
    options.select = options.select || this.options.fields;
    (options as any).alias = options.alias || this.options.tableWithoutPrefix;
    options.offset = options.offset ?? 0;
    options.limit = options.limit ?? 999;

    if (options.page && options.pageSize) {
      options.offset = (options.page - 1) * options.pageSize;
      options.limit = options.pageSize;
    }

    if (selectCount) {
      builder.count({
        c: "*",
      });
    } else {
      builder.offset(options.offset || 0).limit(options.limit || 999);
    }

    for (let i = -1, len = tables.length; i < len; i++) {
      const { type, table, alias, where, select, orderBy, groupBy, on, values } =
        i === -1 ? (options as any) : tables[i];

      if (i === -1) {
        builder.table({
          [alias]: this.options.table,
        });
      } else {
        switch (type) {
          case "LEFT":
            builder.leftJoin(
              {
                [alias]: table,
              },
              knex.raw(on, values as any)
            );
            break;
          case "RIGHT":
            builder.rightJoin(
              {
                [alias]: table,
              },
              knex.raw(on, values as any)
            );
            break;
          case "INNER":
            builder.innerJoin(
              {
                [alias]: table,
              },
              knex.raw(on, values as any)
            );
            break;
        }
      }

      if (!selectCount) {
        builder.select(...select.map((column: string) => `${alias}.${column}`));
      }

      if (where) {
        const joinWhere: Record<string, any> = {};
        for (const column in where) {
          if (!where.hasOwnProperty(column)) {
            continue;
          }
          joinWhere[`${alias}.${column}`] = (where as any)[column];
        }
        handleCondition(builder, joinWhere);
      }

      if (groupBy) {
        builder.groupBy(...groupBy.map((column: string) => `${alias}.${column}`));
      }

      if (orderBy) {
        for (const [column, by] of orderBy) {
          builder.orderBy(`${alias}.${column}`, by);
        }
      }
    }

    return builder;
  }

  withInnerJoin<TOptions extends WithJoinOptions<T>>(options: TOptions): WithJoinTable<T, TTableName, TOptions> {
    return {
      alias: this.options.tableWithoutPrefix,
      table: this.options.table,
      type: "INNER",
      select: this.options.fields,
      ...options,
    } as any;
  }

  withLeftJoin<TOptions extends WithJoinOptions<T>>(options: TOptions): WithJoinTable<T, TTableName, TOptions> {
    return {
      alias: this.options.tableWithoutPrefix,
      table: this.options.table,
      type: "LEFT",
      select: this.options.fields,
      ...options,
    } as any;
  }

  withRightJoin<TOptions extends WithJoinOptions<T>>(options: TOptions): WithJoinTable<T, TTableName, TOptions> {
    return {
      alias: this.options.tableWithoutPrefix,
      table: this.options.table,
      type: "RIGHT",
      select: this.options.fields,
      ...options,
    } as any;
  }

  useDataSource(dataSource?: DataSourceName) {
    this.options.dataSource = dataSource;
  }
}
