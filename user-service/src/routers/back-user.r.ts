import { apiService } from "../api";
import {
  apgAgentSchema,
  apgUserSchema,
  helper,
  IParamsGetBackUserApgSetAgent,
  IParamsGetBackUserSetData,
  TYPES,
} from "../global";
import { getUserFromSession, userAuthGuard, UserType } from "..";
import _ from "lodash";
import { backUserSchema } from "../constants";
import { randomString } from "../global/base/utils";
import { partialSchemas } from "../global/helper";

const api = apiService.group("back/user", { name: "用户后门", prefix: "/back/user" });

api
  .get("/clear_self")
  .title("清除自身数据")
  .description("如果是微信用户,则到微信打开该链接,如果是金管家用户,则弄成二维码去金管家扫码访问即可")
  .middlewares(userAuthGuard())
  .register(async (ctx) => {
    const { model } = ctx;
    const user = getUserFromSession(ctx);
    await model.beginTransaction("ClearSelf");
    const options = {
      where: {
        id: user.userId,
        open_id: user.openId,
      },
    };
    await model.apgUser.delete(options);
    await model.wxUser.delete(options);
    await model.wxMiniUser.delete(options);
    ctx.response.isOk(true);
  });

api
  .get("/clear")
  .title("清除数据")
  .description("open_id和user_id选一个传即可")
  .query({
    open_id: helper.build(TYPES.String, "open id"),
    user_id: helper.build(TYPES.Number, "用户id"),
  })
  .register(async (ctx) => {
    const { model } = ctx;
    const { user_id, open_id } = ctx.request.$params;
    await model.beginTransaction("Clear");
    const options = {
      where: {
        id: user_id,
        open_id,
      },
    };
    await model.apgUser.delete(options);
    await model.wxUser.delete(options);
    await model.wxMiniUser.delete(options);
    ctx.response.isOk(true);
  });

api
  .get("/clear_all")
  .title("清除全部用户数据")
  .register(async (ctx) => {
    const { model } = ctx;
    await model.beginTransaction("ClearAll");
    const where = {
      id: {
        $gte: 0,
      },
    };
    const limit = 1000000;
    await Promise.all([
      model.apgUser.delete({
        where,
        limit,
      }),
      model.wxUser.delete({
        where,
        limit,
      }),
      model.wxMiniUser.delete({
        where,
        limit,
      }),
    ]);
    ctx.response.isOk(true);
  });

api
  .get("/apg/set_agent")
  .title("设置我的代理人信息")
  .query({
    ...backUserSchema,
    agent_open_id: helper.build(TYPES.String, "代理人open id"),
    ..._.omit(apgAgentSchema, ["id", "open_id", "create_at", "update_at"]),
  })
  .register(async (ctx) => {
    const { model, errors } = ctx;
    const params = ctx.request.$params as IParamsGetBackUserApgSetAgent;
    const agentInfo = _.omit(params, ["user_id", "open_id", "agent_open_id"]);
    let user = await global.eventBus.call("user:getUserForBack", { ctx });

    if (!user) {
      if (!params.open_id) {
        throw new errors.NotFoundError();
      }
      user = {
        open_id: params.open_id,
      } as any;
    }

    const relation = await model.apgUserAgentRelation.getOne({
      where: {
        user_open_id: user!.open_id,
      },
      select: ["agent_id"],
    });

    if (relation) {
      await model.apgAgent.updateByPrimary(relation.agent_id, {
        set: agentInfo,
      });
    } else {
      let agent_id = 0;
      if (params.agent_open_id) {
        const agent = await model.apgAgent.getOne({
          where: {
            open_id: params.agent_open_id,
          },
        });
        agent && (agent_id = agent.id);
      }

      if (!agent_id) {
        const { insertId } = await model.apgAgent.insert({
          value: {
            ...agentInfo,
            open_id: params.agent_open_id,
          },
        });
        agent_id = insertId;
      }

      await model.apgUserAgentRelation.insert({
        value: {
          user_open_id: user!.open_id,
          agent_id,
        },
      });
    }
    ctx.response.isOk(true);
  });

api
  .get("/invite")
  .title("邀请新用户")
  .query({
    ...backUserSchema,
    invite_user_type: helper.build(
      TYPES.Number,
      `要邀请的用户类型, ${UserType.Apg}: 金管家, ${UserType.Wx}: 微信, ${UserType.WxMini}: 微信小程序, 用户类型默认为邀请者的类型`
    ),
    invite_num: helper.build(TYPES.Number, "要邀请几个用户", false, 1, { min: 1, max: 100 }),
  })
  .register(async (ctx) => {
    const { model, service, errors } = ctx;
    let { invite_user_type, invite_num } = ctx.request.$params;
    const user = await global.eventBus.call("user:getUserForBack", { ctx });

    if (!user) {
      throw new errors.NotFoundError("用户不存在");
    }
    let modelKey: string;

    if (!invite_user_type) {
      invite_user_type = service.user.getUserTypeFromId(user.id);
    }

    switch (invite_user_type) {
      case UserType.Apg:
        modelKey = "apgUser";
        break;
      case UserType.Wx:
        modelKey = "wxUser";
        break;
      case UserType.WxMini:
        modelKey = "wxMiniUser";
        break;
      default:
        throw new errors.InvalidParameter("未知的用户类型: " + invite_user_type);
    }

    for (let i = 0; i < invite_num; i++) {
      const { insertId } = await (model as any)[modelKey].insert({
        value: {
          open_id: randomString(32),
          nickname: `if-${randomString(3)}`,
        },
      });
      await service.user.inviteFriend(user.id, insertId, service.user.getUserTypeFromId(user.id));
    }
    ctx.response.isOk(true);
  });

api
  .get("/set_data")
  .title("修改用户数据")
  .query({
    ...backUserSchema,
    ...partialSchemas(_.omit(apgUserSchema, ["id", "open_id"])),
  })
  .register(async (ctx) => {
    const { model, errors } = ctx;
    const { user_id: _, open_id: __, ...data } = ctx.request.$params as IParamsGetBackUserSetData;
    const user = await global.eventBus.call("user:getUserForBack", { ctx });
    if (!user) {
      throw new errors.NotFoundError("用户不存在");
    }
    await model.apgUser.updateByPrimary(user.id, {
      set: data,
    });
    ctx.response.isOk(true);
  });
