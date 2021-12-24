/**
 * @file compose 模块合并文件
 */

import path from "path";
import { config, configLoader, errors, logger, mysql, mysqlDataSources, pkg, redis } from "./global";
import { apiService } from "./api";
import { requireDir } from "./global/base/utils";
import minimatch from "minimatch";
import * as models from "./global/gen/models.gen";
import _ from "lodash";

const { frameworks, ...pkgMerge } = pkg;

function handleError(err: any) {
  // run code时可能依赖还没装
  // RUN_CODE 变量由 scripts/gencode.ts 设置
  if (process.env.RUN_CODE === "true") {
    return;
  }

  console.error("合并框架失败:", err);
  process.exit(1);
}

export function compose() {
  for (const { scope, name } of pkg.frameworks) {
    const destPath = (path: string) => `${scope}/${name}/dist/${path}`;
    try {
      // 合并除了frameworks的package
      const { mergePkg } = require(destPath("global/pkg"));
      mergePkg(pkgMerge);
      // 统一mysql实例
      const { setGlobalMysql } = require(destPath("global/mysql"));
      setGlobalMysql(mysql, mysqlDataSources);
      // 统一redis实例
      const { setGlobalRedis } = require(destPath("global/redis"));
      setGlobalRedis(redis);
      // 统一配置实例
      const { setConfig } = require(destPath("global/config"));
      setConfig(config);
      // 合并model schema
      const fModels = require(`${scope}/${name}/dist/global/gen/models.gen`);
      for (const key of Object.keys(fModels)) {
        const myModel = (models as any)[key];
        const fModel = fModels[key];

        if (myModel && fModel) {
          if (_.isPlainObject(myModel) && _.isPlainObject(fModel)) {
            Object.assign(fModel, myModel);
          } else if (_.isArray(myModel) && _.isArray(fModel)) {
            fModel.length = 0;
            fModel.push(...myModel);
          }
        }
      }
      // 合并所有errors
      const fErrors = require(`${scope}/${name}/dist/global/gen/errors.gen`);
      Object.assign(errors, fErrors);
      // 统一api实例
      const { setApiService } = require(destPath("api"));
      setApiService(apiService);
      // 合并事件
      require(`${scope}/${name}/dist/event-bus`);
      // 合并api
      requireDir(path.join(__dirname, "../node_modules", scope, name, "dist/routers"), {
        excludeFile: ["index"],
        onRequired({ filepath }) {
          logger.debug("Load Compose Router: %s", filepath);
        },
      });

      // 过滤未开放的api
      const apis = apiService.api.$apis;
      const groups = apiService.privateInfo.groupInfo;
      const exposePatterns: string[] = config.routers?.expose || [];
      for (const key of Object.keys(groups)) {
        let retain = false;
        for (const apiKey of apis.keys()) {
          const api = apis.get(apiKey)!;

          if (!api.options.realPath.startsWith(`/${key}`)) {
            continue;
          }

          if (!exposePatterns.some((pattern) => minimatch(api.options.realPath, pattern))) {
            apis.delete(apiKey);
            continue;
          }

          retain = true;
        }

        if (!retain) {
          delete groups[key];
          delete apiService.privateInfo.groups[key];
        }
      }
    } catch (e) {
      handleError(e);
    }
  }
}

export function overrideConfigLoader() {
  for (const { scope, name } of pkg.frameworks) {
    const destPath = (path: string) => `${scope}/${name}/dist/${path}`;
    try {
      const { setConfigLoader } = require(destPath("global/config"));
      setConfigLoader(configLoader);
    } catch (e) {
      handleError(e);
    }
  }
}

export function checkFrameworkVersionCompatible() {
  const fVersionMap = new Map<string, string>();
  for (const f of Object.entries(pkg.dependencies)) {
    if (!/^@gz\/.*-service$/.test(f[0])) continue;
    fVersionMap.set(f[0], f[1]);
  }

  for (const fName of fVersionMap.keys()) {
    const pjson = require(`${fName}/package.json`);

    for (const [commonDepName, commonDepVersion] of Object.entries(pjson.dependencies as Record<string, string>)) {
      if (!/^@gz\/.*-service$/.test(commonDepName)) continue;

      const fVersion = fVersionMap.get(commonDepName);

      // 项目内依赖的服务版本小于服务内依赖的服务版本，可能导致服务不能正常运行
      if (fVersion && commonDepVersion.localeCompare(fVersion) > 0) {
        logger.warn(
          `${fName} 依赖的 ${commonDepName} 的版本为 ${commonDepVersion}，而项目内依赖的 ${commonDepName} 的版本为 $${fVersion}`
        );
      }
    }
  }
}
