import { helper, TYPES } from "./global";

export type UserLoginCommonRet = {
  last_login_at: Date;
  is_new_user: boolean;
  is_today_first_login: boolean;
};

export const commonSchema = {
  is_new_user: helper.build(TYPES.Boolean, "是否是新用户", true),
  last_login_at: helper.build(TYPES.Date, `最后登录时间,格式 2020-11-30T07:33:05.423Z`, true),
  is_today_first_login: helper.build(TYPES.Boolean, "是否是今天第一次登录", true),
};

export const backUserSchema = {
  user_id: helper.build(TYPES.Integer, "用户id"),
  open_id: helper.build(TYPES.String, "open id, user_id和open_id 二选一即可"),
};

export enum InviteType {
  // 邀请者
  Inviter = 1,
  // 被邀请者
  Invitee = 2,
}
