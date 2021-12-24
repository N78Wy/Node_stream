import { BaseService } from "../core";
import {
  config,
  IModelsWxMiniUser,
  IParamsPostUserWxMiniBindPhone,
  IParamsPostUserWxMiniGrant,
  IParamsPostUserWxMiniLogin,
  redis,
} from "../global";
import { UserClaims } from "..";
import { newWxMini } from "@gz/wx-mini";
import { assignDefined } from "../global/base/utils";
import dayjs from "dayjs";
import { UserLoginCommonRet } from "../constants";

export class UserWxMiniService extends BaseService {
  sdk = newWxMini({
    // @ts-ignore
    mock: true,
    ...config.wxMini,
    logger: this.ctx.log,
    redis,
    errorHandler: (err: string) => {
      throw new this.ctx.errors.InternalError(err);
    },
  } as any);

  /**
   * 登录
   */
  async login({ code, readyRelation }: IParamsPostUserWxMiniLogin & { readyRelation?: boolean }) {
    const { model } = this.ctx;
    const sdk = this.sdk;
    const session = await sdk.code2session(code);
    await model.beginTransaction("WxMiniLogin");
    const user = await model.wxMiniUser.getOne({
      where: {
        open_id: session.openid,
      },
    });
    const result = {
      is_new_user: !user,
      ...user,
      union_id: session.unionid,
      open_id: session.openid,
      session_key: session.session_key,
    } as IModelsWxMiniUser & UserLoginCommonRet & { session_key: string };
    const now = new Date();

    if (user) {
      /**
       * 只需更新最后登录时间
       */
      await model.wxMiniUser.update({
        where: {
          id: user.id,
          open_id: user.open_id,
        },
        set: {
          last_login_at: now,
        },
      });
    } else {
      const { insertId } = await model.wxMiniUser.insert({
        value: {
          open_id: session.openid,
          union_id: session.unionid,
          last_login_at: now,
        },
      });
      assignDefined(
        result,
        await model.wxMiniUser.getOne({
          where: {
            id: insertId,
            open_id: session.openid,
          },
        }),
        {
          union_id: session.unionid,
          open_id: session.openid,
          session_key: session.session_key,
        }
      );
    }

    if (config.user?.needRelation && !readyRelation) {
      const relation = await model.userRelation.getOne({
        where: {
          wx_mini_user_id: result.id,
        },
        select: ["id"],
      });
      if (!relation) {
        await model.userRelation.insert({
          value: {
            wx_mini_user_id: result.id,
            wx_mini_open_id: session.openid,
          },
        });
      }
    }

    result.is_today_first_login = result.is_new_user ? true : !dayjs().isSame(result.last_login_at, "d");
    await global.eventBus.emit("user:login", { ctx: this.ctx, user: { ...result, user_id: result.id } });
    return result;
  }

  /**
   * 授权用户信息
   * @param userClaims
   * @param encryptedData
   * @param iv
   */
  async grant(userClaims: UserClaims, { encryptedData, iv }: IParamsPostUserWxMiniGrant) {
    const { model } = this.ctx;
    const sdk = this.sdk;
    const userInfo = sdk.getUserInfo({ encryptedData, iv, sessionKey: userClaims.sessionKey! });
    await model.beginTransaction("WxMiniGrant");
    await model.wxMiniUser.update({
      where: {
        id: userClaims.userId,
        open_id: userClaims.openId,
      },
      set: {
        union_id: userInfo.unionId,
        nickname: userInfo.nickName,
        avatar: userInfo.avatarUrl,
        gender: userInfo.gender,
        city: userInfo.city,
        province: userInfo.province,
        country: userInfo.country,
      },
    });
    return model.wxMiniUser.getOne({
      where: {
        id: userClaims.userId,
        open_id: userClaims.openId,
      },
    });
  }

  /**
   * 绑定手机号
   * @param userClaims
   * @param encryptedData
   * @param iv
   */
  async bindPhone(userClaims: UserClaims, { encryptedData, iv }: IParamsPostUserWxMiniBindPhone) {
    const { model } = this.ctx;
    const sdk = this.sdk;
    const phoneInfo = sdk.getPhoneInfo({
      encryptedData,
      iv,
      sessionKey: userClaims.sessionKey!,
    });
    await model.beginTransaction("WxMiniBindPhone");
    await model.wxMiniUser.update({
      where: {
        id: userClaims.userId,
        open_id: userClaims.openId,
      },
      set: {
        phone: phoneInfo.phoneNumber,
        pure_phone: phoneInfo.purePhoneNumber,
        country_code: phoneInfo.countryCode,
      },
    });
    return model.wxMiniUser.getOne({
      where: {
        id: userClaims.userId,
        open_id: userClaims.openId,
      },
    });
  }
}
