import { AsyncEventEmitter } from "events-await";
import { IModelsApgUser, IModelsWxMiniUser, IModelsWxUser } from "./global";
import { UserLoginCommonRet } from "./constants";
import { getUserFromSession, UserType } from "./libs/auth";
import { Context } from "./web";
import { Application } from "@gz/web";
import { ISchemaApgAgentInfo } from "./global/gen/schemas.gen";

export type CommonUser = IModelsApgUser | IModelsWxUser | IModelsWxMiniUser;

export type UserLoginEventParams = {
  ctx: any;
  // user_id字段用于兼容旧版本,user_id 等于 id
  user: CommonUser & { user_id: number } & UserLoginCommonRet;
};

export type GetUserCallParams = { ctx: any; user_id: number; open_id: string };

export type GetUserForTestCallParams = {
  ctx: any;
};

export type GetUserTypeFromIdParams = { ctx: any; user_id: number };

export type GetDetailUserCallParams = { ctx: any; open_id: string };

export type UserInviteEventParams = {
  ctx: any;
  /**
   * 邀请者用户id
   */
  user_id: number;
  /**
   * 被邀请者用户id
   */
  friend_user_id: number;
  /**
   * 用户类型
   */
  user_type: UserType;
};

export type UserApgCheckIsAgentCallParams = {
  ctx: any;
  merchant_code?: string;
  activity_id?: string;
  open_id: string;
  open_token: string;
  get_from_iop: boolean;
};

export type UserApgGetAgentInfoCallParams = Omit<UserApgCheckIsAgentCallParams, "merchant_code" | "activity_id"> & {
  is_sign_up_agent?: boolean;
};

declare global {
  namespace NodeJS {
    interface Global {
      eventBus: IEventBus;
    }
  }

  interface IAppStartEventParams {
    /** app 对象 */
    app: Application<any>;
    /** 是否是 master 进程 */
    isMaster: boolean;
  }

  // 拓展事件
  interface IEventBus {
    /** @internal */
    receive(event: "user:getUser", receiver: (params: GetUserCallParams) => Promise<CommonUser | undefined>): this;

    /**
     * 获取公共用户信息
     * @param event
     * @param params
     */
    call(event: "user:getUser", params: GetUserCallParams): Promise<CommonUser | undefined>;

    /** @internal */
    receive(
      event: "user:getUserForBack",
      receiver: (params: GetUserForTestCallParams) => Promise<CommonUser | undefined>
    ): this;

    /**
     * 获取公共用户信息,后门接口查找用户时用这个方法
     * 注意: 不要在正式接口使用该方法,有性能问题
     * @param event
     * @param params
     */
    call(event: "user:getUserForBack", params: GetUserForTestCallParams): Promise<CommonUser | undefined>;

    /** @internal */
    receive(
      event: "user:getApgUser",
      receiver: (params: GetDetailUserCallParams) => Promise<IModelsApgUser | undefined>
    ): this;

    /** @internal */
    receive(event: "user:getUserTypeFromId", receiver: (params: GetUserTypeFromIdParams) => Promise<UserType>): this;

    /**
     * 根据用户id检测是什么用户类型
     * @param event
     * @param params
     */
    call(event: "user:getUserTypeFromId", params: GetUserTypeFromIdParams): Promise<UserType>;

    /**
     * 获取金管家用户信息
     * @param event
     * @param params
     */
    call(event: "user:getApgUser", params: GetDetailUserCallParams): Promise<IModelsApgUser | undefined>;

    /** @internal */
    receive(
      event: "user:getWxUser",
      receiver: (params: GetDetailUserCallParams) => Promise<IModelsWxUser | undefined>,
      wx?: boolean
    ): this;

    /**
     * 获取微信用户信息
     * @param event
     * @param params
     */
    call(event: "user:getWxUser", params: GetDetailUserCallParams): Promise<IModelsWxUser | undefined>;

    /** @internal */
    receive(
      event: "user:getWxMiniUser",
      receiver: (params: GetDetailUserCallParams) => Promise<IModelsWxMiniUser | undefined>
    ): this;

    /**
     * 获取微信小程序用户信息
     * @param event
     * @param params
     */
    call(event: "user:getWxMiniUser", params: GetDetailUserCallParams): Promise<IModelsWxMiniUser | undefined>;

    /** @internal */
    receive(event: "user:apgCheckIsAgent", receiver: (params: UserApgCheckIsAgentCallParams) => Promise<boolean>): this;

    /**
     * 检查该金管家用户是否为代理人
     * @param event
     * @param params
     */
    call(event: "user:apgCheckIsAgent", params: UserApgCheckIsAgentCallParams): Promise<boolean>;

    /** @internal */
    receive(
      event: "user:apgGetAgentInfo",
      receiver: (params: UserApgGetAgentInfoCallParams) => Promise<ISchemaApgAgentInfo>
    ): this;

    /**
     * 获取用户的代理人信息
     * @param event
     * @param params
     */
    call(event: "user:apgGetAgentInfo", params: UserApgGetAgentInfoCallParams): Promise<ISchemaApgAgentInfo>;

    on(event: "user:login", listener: (params: UserLoginEventParams) => any): this;

    /** @internal */
    emit(event: "user:login", params: UserLoginEventParams): Promise<boolean>;

    on(event: "user:invite", listener: (params: UserInviteEventParams) => any): this;

    /** @internal */
    emit(event: "user:invite", params: UserInviteEventParams): Promise<boolean>;

    /** 每个进程的 app start 方法执行的最后都会触发的事件 */
    on(event: "app:start", handler: (params: IAppStartEventParams) => void | Promise<void>): this;

    emit(event: "app:start", params: IAppStartEventParams): Promise<boolean>;
  }
}

global.eventBus = global.eventBus || new AsyncEventEmitter();

global.eventBus
  .receive("user:getUser", async ({ ctx, user_id, open_id }) => {
    const _ctx: Context = ctx;
    const { model, service } = _ctx;
    const userType = service.user.getUserTypeFromId(user_id);

    let modelKey: string;

    switch (userType) {
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
        return;
    }

    return (model as any)[modelKey].getOne({
      where: {
        id: user_id,
        open_id,
      },
    });
  })
  .receive("user:getUserForBack", async ({ ctx }) => {
    const _ctx: Context = ctx;
    let { user_id, open_id } = _ctx.request.$params;
    const { service, model } = _ctx;

    if (!user_id && !open_id) {
      const userClaims = getUserFromSession(ctx);
      user_id = userClaims.userId;
      open_id = userClaims.openId;
    }

    if (user_id) {
      const userType = service.user.getUserTypeFromId(user_id);
      let modelKey: string;

      switch (userType) {
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
          return;
      }

      return (model as any)[modelKey].getOneByPrimary(user_id);
    } else if (open_id) {
      return (
        (await model.apgUser.getOne({ where: { open_id } })) ||
        (await model.wxUser.getOne({ where: { open_id } })) ||
        (await model.wxMiniUser.getOne({ where: { open_id } }))
      );
    }
  })
  .receive("user:getUserTypeFromId", async ({ ctx, user_id }) => {
    const _ctx: Context = ctx;
    return _ctx.service.user.getUserTypeFromId(user_id);
  })
  .receive("user:getApgUser", async (params) => {
    const _ctx: Context = params.ctx;
    return _ctx.model.apgUser.getOne({
      where: {
        open_id: params.open_id,
      },
    });
  })
  .receive("user:getWxUser", async (params) => {
    const _ctx: Context = params.ctx;
    return _ctx.model.wxUser.getOne({
      where: {
        open_id: params.open_id,
      },
    });
  })
  .receive("user:getWxMiniUser", async (params) => {
    const _ctx: Context = params.ctx;
    return _ctx.model.wxMiniUser.getOne({
      where: {
        open_id: params.open_id,
      },
    });
  })
  .receive("user:apgCheckIsAgent", async ({ ctx, merchant_code, activity_id, open_id, open_token, get_from_iop }) => {
    const _ctx: Context = ctx;
    const { service, model } = _ctx;
    const user = await model.apgUser.getOne({
      where: {
        open_id,
      },
      select: ["is_agent"],
    });

    if (service.userApg.shouldRequestThird({ user, scopeId: "isAgent" })) {
      const { isAgent } = await service.userApg.getThirdInfo({
        scopeIds: ["isAgent"],
        get_from_iop,
        open_id,
        open_token,
        merchant_code,
        activity_id,
      });
      return isAgent ?? false;
    }

    return !!(user?.is_agent ?? 0);
  })
  .receive("user:apgGetAgentInfo", async ({ ctx, is_sign_up_agent, get_from_iop, open_id, open_token }) => {
    const _ctx = ctx as Context;
    const { service } = _ctx;

    return service.userApg.getMyAgentInfo({ openId: open_id }, { open_token, is_sign_up_agent, get_from_iop });
  });
