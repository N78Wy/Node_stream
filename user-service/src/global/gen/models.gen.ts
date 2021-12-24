/**
 * @file models
 * 请勿手动修改此文件内容
 * @author Yourtion Guo <yourtion@gmail.com>
 */

/** undefined */
export interface IModelsApgAgent {
  /** 金管家代理人id */
  id: number;
  /** 创建时间 */
  create_at: Date;
  /** 更新时间 */
  update_at: Date;
  open_id?: string | null;
  /** 手机号码,带*的 */
  mobile?: string | null;
  /** 姓名 */
  nickname?: string | null;
  /** 头像 */
  avatar?: string | null;
  /** 头像类型(00系统、01自定义、02上传至七牛的自定义头像） */
  avatar_type?: string | null;
  /** 业务员号 */
  agent_no?: string | null;
  /** 业务员号,带*的 */
  mark_agent_no?: string | null;
  /** 所属二级机构 */
  institution?: string | null;
  /** 所属二级机构编码 */
  region_code?: string | null;
  /** 封面 */
  card_url?: string | null;
}
/** undefined Schema */
export const apgAgentSchema = {
  id: { type: "Integer", comment: "金管家代理人id", required: true },
  create_at: { type: "Date", comment: "创建时间", required: false },
  update_at: { type: "Date", comment: "更新时间", required: false },
  open_id: { type: "NullableString", comment: "", required: false },
  mobile: { type: "NullableString", comment: "手机号码,带*的", required: false },
  nickname: { type: "NullableString", comment: "姓名", required: false },
  avatar: { type: "NullableString", comment: "头像", required: false },
  avatar_type: {
    type: "NullableString",
    comment: "头像类型(00系统、01自定义、02上传至七牛的自定义头像）",
    required: false,
  },
  agent_no: { type: "NullableString", comment: "业务员号", required: false },
  mark_agent_no: { type: "NullableString", comment: "业务员号,带*的", required: false },
  institution: { type: "NullableString", comment: "所属二级机构", required: false },
  region_code: { type: "NullableString", comment: "所属二级机构编码", required: false },
  card_url: { type: "NullableString", comment: "封面", required: false },
} as const;
/** undefined Keys */
export const apgAgentKeys = {
  id: "id",
  createAt: "create_at",
  updateAt: "update_at",
  openId: "open_id",
  mobile: "mobile",
  nickname: "nickname",
  avatar: "avatar",
  avatarType: "avatar_type",
  agentNo: "agent_no",
  markAgentNo: "mark_agent_no",
  institution: "institution",
  regionCode: "region_code",
  cardUrl: "card_url",
} as const;
/** undefined Fields */
export const apgAgentFields = [
  "id",
  "create_at",
  "update_at",
  "open_id",
  "mobile",
  "nickname",
  "avatar",
  "avatar_type",
  "agent_no",
  "mark_agent_no",
  "institution",
  "region_code",
  "card_url",
] as const;
/** undefined Table */
export const apgAgentTable = "apg_agent";
/**  undefined PRI */
export const apgAgentPRI = "id";

/** undefined */
export interface IModelsApgUser {
  /** 金管家用户id */
  id: number;
  /** 创建时间 */
  create_at: Date;
  /** 更新时间 */
  update_at: Date;
  open_id: string;
  /** 昵称 */
  nickname?: string | null;
  /** 头像 */
  avatar?: string | null;
  /** 是否是代理人 */
  is_agent?: number | null;
  /** 意义未知,只知道 is_freshman = false && is_agent = 1 的情况下才是真正的代理人,前端判断的时候看is_agent是否等于1就行了, 不用理会该字段 */
  is_freshman?: string | null;
  /** 查询代理人信息返回的 */
  agent_type?: string | null;
  /** 用户vip等级 */
  level?: string | null;
  /** 最后登录时间 */
  last_login_at: Date;
}
/** undefined Schema */
export const apgUserSchema = {
  id: { type: "Integer", comment: "金管家用户id", required: true },
  create_at: { type: "Date", comment: "创建时间", required: false },
  update_at: { type: "Date", comment: "更新时间", required: false },
  open_id: { type: "String", comment: "", required: true },
  nickname: { type: "NullableString", comment: "昵称", required: false },
  avatar: { type: "NullableString", comment: "头像", required: false },
  is_agent: { type: "NullableInteger", comment: "是否是代理人", required: false },
  is_freshman: {
    type: "NullableString",
    comment:
      "意义未知,只知道 is_freshman = false && is_agent = 1 的情况下才是真正的代理人,前端判断的时候看is_agent是否等于1就行了, 不用理会该字段",
    required: false,
  },
  agent_type: { type: "NullableString", comment: "查询代理人信息返回的", required: false },
  level: { type: "NullableString", comment: "用户vip等级", required: false },
  last_login_at: { type: "Date", comment: "最后登录时间", required: false },
} as const;
/** undefined Keys */
export const apgUserKeys = {
  id: "id",
  createAt: "create_at",
  updateAt: "update_at",
  openId: "open_id",
  nickname: "nickname",
  avatar: "avatar",
  isAgent: "is_agent",
  isFreshman: "is_freshman",
  agentType: "agent_type",
  level: "level",
  lastLoginAt: "last_login_at",
} as const;
/** undefined Fields */
export const apgUserFields = [
  "id",
  "create_at",
  "update_at",
  "open_id",
  "nickname",
  "avatar",
  "is_agent",
  "is_freshman",
  "agent_type",
  "level",
  "last_login_at",
] as const;
/** undefined Table */
export const apgUserTable = "apg_user";
/**  undefined PRI */
export const apgUserPRI = "id";

/** undefined */
export interface IModelsApgUserAgentRelation {
  /** 金管家用户id */
  id: number;
  /** 创建时间 */
  create_at: Date;
  /** 更新时间 */
  update_at: Date;
  /** 金管家用户open id */
  user_open_id: string;
  /** 代理人id */
  agent_id: number;
}
/** undefined Schema */
export const apgUserAgentRelationSchema = {
  id: { type: "Integer", comment: "金管家用户id", required: true },
  create_at: { type: "Date", comment: "创建时间", required: false },
  update_at: { type: "Date", comment: "更新时间", required: false },
  user_open_id: { type: "String", comment: "金管家用户open id", required: true },
  agent_id: { type: "Integer", comment: "代理人id", required: true },
} as const;
/** undefined Keys */
export const apgUserAgentRelationKeys = {
  id: "id",
  createAt: "create_at",
  updateAt: "update_at",
  userOpenId: "user_open_id",
  agentId: "agent_id",
} as const;
/** undefined Fields */
export const apgUserAgentRelationFields = ["id", "create_at", "update_at", "user_open_id", "agent_id"] as const;
/** undefined Table */
export const apgUserAgentRelationTable = "apg_user_agent_relation";
/**  undefined PRI */
export const apgUserAgentRelationPRI = "id";

/** undefined */
export interface IModelsUserInvite {
  /** 关联id */
  id: number;
  /** 创建时间 */
  create_at: Date;
  /** 更新时间 */
  update_at: Date;
  /** 邀请者用户id */
  user_id: number;
  user_type: number;
  /** 好友用户id */
  friend_user_id: number;
  friend_user_type: number;
  /** 1:邀请方,2:被邀请方 */
  type: number;
}
/** undefined Schema */
export const userInviteSchema = {
  id: { type: "Integer", comment: "关联id", required: true },
  create_at: { type: "Date", comment: "创建时间", required: false },
  update_at: { type: "Date", comment: "更新时间", required: false },
  user_id: { type: "Integer", comment: "邀请者用户id", required: true },
  user_type: { type: "Integer", comment: "", required: true },
  friend_user_id: { type: "Integer", comment: "好友用户id", required: true },
  friend_user_type: { type: "Integer", comment: "", required: true },
  type: { type: "Integer", comment: "1:邀请方,2:被邀请方", required: true },
} as const;
/** undefined Keys */
export const userInviteKeys = {
  id: "id",
  createAt: "create_at",
  updateAt: "update_at",
  userId: "user_id",
  userType: "user_type",
  friendUserId: "friend_user_id",
  friendUserType: "friend_user_type",
  type: "type",
} as const;
/** undefined Fields */
export const userInviteFields = [
  "id",
  "create_at",
  "update_at",
  "user_id",
  "user_type",
  "friend_user_id",
  "friend_user_type",
  "type",
] as const;
/** undefined Table */
export const userInviteTable = "user_invite";
/**  undefined PRI */
export const userInvitePRI = "id";

/** undefined */
export interface IModelsUserRelation {
  /** 关联id */
  id: number;
  /** 创建时间 */
  create_at: Date;
  /** 更新时间 */
  update_at: Date;
  /** 金管家用户id */
  apg_user_id?: number | null;
  /** 金管家用户open id */
  apg_open_id?: string | null;
  /** 微信用户id */
  wx_user_id?: number | null;
  /** 微信用户open id */
  wx_open_id?: string | null;
  /** 微信小程序用户id */
  wx_mini_user_id?: number | null;
  /** 微信小程序用户open id */
  wx_mini_open_id?: string | null;
}
/** undefined Schema */
export const userRelationSchema = {
  id: { type: "Integer", comment: "关联id", required: true },
  create_at: { type: "Date", comment: "创建时间", required: false },
  update_at: { type: "Date", comment: "更新时间", required: false },
  apg_user_id: { type: "NullableInteger", comment: "金管家用户id", required: false },
  apg_open_id: { type: "NullableString", comment: "金管家用户open id", required: false },
  wx_user_id: { type: "NullableInteger", comment: "微信用户id", required: false },
  wx_open_id: { type: "NullableString", comment: "微信用户open id", required: false },
  wx_mini_user_id: { type: "NullableInteger", comment: "微信小程序用户id", required: false },
  wx_mini_open_id: { type: "NullableString", comment: "微信小程序用户open id", required: false },
} as const;
/** undefined Keys */
export const userRelationKeys = {
  id: "id",
  createAt: "create_at",
  updateAt: "update_at",
  apgUserId: "apg_user_id",
  apgOpenId: "apg_open_id",
  wxUserId: "wx_user_id",
  wxOpenId: "wx_open_id",
  wxMiniUserId: "wx_mini_user_id",
  wxMiniOpenId: "wx_mini_open_id",
} as const;
/** undefined Fields */
export const userRelationFields = [
  "id",
  "create_at",
  "update_at",
  "apg_user_id",
  "apg_open_id",
  "wx_user_id",
  "wx_open_id",
  "wx_mini_user_id",
  "wx_mini_open_id",
] as const;
/** undefined Table */
export const userRelationTable = "user_relation";
/**  undefined PRI */
export const userRelationPRI = "id";

/** undefined */
export interface IModelsWxMiniUser {
  /** 微信小程序用户id */
  id: number;
  /** 创建时间 */
  create_at: Date;
  /** 更新时间 */
  update_at: Date;
  open_id: string;
  union_id: string;
  /** 昵称 */
  nickname?: string | null;
  /** 头像 */
  avatar?: string | null;
  /** 性别,0:未知,1:男性,2:女性 */
  gender?: number | null;
  /** 国家 */
  city?: string | null;
  /** 省份 */
  province?: string | null;
  /** 国家 */
  country?: string | null;
  /** 用户绑定的手机号（国外手机号会有区号） */
  phone?: string | null;
  /** 没有区号的手机号 */
  pure_phone?: string | null;
  /** 区号 */
  country_code?: string | null;
  /** 最后登录时间 */
  last_login_at: Date;
}
/** undefined Schema */
export const wxMiniUserSchema = {
  id: { type: "Integer", comment: "微信小程序用户id", required: true },
  create_at: { type: "Date", comment: "创建时间", required: false },
  update_at: { type: "Date", comment: "更新时间", required: false },
  open_id: { type: "String", comment: "", required: true },
  union_id: { type: "String", comment: "", required: false },
  nickname: { type: "NullableString", comment: "昵称", required: false },
  avatar: { type: "NullableString", comment: "头像", required: false },
  gender: { type: "NullableInteger", comment: "性别,0:未知,1:男性,2:女性", required: false },
  city: { type: "NullableString", comment: "国家", required: false },
  province: { type: "NullableString", comment: "省份", required: false },
  country: { type: "NullableString", comment: "国家", required: false },
  phone: { type: "NullableString", comment: "用户绑定的手机号（国外手机号会有区号）", required: false },
  pure_phone: { type: "NullableString", comment: "没有区号的手机号", required: false },
  country_code: { type: "NullableString", comment: "区号", required: false },
  last_login_at: { type: "Date", comment: "最后登录时间", required: false },
} as const;
/** undefined Keys */
export const wxMiniUserKeys = {
  id: "id",
  createAt: "create_at",
  updateAt: "update_at",
  openId: "open_id",
  unionId: "union_id",
  nickname: "nickname",
  avatar: "avatar",
  gender: "gender",
  city: "city",
  province: "province",
  country: "country",
  phone: "phone",
  purePhone: "pure_phone",
  countryCode: "country_code",
  lastLoginAt: "last_login_at",
} as const;
/** undefined Fields */
export const wxMiniUserFields = [
  "id",
  "create_at",
  "update_at",
  "open_id",
  "union_id",
  "nickname",
  "avatar",
  "gender",
  "city",
  "province",
  "country",
  "phone",
  "pure_phone",
  "country_code",
  "last_login_at",
] as const;
/** undefined Table */
export const wxMiniUserTable = "wx_mini_user";
/**  undefined PRI */
export const wxMiniUserPRI = "id";

/** undefined */
export interface IModelsWxUser {
  /** 微信用户id */
  id: number;
  /** 创建时间 */
  create_at: Date;
  /** 更新时间 */
  update_at: Date;
  open_id: string;
  union_id: string;
  /** 昵称 */
  nickname?: string | null;
  /** 头像 */
  avatar?: string | null;
  /** 性别,0:未知,1:男,2:女 */
  sex?: string | null;
  /** 城市 */
  city?: string | null;
  /** 省份 */
  province?: string | null;
  /** 国家 */
  country?: string | null;
  /** 语言 */
  language?: string | null;
  /** 特权 */
  privilege?: string | null;
  /** 最后登录时间 */
  last_login_at: Date;
}
/** undefined Schema */
export const wxUserSchema = {
  id: { type: "Integer", comment: "微信用户id", required: true },
  create_at: { type: "Date", comment: "创建时间", required: false },
  update_at: { type: "Date", comment: "更新时间", required: false },
  open_id: { type: "String", comment: "", required: true },
  union_id: { type: "String", comment: "", required: false },
  nickname: { type: "NullableString", comment: "昵称", required: false },
  avatar: { type: "NullableString", comment: "头像", required: false },
  sex: { type: "NullableString", comment: "性别,0:未知,1:男,2:女", required: false },
  city: { type: "NullableString", comment: "城市", required: false },
  province: { type: "NullableString", comment: "省份", required: false },
  country: { type: "NullableString", comment: "国家", required: false },
  language: { type: "NullableString", comment: "语言", required: false },
  privilege: { type: "NullableString", comment: "特权", required: false },
  last_login_at: { type: "Date", comment: "最后登录时间", required: false },
} as const;
/** undefined Keys */
export const wxUserKeys = {
  id: "id",
  createAt: "create_at",
  updateAt: "update_at",
  openId: "open_id",
  unionId: "union_id",
  nickname: "nickname",
  avatar: "avatar",
  sex: "sex",
  city: "city",
  province: "province",
  country: "country",
  language: "language",
  privilege: "privilege",
  lastLoginAt: "last_login_at",
} as const;
/** undefined Fields */
export const wxUserFields = [
  "id",
  "create_at",
  "update_at",
  "open_id",
  "union_id",
  "nickname",
  "avatar",
  "sex",
  "city",
  "province",
  "country",
  "language",
  "privilege",
  "last_login_at",
] as const;
/** undefined Table */
export const wxUserTable = "wx_user";
/**  undefined PRI */
export const wxUserPRI = "id";

export const ModelNames = [
  "apgAgent",
  "apgUser",
  "apgUserAgentRelation",
  "userInvite",
  "userRelation",
  "wxMiniUser",
  "wxUser",
];
export type ModelName =
  | "apgAgentModel"
  | "apgUserModel"
  | "apgUserAgentRelationModel"
  | "userInviteModel"
  | "userRelationModel"
  | "wxMiniUserModel"
  | "wxUserModel";
