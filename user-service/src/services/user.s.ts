import { BaseService } from "../core";
import { UserType } from "..";
import { InviteType } from "../constants";
import { config, logger } from "../global";

export class UserService extends BaseService {
  async inviteFriend(userId: number, friendUserId: number, userType: UserType) {
    const { model, errors } = this.ctx;
    let modelName: string;
    switch (userType) {
      case UserType.Apg:
        modelName = "apgUser";
        break;
      case UserType.Wx:
        modelName = "wxUser";
        break;
      case UserType.WxMini:
        modelName = "wxMiniUser";
        break;
      default:
        throw new errors.InternalError("nonsupport user type");
    }
    const user = (model as any)[modelName].getOneByPrimary(userId, {
      select: ["id"],
    });

    if (!user) {
      return;
    }

    const friendUserType = this.getUserTypeFromId(friendUserId);
    const inviteRecord = await model.userInvite.getOne({
      where: {
        user_id: userId,
        user_type: userType,
        friend_user_id: friendUserId,
        friend_user_type: friendUserType,
      },
      select: ["id"],
    });

    if (inviteRecord) {
      return;
    }

    try {
      await model.userInvite.batchInsert({
        values: [
          {
            user_id: userId,
            user_type: userType,
            friend_user_id: friendUserId,
            friend_user_type: friendUserType,
            type: InviteType.Inviter,
          },
          {
            user_id: friendUserId,
            user_type: friendUserType,
            friend_user_id: userId,
            friend_user_type: userType,
            type: InviteType.Invitee,
          },
        ],
      });
      await global.eventBus.emit("user:invite", {
        ctx: this.ctx,
        user_id: userId,
        friend_user_id: friendUserId,
        user_type: userType,
      });
    } catch (e) {
      logger.error({
        msg: "邀请失败",
        err: e,
      });
    }
  }

  getUserTypeFromId(id: number) {
    if (this.checkIdUserType(id, UserType.Apg)) {
      return UserType.Apg;
    } else if (this.checkIdUserType(id, UserType.Wx)) {
      return UserType.Wx;
    } else if (this.checkIdUserType(id, UserType.WxMini)) {
      return UserType.WxMini;
    } else {
      return UserType.Unknown;
    }
  }

  checkIdUserType(id: number, userType: UserType) {
    const { apgUserStartId = 1, wxUserStartId = 200000000, wxMiniUserStartId = 400000000 } = config?.user ?? {};
    switch (userType) {
      case UserType.Apg:
        return id >= apgUserStartId && id < wxUserStartId;
      case UserType.Wx:
        return id >= wxUserStartId && id < wxMiniUserStartId;
      case UserType.WxMini:
        return id >= wxMiniUserStartId;
    }
  }
}
