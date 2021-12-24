/**
 * @file API文件
 */

import API from "@gz/erest";
import { InternalError, InvalidParameter, MissingParameter, pkg } from "./global";
import { Context } from "./web";

export type HANDLER = (ctx: Context, err?: any) => void;

export let apiService = new API<HANDLER>({
  info: {
    title: pkg.name || "",
    description: `
${pkg.name}系统API文档
`,
    version: new Date(),
    host: `https://${pkg.name}.test.h5no1.com`,
    basePath: `/api`,
  },
  forceGroup: true,
  path: require("path").resolve(__dirname, "routers"),
  missingParameterError: (msg: string) => new MissingParameter(msg),
  invalidParameterError: (msg: string) => new InvalidParameter(msg),
  internalError: (msg: string) => new InternalError(msg),
  docs: {
    wiki: "./",
    home: true,
    json: true,
    swagger: true,
  },
});

export function setApiService(api: API<any>) {
  apiService = api;
}
