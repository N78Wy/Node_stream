import { apiService } from "../api";

const api = apiService.group("back", "后门");

api
  .get("/index")
  .title("测试Index")
  .register((ctx) => {
    ctx.response.ok(`Hello, back`);
  });
