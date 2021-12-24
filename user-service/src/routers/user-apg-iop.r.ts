import { apiService } from "../api";
import {
  apgUserSchema,
  config,
  helper,
  IParamsGetUserApgAgentInfo,
  IParamsPostUserApgIopLogin,
  IParamsPostUserApgMiniLogin,
  TYPES,
} from "../global";
import { commonSchema } from "../constants";
import { authHeadersSchema, getUserFromSession, setUserToSession, userAuthGuard, UserType } from "../libs/auth";

const api = apiService.group("user/apg_iop", { prefix: "/user/apg_iop", name: "金管家用户新开放平台版本" });

api
  .post("/login")
  .title("登录")
  .body({
    open_id: helper.build(TYPES.NotEmptyString, "open id"),
    open_token: helper.build(TYPES.NotEmptyString, "open token"),
    iop_open_id: helper.build(TYPES.NotEmptyString, " iop open id", true),
    iop_open_token: helper.build(TYPES.NotEmptyString, " iop open token", true),
    inviter_user_id: helper.build(TYPES.Number, "邀请人用户id,有邀请机制的活动才需要带此项"),
  })
  .response({
    ...commonSchema,
    ...apgUserSchema,
  })
  .register(async (ctx) => {
    const params = ctx.request.$params as IParamsPostUserApgIopLogin;
    const ret = await ctx.service.userApg.login({
      open_id: params.iop_open_id,
      open_token: params.iop_open_token,
      ...params,
      getFromIop: true,
    });
    setUserToSession(ctx, {
      userId: ret.id,
      nickname: ret.nickname,
      type: UserType.Apg,
      openId: ret.open_id,
    });
    ctx.response.ok(ret);
  });

api
  .get("/info")
  .title("获取用户信息")
  .headers(authHeadersSchema)
  .middlewares(userAuthGuard(UserType.Apg))
  .response(apgUserSchema)
  .register(async (ctx) => {
    const userClaims = getUserFromSession(ctx);
    ctx.response.ok(
      await ctx.model.apgUser.getOne({
        where: {
          id: userClaims.id,
          open_id: userClaims.openId,
        },
      })
    );
  });

api
  .post("/mini_login")
  .title("金管家小程序登录")
  .body({
    code: helper.build(TYPES.NotEmptyString, "code,小程序环境中才需要传"),
    open_id: helper.build(TYPES.String, "金管家iop open id", true),
    open_token: helper.build(TYPES.NotEmptyString, "金管家iop open token", true),
  })
  .response({
    wx_mini_user: helper.build("ApgMiniWxUser", "微信小程序用户信息,传code才会返回该值"),
    apg_user: helper.build("ApgMiniApgUser", "金管家用户信息", true),
  })
  .register(async (ctx) => {
    const ret = await ctx.service.userApg.miniLogin({
      ...(ctx.request.$params as IParamsPostUserApgMiniLogin),
      getFromIop: true,
    });
    const apg = ret.apg_user;
    const wxMini = ret.wx_mini_user;
    setUserToSession(ctx, {
      userId: apg.id,
      openId: apg.open_id,
      nickname: apg.nickname,
      type: UserType.Apg,
      relations: wxMini
        ? [
            {
              userId: wxMini.id,
              openId: wxMini.open_id,
              sessionKey: wxMini.session_key,
              nickname: wxMini.nickname,
              type: UserType.WxMini,
            },
          ]
        : undefined,
    });
    delete (wxMini as any).session_key;
    ctx.response.ok(ret);
  });

api
  .get("/agent_info")
  .title("获取我的代理人信息")
  .middlewares(userAuthGuard(UserType.Apg))
  .query({
    open_token: helper.build(TYPES.String, "open token", true),
    is_sign_up_agent: helper.build(
      TYPES.Boolean,
      `true:获取活动的代理人,false:获取金管家app的代理人,默认为${config.user?.apg?.isSignUpAgent ?? true}`,
      false,
      config.user?.apg?.isSignUpAgent ?? true
    ),
  })
  .response({
    agent_info: helper.build("ApgAgentInfo", "代理人信息", true),
  })
  .register(async (ctx) => {
    ctx.response.ok({
      agent_info: await ctx.service.userApg.getMyAgentInfo(getUserFromSession(ctx), {
        ...(ctx.request.$params as IParamsGetUserApgAgentInfo),
        get_from_iop: true,
      }),
    });
  });
