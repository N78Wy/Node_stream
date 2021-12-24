/**
 * @file 路由加载文件
 * @author Yourtion Guo <yourtion@gmail.com>
 */
import path from "path";
import { config, logger, pkg, redis } from "../global";
import { component, Context, Router } from "../web";
import { loggerMiddleware } from "../libs/logger";
import { apiService } from "../api";
import { requireDir } from "../global/base/utils";
import { blockBackApi } from "../libs/middlewares";
import { checkSignMiddleware } from "../libs/api-security";

export const router = new Router();

// 拦截后门接口
router.use("/", blockBackApi);

// 跨域
router.use(
  "/",
  component.cors({
    any: true,
    credentials: true,
    allowMethods: ["PUT", "POST", "GET", "DELETE", "OPTIONS", "PATCH"],
    allowHeaders: [
      "Content-Type",
      "Content-Length",
      "Authorization",
      "Accept",
      "X-Requested-With",
      "Cookie",
      // 签名用请求头
      "Cookle",
      "X-Timestamp",
      "X-Signature",
      "X-Nonce",
    ],
  })
);
router.use("/", function (ctx) {
  if (ctx.request.method && ctx.request.method.toUpperCase() === "OPTIONS") {
    ctx.response.status(200);
    ctx.response.end();
  } else {
    ctx.next();
  }
});

router.use("/", component.bodyParser.json({ limit: "5mb" }));
router.use("/", component.bodyParser.urlencoded({ extended: true }));
router.use("/", component.cookieParser(config.session.secret));
// token, cookie SameSite None 兼容
router.use("/", (ctx) => {
  const cookies = ctx.request.cookies;
  cookies[pkg.shortName] =
    cookies[pkg.shortName] ||
    // SameSite 兼容
    cookies[`${pkg.shortName}back`] ||
    // Http Header Authorization Bearer Token
    (ctx.request.headers.authorization ? ctx.request.headers.authorization!.split(" ")[1] : "");
  ctx.onWriteHead(() => {
    ctx.response.cookie(`${pkg.shortName}back`, ctx.session.id, config.cookie);
    ctx.response.setHeader("Access-Control-Expose-Headers", ["x-token"]);
    ctx.response.setHeader("x-token", ctx.session.id);
  });
  ctx.next();
});
router.use(
  "/",
  component.session({
    store: new component.SessiionRedisStore({
      client: redis as any,
      prefix: "session:",
    }),
    name: pkg.shortName,
    maxAge: config.cookie.maxAge,
    cookie: {
      sameSite: "none",
      secure: true,
    },
  })
);
router.use("/", loggerMiddleware());
router.use(
  "/",
  checkSignMiddleware({
    get secret() {
      return config.sign.secret;
    },
    shouldCheckSign(ctx: Context): boolean {
      if (ctx.request.method !== "GET") {
        if (config.sign.disableUrls?.length) {
          return !config.sign.disableUrls.includes(ctx.request.url || "");
        }

        return true;
      }

      return false;
    },
  })
);

requireDir(path.resolve(__dirname, "./"), {
  excludeFile: ["index"],
  onRequired({ filename }) {
    logger.debug("Load Router: %s", filename);
  },
});

// 给所有 controller 方法添加自动调用 ctx.next() 的 proxy
apiService.api.$apis.forEach((api) => {
  const originalHandler = api.options.handler;
  api.options.handler = async function (ctx: Context) {
    await originalHandler(ctx);
    ctx.next();
  };
});

// afterHooks 必须放在 bindRouterToApp 之前，否则 afterHooks 绑定不到 router 上
apiService.afterHooks(async (ctx) => {
  await ctx.model.endTransaction();
  if (!ctx.response.originalResponseFunc) {
    return ctx.log.warn("未调用任何响应方法");
  }
  await ctx.response.originalResponseFunc();
});

apiService.bindRouterToApp(router, Router, apiService.checkerLeiWeb);

router.use("/", async (ctx, err: any) => {
  await ctx.model.rollbackTransaction();
  ctx.response.err(err);
  await ctx.response.originalResponseFunc!();
});
