import prettier from "prettier";
import { apiService } from "../api";
import { camelCase, upperFirst } from "lodash";
import { ISchemaTypeFields } from "@gz/schema-manager";
import { ISchemaType } from "@gz/erest/dist/lib/params";
import { IError } from "@gz/erest/dist/lib/manager";
import { splitLine } from "../global/base/utils";
import { getTsType } from "../global/base/schema-helper";

interface IApi {
  title: string;
  description: string;
  path: string;
  method: string;
  params: Record<string, ISchemaType>;
  query: Record<string, ISchemaType>;
  body: Record<string, ISchemaType>;
  response: Record<string, ISchemaType>;
  allParams: Record<string, ISchemaType>;
}

export class SdkGenerator {
  protected errors = (() => {
    const result: Record<string, IError> = {};

    apiService.errors.forEach((error, key) => {
      result[key] = error;
    });

    return result;
  })();

  protected apis = (() => {
    return [...apiService.api.$apis.values()].map((val: any) => {
      const { options } = val;
      return {
        title: options.title || "",
        description: options.description || "",
        path: options.realPath,
        method: options.method,
        params: options.params || {},
        query: options.query || {},
        body: options.body || {},
        response: typeof options.response === "object" ? options.response : {},
        allParams: {
          ...options.params,
          ...options.query,
          ...options.body,
        },
      };
    }) as IApi[];
  })();

  protected getApiName(path: string, method: string) {
    return `${method.toLowerCase()}${path
      .split("/")
      .map((p) => upperFirst(camelCase(p)))
      .join("")}`;
  }

  protected getInterfaceName(key: string) {
    return upperFirst(camelCase(key));
  }

  protected getTsType({ type, params }: ISchemaType) {
    return getTsType(type);
  }

  protected getErrCodeTemplate(): string {
    return Object.entries(this.errors)
      .map(([key, error]) => {
        return `${key}: ${error.code}`;
      })
      .join(",\n");
  }

  protected getErrCodeTypeTemplate(): string {
    return Object.entries(this.errors)
      .map(([key, error]) => {
        return `
          /**
          * ${error.description}
          */
          ${key}: ${error.code}`;
      })
      .join(",\n");
  }

  protected getParamsTemplate(allParams: Record<string, ISchemaType>): string {
    const result = Object.keys(allParams).join(",\n");

    return result
      ? `{
        ${result}
      }`
      : "";
  }

  protected getParamsTypeTemplate(allParams: Record<string, ISchemaType>): string {
    const result = Object.entries(allParams)
      .map(([key, schemaType]) => {
        const comment = schemaType.comment ? splitLine(schemaType.comment) : "";
        const result = [] as string[];
        comment && result.push(`/** ${comment.join("*\n")} */`);
        result.push(`${key}${schemaType.required ? "" : "?"}: ${this.getTsType(schemaType)}`);
        return `
        /**
         * ${schemaType.comment}
         */
        ${key}${schemaType.required ? "" : "?"}: ${this.getTsType(schemaType)}`;
        return result.join("\n");
      })
      .join(";\n");

    return result
      ? `params: {
      ${result}
    }`
      : "";
  }

  protected getApiFuncJsDoc(api: IApi): string {
    function getComments(
      schemaTypes: Record<string, ISchemaType>,
      docType: string,
      path = "",
      store: string[] = []
    ): string {
      return Object.entries(schemaTypes)
        .map(([key, schemaType]) => {
          const schema =
            (apiService.schema as any).map.get(schemaType.type) ||
            (apiService.schema as any).map.get(schemaType.type.slice(0, schemaType.type.length - 2));

          if (schema && !store.includes(schemaType.type)) {
            store.push(schemaType.type);
            return `* ${docType} ${path}${key} - ${schemaType.comment}
            ${getComments(schema.fields, docType, `${path}${key}.`, store)}`;
          }

          return `* ${docType} ${path}${key} - ${schemaType.comment}`;
        })
        .join("\n");
    }

    const params = getComments(api.allParams, "@param", "params.");
    const response = getComments(api.response, "@returns");
    return `
    /** ${api.title && `\n* ${api.title}`} ${api.description && `\n * ${api.description}`}
     * ${params && "\n* @param params - 参数"} ${params && "\n" + params} ${response && "\n" + response}
     */`;
  }

  protected getResponseTypeTemplate(response: Record<string, ISchemaType>): string {
    const result = Object.entries(response)
      .map(([key, schemaType]) => {
        return `
      /**
       * ${schemaType.comment}
       */
      ${key}${schemaType.required ? "" : "?"}: ${this.getTsType(schemaType)}`;
      })
      .join(";\n");

    return result ? `Promise<AxiosResponse<Response<{${result}}>>>` : `Promise<AxiosResponse<Response>>`;
  }

  protected getApiFuncTemplate(api: IApi) {
    const params = Object.keys(api.query).join(",\n");
    const body = Object.keys(api.body).join(",\n");
    let path = api.path;
    Object.keys(api.params).forEach((key) => {
      path = path.replace(`:${key}`, `\${${key}}`);
    });

    if (api.title.includes("上传文件")) {
      return `${this.getApiName(api.path, api.method)}(file) {
        const fd = new FormData();
        fd.append('file', file);
        return this.http.request({
          url: \`${path}\`,
          method: '${api.method}',
          data: fd
        });
      }`;
    }
    const requestOptions = [`url: \`${path}\``, `method: '${api.method}'`];
    if (params) {
      requestOptions.push(`params: {${params}}`);
    }

    if (body) {
      requestOptions.push(`data: {${body}}`);
    }

    return `${this.getApiName(api.path, api.method)}(${this.getParamsTemplate(api.allParams)}) {
      return this.http.request({
        ${requestOptions.join(",\n")}
      });
    }`;
  }

  protected getApiFuncTypeTemplate(api: IApi) {
    return `
    ${this.getApiFuncJsDoc(api)}
    ${this.getApiName(api.path, api.method)}(${
      api.title.includes("上传文件") ? `file: File` : this.getParamsTypeTemplate(api.allParams)
    }): ${this.getResponseTypeTemplate(api.response)};`;
  }

  protected getSchemaInterfaceTemplate() {
    const schemas = (apiService.schema as any).map as Map<string, { fields: ISchemaTypeFields }>;
    return [...schemas.entries()]
      .map(
        ([key, schema]) => `interface ISchema${this.getInterfaceName(key)} {
        ${Object.entries(schema.fields)
          .map(([key, schemaType]) => {
            const { type, required, comment } = schemaType;
            if (typeof type !== "string") {
              return "";
            }

            return `
            /**
             * ${comment}
             */
            ${key}${required ? "" : "?"}: ${this.getTsType(schemaType as any)};`;
          })
          .join("\n")}
      }
      `
      )
      .join("\n");
  }

  protected getApiTemplate() {
    return `
/**
 * 该文件由程序自动生成,请不要修改此文件
 */
export class BaseApi {
  constructor(axiosInstance) {
    this.http = axiosInstance
    this.ERR_CODE = {
      ${this.getErrCodeTemplate()}
    }
  }

  ${this.apis.map((api) => this.getApiFuncTemplate(api)).join("\n\n")}
}
      `;
  }

  /**
   * 获取 d.ts 描述内容
   */
  protected getApiTypeTemplate() {
    return `
/**
 * 该文件由程序自动生成,请不要修改此文件
 */
import { AxiosInstance, AxiosResponse } from 'axios';

type ErrCode = {
  ${this.getErrCodeTypeTemplate()}
}

type Response<T = any> = {
  ok: boolean;
  result: T;
};

${this.getSchemaInterfaceTemplate()}

export declare class BaseApi {
  constructor(http: AxiosInstance);

  http: AxiosInstance;

  ERR_CODE: ErrCode;

  ${this.apis.map((api) => this.getApiFuncTypeTemplate(api)).join("\n")}
}
`;
  }

  protected getApiMarkdownTemplate() {
    return this.apis
      .map(
        (api) => `${api.title && `\n- ${api.title}\n`}${api.description && `\n  ${api.description}\n`}
  ${this.getApiName(api.path, api.method)}`
      )
      .join("\n");
  }

  protected getApiExtendTemplate() {
    return `
import axios from 'axios';
import { BaseApi } from './api.base';

/**
 * 在这里自定义你的逻辑
 */
class Api extends BaseApi {

}

export const api = new Api(axios.create({
  baseURL: window?.$TZ_CONFIG?.conf?.api?.baseUrl,
}));
    `;
  }

  generatorApi() {
    return prettier.format(this.getApiTemplate(), { parser: "babel" });
  }

  generatorApiExtend() {
    return prettier.format(this.getApiExtendTemplate(), { parser: "babel" });
  }

  generatorApiType() {
    return prettier.format(this.getApiTypeTemplate(), { parser: "typescript" });
  }

  generatorApiMarkdown() {
    return prettier.format(this.getApiMarkdownTemplate(), { parser: "markdown" });
  }
}
