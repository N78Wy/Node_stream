import { BaseService } from "../core";
import {
  config,
  errors,
  IModelsWxUser,
  IParamsGetUserWxRabbitpreInfo,
  IParamsGetUserWxRabbitpreUrl,
  pkg,
} from "../global";
import { getPlatformApi } from "@gz/rabbit-api";
import { PlatformCheck } from "@gz/rabbit-api/dist/lib/check/platform_check";
import { assignDefined } from "../global/base/utils";
import { UserLoginCommonRet } from "../constants";
import dayjs from "dayjs";

const errorHandle = (err: any) => {
  throw new errors.ExceInvalidError(JSON.stringify(err));
};

export class UserWxRabbitpreService extends BaseService {
  async getAuthUrl({ redirect_url, scope = "snsapi_userinfo" }: IParamsGetUserWxRabbitpreUrl) {
    if (config.wx?.rabbitpre?.mock ?? true) {
      return "https://www.baidu.com";
    }

    const { log } = this.ctx;
    const { host, wsId, secret, templateId } = config.wx?.rabbitpre ?? {};
    const { platformCheck } = getPlatformApi(
      {
        host,
        platform: {
          wsId,
          secret,
          templateId,
        },
      },
      this.log
    );

    /**
     * 报错时自带有log,这里log下正常的就行
     */
    platformCheck.errorHandle = errorHandle;
    const now = Date.now();
    const res = platformCheck.getLoginUrl({
      // 本地调试的时候转跳地址是未授权的，因此需要先到测试服务器上的redirect接口才能获取到token
      // 不然会出现网址不合法的报错
      // 正式环境之后可以直接转跳回h5链接
      redirectUrl: config.ispro
        ? redirect_url
        : `https://${pkg.name}.${config.env}.h5no1.com/api/login/redirect?redirect_url=${encodeURIComponent(
            redirect_url
          )}`,
      wsId,
      scope,
    });
    log.info({
      msg: "rabbitpre请求成功",
      spent: Date.now() - now,
      responseBody: res,
    });
    return res;
  }

  async getUserInfo({ token }: IParamsGetUserWxRabbitpreInfo) {
    const { service, model, log } = this.ctx;
    const isMock = config.wx?.rabbitpre?.mock ?? true;
    type PromiseType<T> = T extends Promise<infer U> ? U : T;
    let userInfo: PromiseType<ReturnType<PlatformCheck["getUserInfo"]>> & {
      language?: string;
      sex?: string;
      country?: string;
      privilege?: any;
    };
    if (isMock) {
      userInfo = {
        openid: token,
        nickname: token.slice(0, 8),
        headimgurl: "",
        province: "",
        unionid: "",
        city: "",
      };
    } else {
      //通过token获取微信用户的信息
      const { platformCheck } = getPlatformApi(config.platformConfig, this.ctx.log);
      platformCheck.errorHandle = errorHandle;
      const now = Date.now();
      userInfo = await platformCheck.getUserInfo(token, false);
      log.info({
        msg: "rabbitpre请求成功",
        spent: Date.now() - now,
        responseBody: userInfo,
      });
    }

    let user = await model.wxUser.getOne({
      where: {
        open_id: userInfo.openid,
      },
    });
    const privilege = userInfo.privilege ? JSON.stringify(userInfo.privilege) : undefined;
    const now = new Date();
    const result = { is_new_user: !user } as IModelsWxUser & UserLoginCommonRet;

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
        privilege,
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
          privilege,
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

    if (config.user.needRelation) {
      await service.userWx.buildRelation(result);
    }
    result.is_today_first_login = result.is_new_user ? true : !dayjs().isSame(result.last_login_at, "d");
    await global.eventBus.emit("user:login", { ctx: this.ctx, user: { ...result, user_id: result.id } });
    return result;
  }
}
