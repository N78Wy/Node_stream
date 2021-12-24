import { apiService } from "../api";
import { pkg } from "../global";

const api = apiService.group("utils", "工具");
const date = new Date().toLocaleString();

api
  .get("/index")
  .title("测试Index")
  .register((ctx) => {
    ctx.response.ok(`Hello, ${pkg.name}, ${date}`);
  });
