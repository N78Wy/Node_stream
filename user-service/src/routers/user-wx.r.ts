import { apiService } from "../api";
import { helper, IParamsPostUserWxBaseAuth, IParamsPostUserWxGrant, TYPES, wxUserSchema } from "../global";
import { commonSchema } from "../constants";
import { authHeadersSchema, getUserFromSession, setUserToSession, userAuthGuard, UserType } from "../libs/auth";

const api = apiService.group("user/wx", { prefix: "/user/wx", name: "微信用户" });

api
  .post("/base_auth")
  .title("隐式授权")
  .body({
    code: helper.build(TYPES.NotEmptyString, "微信授权后跳转携带的code", true),
  })
  .response({
    ...commonSchema,
    ...wxUserSchema,
  })
  .register(async (ctx) => {
    const ret = await ctx.service.userWx.baseAuth(ctx.request.$params as IParamsPostUserWxBaseAuth);
    setUserToSession(ctx, {
      userId: ret.id,
      openId: ret.open_id,
      type: UserType.Wx,
      nickname: ret.nickname,
    });
    ctx.response.ok(ret);
  });

api
  .post("/grant")
  .title("显式授权")
  .body({
    code: helper.build(TYPES.NotEmptyString, "微信授权后跳转携带的code", true),
  })
  .response({
    ...commonSchema,
    ...wxUserSchema,
  })
  .register(async (ctx) => {
    const ret = await ctx.service.userWx.grant(ctx.request.$params as IParamsPostUserWxGrant);
    setUserToSession(ctx, {
      userId: ret.id,
      openId: ret.open_id,
      type: UserType.Wx,
      nickname: ret.nickname,
    });
    ctx.response.ok(ret);
  });

api
  .get("/info")
  .title("获取用户信息")
  .headers(authHeadersSchema)
  .response(wxUserSchema)
  .middlewares(userAuthGuard(UserType.Wx))
  .register(async (ctx) => {
    const userClaims = getUserFromSession(ctx);
    ctx.response.ok(
      await ctx.model.wxUser.getOne({
        where: {
          id: userClaims.userId,
          open_id: userClaims.openId,
        },
      })
    );
  });
