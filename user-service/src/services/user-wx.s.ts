import { BaseService } from "../core";
import { config, IModelsWxUser, IParamsPostUserWxBaseAuth, IParamsPostUserWxGrant } from "../global";
import WeChat from "@gz/wechat";
import { assignDefined } from "../global/base/utils";
import { UserLoginCommonRet } from "../constants";
import dayjs from "dayjs";

export class UserWxService extends BaseService {
  sdk = new WeChat((config.wxOpenPlatform as any)[config.wx.openPlatform + ""].host, config.wx.appId);

  /**
   * 隐式授权
   */
  async baseAuth({ code, readyRelation }: IParamsPostUserWxBaseAuth & { readyRelation?: boolean }) {
    const { model } = this.ctx;
    const openId = config.wx?.mock ?? true ? code : await this.sdk.getOpenIdByCode(code);
    await model.beginTransaction("WxBaseAuth");
    const user = await model.wxUser.getOne({
      where: {
        open_id: openId,
      },
    });
    const result = { is_new_user: !user, ...user } as IModelsWxUser & UserLoginCommonRet;
    const now = new Date();

    if (user) {
      /**
       * 只需更新最后登录时间
       */
      await model.wxUser.update({
        where: {
          id: user.id,
          open_id: openId,
        },
        set: {
          last_login_at: now,
        },
      });
    } else {
      const { insertId } = await model.wxUser.insert({
        value: {
          open_id: openId,
          last_login_at: now,
        },
      });
      assignDefined(
        result,
        await model.wxUser.getOne({
          where: {
            id: insertId,
            open_id: openId,
          },
        })
      );
    }
    if (!readyRelation) {
      await this.buildRelation(result);
    }
    result.is_today_first_login = result.is_new_user ? true : !dayjs().isSame(result.last_login_at, "d");
    await global.eventBus.emit("user:login", { ctx: this.ctx, user: { ...result, user_id: result.id } });
    return result;
  }

  /**
   * 显式授权
   */
  async grant({ code, readyRelation }: IParamsPostUserWxGrant & { readyRelation?: boolean }) {
    const { model } = this.ctx;
    const userInfo =
      config.wx?.mock ?? true
        ? {
            openid: code,
            headimgurl: "",
            nickname: "",
            sex: "0",
            city: "广州",
            province: "广东",
            country: "中国",
            unionid: code,
            privilege: ["test"],
            language: "ZH_CN",
          }
        : await this.sdk.getUserInfoByCode(code);
    await model.beginTransaction("WxGrant");
    const user = await model.wxUser.getOne({
      where: {
        open_id: userInfo.openid,
      },
    });
    const result = { is_new_user: !user } as IModelsWxUser & UserLoginCommonRet;
    const now = new Date();

    if (user) {
      const update = {
        union_id: userInfo.unionid,
        nickname: userInfo.nickname,
        avatar: userInfo.headimgurl,
        sex: userInfo.sex,
        city: userInfo.city,
        province: userInfo.province,
        country: userInfo.country,
        language: userInfo.language,
        privilege: userInfo.privilege ? JSON.stringify(userInfo.privilege) : null,
        last_login_at: now,
      };
      await model.wxUser.update({
        where: {
          id: user.id,
          open_id: user.open_id,
        },
        set: update,
        limit: 1,
      });
      assignDefined(result, user, update);
      result.last_login_at = user.last_login_at;
    } else {
      const { insertId } = await model.wxUser.insert({
        value: {
          open_id: userInfo.openid,
          union_id: userInfo.unionid,
          nickname: userInfo.nickname,
          avatar: userInfo.headimgurl,
          sex: userInfo.sex,
          city: userInfo.city,
          province: userInfo.province,
          country: userInfo.country,
          language: userInfo.language,
          privilege: userInfo.privilege ? JSON.stringify(userInfo.privilege) : undefined,
          last_login_at: now,
        },
      });
      assignDefined(
        result,
        await model.wxUser.getOne({
          where: {
            id: insertId,
            open_id: userInfo.openid,
          },
        })
      );
    }
    if (!readyRelation) {
      await this.buildRelation(result);
    }
    result.is_today_first_login = result.is_new_user ? true : !dayjs().isSame(result.last_login_at, "d");
    return result;
  }

  async buildRelation(user: IModelsWxUser) {
    if (!config.user?.needRelation) {
      return;
    }
    const { model } = this.ctx;
    const relation = await model.userRelation.getOne({
      where: {
        wx_user_id: user.id,
      },
      select: ["id"],
    });

    if (!relation) {
      await model.userRelation.insert({
        value: {
          wx_user_id: user.id,
          wx_open_id: user.open_id,
        },
      });
    }
  }
}
