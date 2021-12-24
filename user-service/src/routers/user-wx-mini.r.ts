import { apiService } from "../api";
import {
  helper,
  IParamsPostUserWxMiniBindPhone,
  IParamsPostUserWxMiniGrant,
  IParamsPostUserWxMiniLogin,
  TYPES,
  wxMiniUserSchema,
} from "../global";
import {
  authHeadersSchema,
  getUserFromSession,
  mergeUserToSession,
  setUserToSession,
  userAuthGuard,
  UserType,
} from "..";
import { commonSchema } from "../constants";

const api = apiService.group("user/wx_mini", { prefix: "/user/wx_mini", name: "微信小程序用户" });

apiService.schema.register("WxMiniUser", wxMiniUserSchema);

api
  .post("/login")
  .title("登录")
  .body({
    code: helper.build(TYPES.NotEmptyString, "code", true),
  })
  .response({
    ...commonSchema,
    ...wxMiniUserSchema,
  })
  .register(async (ctx) => {
    const ret = await ctx.service.userWxMini.login(ctx.request.$params as IParamsPostUserWxMiniLogin);
    setUserToSession(ctx, {
      userId: ret.id,
      openId: ret.open_id,
      sessionKey: ret.session_key,
      nickname: ret.nickname,
      type: UserType.WxMini,
    });
    delete (ret as any).session_key;
    ctx.response.ok(ret);
  });

api
  .get("/info")
  .title("获取用户信息")
  .headers(authHeadersSchema)
  .response(wxMiniUserSchema)
  .middlewares(userAuthGuard(UserType.WxMini))
  .register(async (ctx) => {
    const userClaims = getUserFromSession(ctx);
    ctx.response.ok(
      await ctx.model.wxMiniUser.getOne({
        where: {
          id: userClaims.userId,
          open_id: userClaims.openId,
        },
      })
    );
  });

api
  .post("/grant")
  .title("授权")
  .body({
    encryptedData: helper.build(TYPES.NotEmptyString, "加密数据", true),
    iv: helper.build(TYPES.NotEmptyString, "iv", true),
  })
  .response(wxMiniUserSchema)
  .middlewares(userAuthGuard(UserType.WxMini))
  .register(async (ctx) => {
    const user = await ctx.service.userWxMini.grant(
      getUserFromSession(ctx),
      ctx.request.$params as IParamsPostUserWxMiniGrant
    );
    mergeUserToSession(ctx, {
      nickname: user!.nickname || "",
    });
    ctx.response.ok(user);
  });

api
  .post("/bind_phone")
  .title("绑定手机号")
  .body({
    encryptedData: helper.build(TYPES.NotEmptyString, "加密数据", true),
    iv: helper.build(TYPES.NotEmptyString, "iv", true),
  })
  .response(wxMiniUserSchema)
  .middlewares(userAuthGuard(UserType.WxMini))
  .register(async (ctx) => {
    ctx.response.ok(
      await ctx.service.userWxMini.bindPhone(
        getUserFromSession(ctx),
        ctx.request.$params as IParamsPostUserWxMiniBindPhone
      )
    );
  });
