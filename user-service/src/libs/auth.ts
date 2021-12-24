import { Context } from "@gz/web";
import { errors, helper, TYPES } from "../global";
import { apiService } from "../api";

/**
 * 用户类型
 */
export enum UserType {
  Unknown,
  /** 金管家 */
  Apg,
  /** 微信 */
  Wx,
  /** 微信小程序 */
  WxMini,
}

export type UserClaims = {
  /**
   * @deprecated
   * 用户具体表的id,如用户类型是Apg,则指的是apg_user表的id
   * detailId和userId模糊不清,固将其排除出去
   */
  detailId?: never;
  /**
   * @deprecated
   * 使用never防止被误用
   */
  id?: never;
  /**
   * 用户id
   */
  userId: number;
  openId: string;
  /** 用户类型 */
  type: UserType | number;
  /** 用户昵称 */
  nickname?: string | null;
  sessionKey?: string;
  // 关联的用户
  relations?: Omit<UserClaims, "relations">[];
  [key: string]: any;
};

let register = false;

/**
 * 用户权限校验守卫,拦截用户没有登录的请求
 */
export function userAuthGuard(type?: UserType) {
  if (!register) {
    apiService.beforeHooks((ctx) => {
      ctx.onWriteHead(() => {
        const user = getUserFromSession(ctx);
        user?.restore?.();
      });
      ctx.next();
    });
  }
  register = true;
  return (ctx: Context) => {
    const user = getUserFromSession(ctx);
    if (!user) {
      throw new errors.PermissionsError("用户未登录");
    }

    if (type && user.type !== type) {
      if (user.relations) {
        const relation = user.relations.find((r) => r.type === type);
        if (!relation) {
          throw new errors.PermissionsError("非目标用户类型");
        }

        const keys = Object.keys(relation);
        const exchange = () => {
          for (const key of keys) {
            [user[key], relation[key]] = [relation[key], user[key]];
          }
        };
        exchange();
        user.restore = exchange;
      } else {
        throw new errors.PermissionsError("非目标用户类型");
      }
    }

    ctx.next();
  };
}

export function setUserToSession(ctx: Context, userClaims: UserClaims) {
  ctx.session.data.user = userClaims;
}

export function getUserFromSession(ctx: Context) {
  return ctx.session.data.user as UserClaims;
}

export function mergeUserToSession(ctx: Context, userClaims: Partial<UserClaims>) {
  Object.assign(ctx.session.data.user, userClaims);
}

export const authHeadersSchema = {
  authorization: helper.build(TYPES.NotEmptyString, "权限校验,格式 Bearer ${token}"),
};
