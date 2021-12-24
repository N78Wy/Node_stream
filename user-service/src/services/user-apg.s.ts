import { BaseService } from "../core";
import {
  config,
  IModelsApgAgent,
  IModelsApgUser,
  IModelsApgUserAgentRelation,
  IParamsGetUserApgAgentInfo,
  IParamsPostUserApgLogin,
  IParamsPostUserApgMiniLogin,
} from "../global";
import { UserClaims, UserType } from "../libs/auth";
import { GetAgentInfoParams, IsAgentInfo, newApgClient } from "@gz/apg";
import { assignDefined } from "../global/base/utils";
import dayjs from "dayjs";
import { UserLoginCommonRet } from "../constants";
import { ApgError } from "@gz/apg/dist/lib/apgError";

type ScopeId = "userInfo" | "customManagerOpenId" | "membershipLevel" | "isAgent";

export class UserApgService extends BaseService {
  sdk = newApgClient({
    ...config.apg,
    logger: this.ctx.log,
  } as any);

  static hasExtReturn(key: "isAgent" | "level") {
    const c = config.user?.apg?.extReturn;
    if (c) {
      return c.includes(key);
    }

    return false;
  }

  async login(params: IParamsPostUserApgLogin & { getFromIop?: boolean; readyRelation?: boolean }) {
    const { open_id, inviter_user_id, readyRelation, getFromIop = false } = params;
    const { model, service } = this.ctx;

    const user = await model.apgUser.getOne({
      where: {
        open_id,
      },
    });
    const isNewUser = !user;
    const scopeIds = [] as ScopeId[];
    const judgeParams = {
      user,
      scopeId: "userInfo" as ScopeId,
    };
    if (this.shouldRequestThird(judgeParams)) {
      scopeIds.push("userInfo");
    }

    judgeParams.scopeId = "membershipLevel";
    if (UserApgService.hasExtReturn("level") && this.shouldRequestThird(judgeParams)) {
      scopeIds.push("membershipLevel");
    }

    judgeParams.scopeId = "isAgent";
    if (UserApgService.hasExtReturn("isAgent") && this.shouldRequestThird(judgeParams)) {
      scopeIds.push("isAgent");
    }

    const info = await this.getThirdInfo({ get_from_iop: getFromIop, scopeIds, ...params });
    let { userInfo, level, isAgent, isAgentInfo } = info;

    if (!userInfo) {
      userInfo = {
        nickname: user?.nickname,
        avatar: user?.avatar,
      };
    }

    await model.beginTransaction("ApgLogin");
    const result = {
      is_new_user: isNewUser,
    } as IModelsApgUser & UserLoginCommonRet;

    const now = new Date();
    if (user) {
      const update = {
        nickname: userInfo.nickname,
        avatar: userInfo.avatar,
        is_agent: isAgent === undefined ? undefined : isAgent ? 1 : 0,
        // 如果有获取代理人信息但是isFreshman和type获取不到了,要重置为null,防止数据库信息不准确
        is_freshman: isAgentInfo ? isAgentInfo.isFreshman || null : undefined,
        agent_type: isAgentInfo ? isAgentInfo.type || null : undefined,
        last_login_at: now,
        level,
      };
      await model.apgUser.update({
        where: {
          id: user.id,
          open_id,
        },
        set: update,
        limit: 1,
      });
      assignDefined(result, user, update);
      result.last_login_at = user.last_login_at;
    } else {
      const { insertId } = await model.apgUser.insert({
        value: {
          open_id,
          nickname: userInfo.nickname,
          avatar: userInfo.avatar,
          is_agent: isAgent === undefined ? undefined : isAgent ? 1 : 0,
          is_freshman: isAgentInfo?.isFreshman,
          agent_type: isAgentInfo?.type,
          level,
          last_login_at: now,
        },
      });
      assignDefined(
        result,
        /**
         * 查询条件带上open_id主要是因为分布式数据库环境下open_id是分片键
         */
        await model.apgUser.getOne({
          where: {
            id: insertId,
            open_id,
          },
        })
      );
    }

    // 用于多用户场景需要关联时的绑定
    if (config.user?.needRelation && !readyRelation) {
      const relation = await model.userRelation.getOne({
        where: {
          apg_user_id: result.id,
        },
        select: ["id"],
      });

      if (!relation) {
        await model.userRelation.insert({
          value: {
            apg_user_id: result.id,
            apg_open_id: open_id,
          },
        });
      }
    }

    // 新用户邀请
    if (isNewUser && inviter_user_id) {
      await service.user.inviteFriend(inviter_user_id, result.id, UserType.Apg);
    }
    result.is_today_first_login = isNewUser ? true : !dayjs().isSame(result.last_login_at, "d");
    await global.eventBus.emit("user:login", { ctx: this.ctx, user: { ...result, user_id: result.id } });

    return result;
  }

  async miniLogin({ code, open_id, open_token, getFromIop }: IParamsPostUserApgMiniLogin & { getFromIop: boolean }) {
    const { model, service } = this.ctx;

    if (!code) {
      return {
        apg_user: await service.userApg.login({
          open_id,
          open_token,
          iop_open_id: open_id,
          iop_open_token: open_token,
          getFromIop,
        }),
      };
    }

    const apg = await service.userApg.login({
      open_id,
      open_token,
      iop_open_id: open_id,
      iop_open_token: open_token,
      readyRelation: true,
      getFromIop,
    });
    await model.endTransaction();
    const wxMini = await service.userWxMini.login({ code, readyRelation: true });

    if (config.user.needRelation) {
      let buildRelation = false;
      const apgRelation = await model.userRelation.getOne({
        where: {
          apg_user_id: apg.id,
        },
        select: ["id", "wx_mini_user_id"],
      });
      const wxMiniRelation = await model.userRelation.getOne({
        where: {
          wx_mini_user_id: wxMini.id,
        },
        select: ["id", "apg_user_id"],
      });

      if (!apgRelation && !wxMiniRelation) {
        buildRelation = true;
      } else {
        if (apgRelation && !apgRelation.wx_mini_user_id) {
          await model.userRelation.deleteByPrimary(apgRelation.id);
          buildRelation = true;
        }

        if (wxMiniRelation && !wxMiniRelation.apg_user_id) {
          await model.userRelation.deleteByPrimary(wxMiniRelation.id);
          buildRelation = true;
        }
      }

      if (buildRelation) {
        await model.userRelation.insert({
          value: {
            apg_user_id: apg.id,
            apg_open_id: apg.open_id,
            wx_mini_user_id: wxMini.id,
            wx_mini_open_id: wxMini.open_id,
          },
        });
      }
    }

    return {
      apg_user: apg,
      wx_mini_user: wxMini,
    };
  }

  async getMyAgentInfo(
    userClaims: Pick<UserClaims, "openId">,
    { open_token, is_sign_up_agent, get_from_iop }: IParamsGetUserApgAgentInfo & { get_from_iop: boolean }
  ) {
    const { model } = this.ctx;
    const user = await model.apgUser.getOne({
      where: {
        open_id: userClaims.openId,
      },
      select: ["id", "is_agent", "level"],
    });
    const relation = await model.apgUserAgentRelation.getOne({
      where: {
        user_open_id: userClaims.openId,
      },
      select: ["agent_id"],
    });
    let agentInfo: any;

    if (
      await this.shouldRequestThird({
        user,
        scopeId: "customManagerOpenId",
        relation,
      })
    ) {
      const { agentInfo: thirdAgentInfo } = await this.getThirdInfo({
        scopeIds: ["customManagerOpenId"],
        is_sign_up_agent,
        open_id: userClaims.openId,
        open_token,
        iop_open_id: userClaims.openId,
        iop_open_token: open_token,
        get_from_iop,
      });
      agentInfo = thirdAgentInfo;
      await this.updateAgentBind(userClaims, agentInfo, relation);
    } else {
      // 不请求但没有建立过绑定关系的话,表示没有代理人
      if (!relation) {
        return {
          is_exists: false,
        };
      }

      agentInfo = await model.apgAgent.getOneByPrimary(relation.agent_id);
    }

    if (!agentInfo) {
      return {
        is_exists: false,
      };
    }

    agentInfo.is_exists = true;
    delete agentInfo.agent_no;
    const regionConfig = config.user?.apg?.region;
    if (!agentInfo.ext && regionConfig) {
      agentInfo.ext = (regionConfig as any)[`_${agentInfo.region_code}`];
    }
    return agentInfo;
  }

  async updateAgentBind(
    userClaims: Pick<UserClaims, "openId">,
    agentInfo?: Omit<IModelsApgAgent, "id" | "create_at" | "update_at"> | null,
    relation?: Pick<IModelsApgUserAgentRelation, "agent_id">
  ) {
    const { model } = this.ctx;
    if (agentInfo) {
      // 处理绑定过的情况
      if (relation) {
        // 如果有open_id要处理潜在的冲突与合并代理人绑定关系
        if (agentInfo.open_id) {
          let needMerge = false;
          let modelAgent = await model.apgAgent.getOne({
            where: {
              open_id: agentInfo.open_id,
            },
            select: ["id"],
          });

          if (modelAgent) {
            needMerge = modelAgent.id !== relation.agent_id;
          } else {
            /**
             * catch是因为这个代理人可能之前没返回open_id,但是之后返回了
             * 这时候如果新用户进来了,绑定了该代理人,建立了关系,老用户再进来更新open_id就会报冲突错误了
             */
            try {
              await model.apgAgent.updateByPrimary(relation.agent_id, {
                set: agentInfo,
              });
            } catch (e) {
              modelAgent = await model.apgAgent.getOne({
                where: {
                  open_id: agentInfo.open_id,
                },
                select: ["id"],
              });
              needMerge = modelAgent ? modelAgent.id === relation.agent_id : false;
            }
          }

          // 重定向绑定关系
          if (needMerge && modelAgent) {
            await model.apgUserAgentRelation.update({
              where: {
                user_open_id: userClaims.openId,
              },
              set: {
                agent_id: modelAgent.id,
              },
            });
          }

          await model.apgAgent.update({
            where: {
              open_id: agentInfo.open_id,
            },
            set: agentInfo,
          });
        } else {
          await model.apgAgent.updateByPrimary(relation.agent_id, {
            set: agentInfo,
          });
        }
      } else {
        let agentId = 0;
        /**
         * 如果没有绑定过,但是有返回open_id要先看下数据库有没有这个代理人
         * 因为这个代理人可能被别人绑定过了
         * 有返回open_id的情况下,代理人与用户是1:N关系
         * 没有open_id的情况下是1:1的关系
         */
        if (agentInfo.open_id) {
          let modelAgent = await model.apgAgent.getOne({
            where: {
              open_id: agentInfo.open_id,
            },
            select: ["id"],
          });

          if (modelAgent) {
            agentId = modelAgent.id;
          } else {
            /**
             * 多个用户会有相同的代理人,所以并发冲突是很常见的,要catch一下
             */
            try {
              const { insertId } = await model.apgAgent.insert({ value: agentInfo });
              agentId = insertId;
            } catch (e) {
              modelAgent = await model.apgAgent.getOne({
                where: {
                  open_id: agentInfo.open_id,
                },
                select: ["id"],
              });
              agentId = modelAgent?.id || 0;
            }
          }
        } else {
          // 没有openId则对用户和代理人信息建立1:1关系
          const { insertId } = await model.apgAgent.insert({
            value: agentInfo,
          });
          agentId = insertId;
        }

        // 建立绑定关系
        if (agentId) {
          await model.apgUserAgentRelation.insert({
            value: {
              user_open_id: userClaims.openId,
              agent_id: agentId,
            },
          });
        }
      }
    } else if (agentInfo === null && relation) {
      /**
       * 请求了代理人信息但是没拿到,要解绑
       */
      await model.apgUserAgentRelation.delete({
        where: {
          user_open_id: userClaims.openId,
        },
      });
    }
  }

  async getThirdInfo(params: {
    get_from_iop: boolean;
    open_id: string;
    open_token: string;
    iop_open_id?: string;
    iop_open_token?: string;
    is_sign_up_agent?: boolean;
    merchant_code?: string;
    activity_id?: string;
    scopeIds: ScopeId[];
  }): Promise<{
    userInfo?: { nickname?: string | null; avatar?: string | null };
    isAgent?: boolean;
    isAgentInfo?: IsAgentInfo;
    level?: string;
    agentInfo?: (Omit<IModelsApgAgent, "id" | "create_at" | "update_at"> & { ext?: any }) | null;
  }> {
    const {
      get_from_iop: getFromIop,
      open_id,
      open_token,
      iop_open_id,
      iop_open_token,
      is_sign_up_agent,
      scopeIds,
      merchant_code,
      activity_id,
    } = params;
    const { errors } = this.ctx;
    const sdk = this.sdk;
    const thirdParams = {
      openId: open_id,
      openToken: open_token,
      merchantCode: merchant_code,
      activityId: activity_id,
    };
    let agentInfo: (Omit<IModelsApgAgent, "id" | "create_at" | "update_at"> & { ext?: any }) | undefined | null;
    let isAgent: boolean | undefined;
    let isAgentInfo: IsAgentInfo | undefined;
    let level: string | undefined;
    let userInfo: { nickname?: string | null; avatar?: string | null } | undefined;

    if (!scopeIds.length) {
      return {};
    }

    if (getFromIop) {
      if (!iop_open_token || !iop_open_id) {
        throw new errors.InvalidParameter("缺少参数 iop_open_token 或者 iop_open_id");
      }
      try {
        const info = await sdk.iopUserInfo({
          openId: iop_open_id,
          openToken: iop_open_token,
          merchantCode: merchant_code,
          scopeIds,
          withCredentials: config.user?.apg?.iopWithCredentails ? "Y" : "N",
        });

        for (const scopeId of scopeIds) {
          switch (scopeId) {
            case "userInfo":
              userInfo = {
                nickname: info.userInfo?.nickname,
                avatar: info.userInfo?.avatarUrl,
              };
              break;
            case "customManagerOpenId":
              if (!info.customManagerOpenId) {
                break;
              }
              agentInfo = Object.keys(info.customManagerOpenId).length
                ? {
                    open_id: info.customManagerOpenId.openId,
                  }
                : null;
              break;
            case "membershipLevel":
              level = info.membershipLevel?.level;
              break;
            case "isAgent":
              const isFreshman = (info.isAgent?.isRecruit ?? "N") === "N" ? "false" : "true";
              isAgent =
                info.isAgent?.isAgent === "Y"
                  ? config.user?.apg?.validateIsAgentExcludeEpass ?? true
                    ? isFreshman === "false"
                    : true
                  : false;
              isAgentInfo = {
                isAgent: info.isAgent?.isAgent === "Y" ? "1" : "0",
                isFreshman,
              };
              break;
          }
        }
      } catch (err) {
        if (err instanceof ApgError) {
          /**
           * 用户没授权会报这个错,如果配置了回退旧平台则去请求旧平台
           */
          if (err.code === "42020508" && config.user?.apg?.rollbackOnIopAuthError) {
            return this.getThirdInfo({ ...params, get_from_iop: false });
          }

          /**
           * 如果没有代理人信息会报这个错,如果是只请求了代理人信息则会不报错,返回null表示没有代理人信息就行
           */
          if (err.code === "42020516" && scopeIds.length === 1) {
            agentInfo = null;
          } else if (err.code === "42020514" && scopeIds.length === 1) {
            /**
             * 用户绑定了代理人,但金管家可能返回代理人信息不存在,这时候给个虚假的代理人信息,防止影响流程
             */
            agentInfo = {
              open_id: "notFoundAgent",
            };
          } else {
            throw new errors.ApgGetIopUserInfoError(err.message);
          }
        } else {
          throw new errors.ApgGetIopUserInfoError(err.message);
        }
      }
    } else {
      for (const scopeId of scopeIds) {
        switch (scopeId) {
          case "userInfo":
            try {
              userInfo = await this.sdk.getUserInfo(thirdParams);
            } catch (err) {
              throw new this.ctx.errors.ApgGetUserInfoError(err.message);
            }
            break;
          case "customManagerOpenId":
            try {
              const pass: GetAgentInfoParams = {
                ...thirdParams,
                isSignUpAgent: is_sign_up_agent ? "true" : "false",
              };

              let thirdAgentInfo = await sdk.getAgentInfo(pass);
              if (
                config.user?.apg?.retryIfAgentNotExists &&
                (!thirdAgentInfo || Object.keys(thirdAgentInfo).length === 0)
              ) {
                if (is_sign_up_agent) {
                  this.ctx.log.info("获取活动代理人失败,尝试获取app代理人");
                } else {
                  this.ctx.log.info("获取app代理人失败,尝试获取活动代理人");
                }
                pass.isSignUpAgent = !is_sign_up_agent ? "true" : "false";
                thirdAgentInfo = await sdk.getAgentInfo(pass);
              }

              if (Object.keys(thirdAgentInfo).length === 0) {
                agentInfo = null;
              }

              agentInfo = {
                open_id: thirdAgentInfo.agentOpenId,
                mobile: thirdAgentInfo.mobile,
                agent_no: thirdAgentInfo.agentNo,
                mark_agent_no: thirdAgentInfo.markAgentNo,
                nickname: thirdAgentInfo.name,
                avatar: thirdAgentInfo.headImage,
                avatar_type: thirdAgentInfo.headImageType,
                institution: thirdAgentInfo.institution,
                region_code: thirdAgentInfo.regionCode,
                card_url: thirdAgentInfo.cardUrl,
              };
            } catch (err) {
              throw new errors.ApgGetAgentInfoError(err.message);
            }
            break;
          case "membershipLevel":
            if (!iop_open_token || !iop_open_id) {
              throw new errors.InvalidParameter("缺少参数 iop_open_token 或者 iop_open_id");
            }
            try {
              const levelInfo = await sdk.iopUserInfo({
                ...thirdParams,
                openToken: iop_open_token,
                openId: iop_open_id,
                scopeIds: ["membershipLevel"],
                withCredentials: "N",
              });
              level = levelInfo.membershipLevel?.level;
            } catch (err) {
              if (config.user?.apg?.throwGetUserLevelError ?? true) {
                throw new errors.ApgGetIopUserInfoError(err.message);
              }
            }
            break;
          case "isAgent":
            isAgentInfo = await sdk.getIsAgentInfo({ ...thirdParams, activityId: config.user?.apg?.isAgentActivityId });
            if (isAgentInfo) {
              try {
                isAgent =
                  config.user?.apg?.validateIsAgentExcludeEpass ?? true
                    ? await sdk.validateIsAgentExcludeEpass(isAgentInfo!)
                    : await sdk.validateIsAgent(isAgentInfo!);
              } catch (err) {
                if (config.user?.apg?.throwValidateIsAgentError ?? true) {
                  throw new errors.ApgValidAgentError(err.message);
                }
              }
            }
            break;
        }
      }
    }

    return {
      userInfo,
      agentInfo,
      isAgent,
      level,
      isAgentInfo,
    };
  }

  shouldRequestThird({
    user,
    scopeId,
    relation,
  }: {
    user?: Pick<IModelsApgUser, "level" | "is_agent">;
    scopeId: ScopeId;
    relation?: Partial<IModelsApgUserAgentRelation>;
  }) {
    if (!user) {
      return true;
    }

    switch (scopeId) {
      case "userInfo":
        /**
         * 默认新老用户都会去查信息
         * 如果 getUserInfoOnlyNewUser 配置为 true, 则只有新用户会去查信息
         */
        return config.user?.apg?.getUserInfoOnlyNewUser === false;
      case "customManagerOpenId":
        return (
          // 如果配置为true,则老用户不会去查是否为代理人
          (config.user?.apg?.getAgentInfoOnlyNewUser ?? false) === false
            ? // 有代理人信息且配置为true则去查询
              relation
              ? (config.user?.apg?.getAgentInfoIfHasAgent ?? true) === true
              : // 没有代理人信息且配置为true为true则去查询
                (config.user?.apg?.getAgentInfoIfNotAgent ?? true) === true
            : false
        );
      case "membershipLevel":
        return (
          // 如果配置为true,则老用户不会去查是否为代理人
          (config.user?.apg?.getUserLevelOnlyNewUser ?? false) === false
            ? // 不是代理人且配置为true则去查询
              user?.level
              ? (config.user?.apg?.getUserLevelIfHasLevel ?? true) === true
              : // 是代理人且配置为true为true则去查询
                (config.user?.apg?.getUserLevelIfNotLevel ?? true) === true
            : false
        );
      case "isAgent":
        return (
          // 如果配置为true,则老用户不会去查是否为代理人
          (config.user?.apg?.validateIsAgentOnlyNewUser ?? false) === false
            ? // 不是代理人且配置为true则去查询
              user?.is_agent === 0
              ? (config.user?.apg?.validateIsAgentIfNotAgent ?? true) === true
              : // 是代理人且配置为true为true则去查询
                config.user?.apg?.validateIsAgentIfIsAgent ?? true
            : false
        );
    }
  }
}
