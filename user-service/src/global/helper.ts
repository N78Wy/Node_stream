/**
 * @file API 扩展
 * @author Yourtion Guo <yourtion@gmail.com>
 */

import { utils } from "./base";
import _ from "lodash";
import { SCHEMAS, TYPES } from "./gen/types.gen";

export interface Schema {
  type: string;
  comment?: string;
  format?: boolean;
  default?: any;
  required?: boolean;
  params?: any;
}

/**
 * 参数构造
 *
 * @param {String} type 参数类型
 * @param {String} comment 参数说明
 * @param {any} required 是否必填
 * @param {any} defaultValue 默认值
 * @return {Object}
 */
export function build(type: string, comment: string, required?: boolean, defaultValue?: any, params?: any) {
  return utils.removeUndefined({ type, comment, required, default: defaultValue, params });
}

export function requireParam(schema: Schema) {
  return Object.assign({ required: true }, schema);
}

export function rewriteSchema(
  schemas: Record<string, Schema>,
  rewriter: Partial<Schema> | ((schema: Schema) => Partial<Schema> | undefined)
) {
  const clone = _.cloneDeep(schemas);
  for (const key of Object.keys(clone)) {
    const schema = clone[key];
    if (typeof rewriter === "function") {
      const ret = rewriter(schema);
      if (ret) {
        Object.assign(schema, ret);
      }
    } else {
      Object.assign(schema, rewriter);
    }
  }
  return clone;
}

export function requireSchemas(schemas: Record<string, Schema>) {
  return rewriteSchema(schemas, { required: true });
}

export function partialSchemas(schemas: Record<string, Schema>) {
  return rewriteSchema(schemas, { required: false });
}

/**
 * 分页参数
 */
export const PagingParams = {
  page: build(TYPES.Integer, "第几页,从1开始,默认1", false, 1),
  page_size: build(TYPES.Integer, "每页数量,默认10", false, 10),
  order_by: build(
    TYPES.Array,
    "<pre>排序,[['id', 'DESC']]表示按id倒序, [['id', 'ASC']]表示按id正序, 支持按多个排序, 如 [['id', 'DESC'], ['update_at', 'DESC']]</pre>",
    false,
    [["id", "DESC"]]
  ),
} as const;

/**
 * 分页响应
 * @param schema
 * @constructor
 */
export const PagingResponse = (schema: typeof SCHEMAS[keyof typeof SCHEMAS] | string) => ({
  count: build(TYPES.Integer, "数据总量", true),
  list: build(schema.endsWith("[]") ? schema : `${schema}[]`, "数据列表", true),
});
