import { apiService } from "../api";
import { helper, IParamsGetUserWxRabbitpreInfo, IParamsGetUserWxRabbitpreUrl, TYPES } from "../global";
import { setUserToSession, UserType } from "../libs/auth";

const api = apiService.group("user/wx/rabbitpre", { prefix: "/user/wx/rabbitpre", name: "深圳微信授权相关接口" });

api
  .get("/url")
  .title("微信授权，获取微信用户信息授权地址")
  .query({
    redirect_url: helper.build(TYPES.String, "跳转地址", true),
    scope: helper.build(TYPES.String, "隐式授权填:snsapi_base, 显示授权填:snsapi_userinfo, 默认为 snsapi_userinfo"),
  })
  .response({
    auth_url: helper.build(TYPES.String, "授权地址", true),
  })
  .register(async (ctx) => {
    ctx.response.ok({
      auth_url: await ctx.service.userWxRabbitpre.getAuthUrl(ctx.request.$params as IParamsGetUserWxRabbitpreUrl),
    });
  });

api
  .get("/info")
  .title("微信授权，使用授权token获取用户信息")
  .query({
    token: helper.build(TYPES.String, "授权后获取的token", true),
  })
  .response({
    id: helper.build(TYPES.Integer, "用户id", true),
    openid: helper.build(TYPES.String, "oepnid", true),
    unionid: helper.build(TYPES.String, "unionid"),
    nickname: helper.build(TYPES.String, "nickname"),
    avatar: helper.build(TYPES.String, "头像地址"),
    country: helper.build(TYPES.String, "country"),
    province: helper.build(TYPES.String, "province"),
    city: helper.build(TYPES.String, "城市"),
  })
  .register(async (ctx) => {
    const user = await ctx.service.userWxRabbitpre.getUserInfo(ctx.request.$params as IParamsGetUserWxRabbitpreInfo);
    setUserToSession(ctx, {
      userId: user.id,
      openId: user.open_id,
      type: UserType.Wx,
      nickname: user.nickname,
    });
    ctx.response.ok(user);
  });
