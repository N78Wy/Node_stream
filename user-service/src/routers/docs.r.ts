import { apiService } from "../api";
import path from "path";
import fs from "fs";
import { SdkGenerator } from "../libs/sdk-generator";

const api = apiService.group("docs");

api
  .get("/json")
  .title("获取json形式文档")
  .register(async (ctx) => {
    ctx.response.ok(JSON.parse(fs.readFileSync(path.join(__dirname, "../../docs", "doc.json"), "utf8")));
  });

api
  .get("/swagger")
  .title("获取swagger形式文档")
  .register(async (ctx) => {
    ctx.response.ok(JSON.parse(fs.readFileSync(path.join(__dirname, "../../docs", "swagger.json"), "utf8")));
  });

api
  .get("/sdk")
  .title("获取sdk")
  .register(async (ctx) => {
    const sdkGenerator = new SdkGenerator();
    ctx.response.ok({
      base: sdkGenerator.generatorApi(),
      baseType: sdkGenerator.generatorApiType(),
      api: sdkGenerator.generatorApiExtend(),
      markdown: sdkGenerator.generatorApiMarkdown(),
    });
  });
