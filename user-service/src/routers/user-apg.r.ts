import { apiService } from "../api";
import {
  apgAgentSchema,
  apgUserSchema,
  config,
  helper,
  IParamsGetUserApgAgentInfo,
  IParamsPostUserApgLogin,
  IParamsPostUserApgMiniLogin,
  TYPES,
  wxMiniUserSchema,
} from "../global";
import { commonSchema } from "../constants";
import { authHeadersSchema, getUserFromSession, setUserToSession, userAuthGuard, UserType } from "../libs/auth";
import _ from "lodash";
import loginLock from "../middleware/loginLock";

const api = apiService.group("user/apg", { prefix: "/user/apg", name: "金管家用户" });

apiService.schema.register("ApgUser", apgUserSchema);
apiService.schema.register("ApgAgentInfo", {
  ..._.omit(apgAgentSchema, ["id", "create_at", "update_at", "agent_no"]),
  ext: helper.build(TYPES.Object, "拓展信息"),
  is_exists: helper.build(TYPES.Boolean, "是否有代理人", true),
});

apiService.errors.register("APG_GET_USER_INFO_ERROR", {
  description: "获取用户信息失败",
  code: -900041,
});

apiService.errors.register("APG_GET_AGENT_INFO_ERROR", {
  description: "获取代理人信息失败",
  code: -900042,
});

apiService.errors.register("APG_VALID_AGENT_ERROR", {
  description: "验证是否是代理人失败",
  code: -900043,
});

apiService.errors.register("APG_GET_IOP_USER_INFO_ERROR", {
  description: "获取iop用户信息失败",
  code: -900044,
});

apiService.schema.register("ApgMiniApgUser", {
  ...commonSchema,
  ...apgUserSchema,
  agent_info: helper.build("ApgAgentInfo", "代理人信息"),
});
apiService.schema.register("ApgMiniWxUser", {
  ...commonSchema,
  ...wxMiniUserSchema,
});

api
  .post("/login")
  .title("登录")
  .middlewares(loginLock("open_id"))
  .body({
    open_id: helper.build(TYPES.NotEmptyString, "open id", true),
    open_token: helper.build(TYPES.NotEmptyString, "open token", true),
    iop_open_token: helper.build(TYPES.NotEmptyString, " iop open token,有获取用户等级的需要传"),
    iop_open_id: helper.build(TYPES.NotEmptyString, " iop open id,有获取用户等级的需要传"),
    inviter_user_id: helper.build(TYPES.Number, "邀请人用户id,有邀请机制的活动才需要带此项"),
  })
  .response({
    ...commonSchema,
    ...apgUserSchema,
  })
  .register(async (ctx) => {
    const ret = await ctx.service.userApg.login(ctx.request.$params as IParamsPostUserApgLogin);
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
    open_id: helper.build(TYPES.String, "金管家open id", true),
    open_token: helper.build(TYPES.NotEmptyString, "金管家open token", true),
  })
  .response({
    wx_mini_user: helper.build("ApgMiniWxUser", "微信小程序用户信息,传code才会返回该值"),
    apg_user: helper.build("ApgMiniApgUser", "金管家用户信息", true),
  })
  .register(async (ctx) => {
    const ret = await ctx.service.userApg.miniLogin({
      ...(ctx.request.$params as IParamsPostUserApgMiniLogin),
      getFromIop: false,
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
        get_from_iop: false,
      }),
    });
  });
