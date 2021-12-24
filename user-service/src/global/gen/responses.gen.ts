import { ISchemaApgMiniWxUser, ISchemaApgMiniApgUser, ISchemaApgAgentInfo } from "./schemas.gen";

/** 清除自身数据 参数 */
export type IResponseGetBackUserClearSelf = any;
/** 清除数据 参数 */
export type IResponseGetBackUserClear = any;
/** 清除全部用户数据 参数 */
export type IResponseGetBackUserClearAll = any;
/** 设置我的代理人信息 参数 */
export type IResponseGetBackUserApgSetAgent = any;
/** 邀请新用户 参数 */
export type IResponseGetBackUserInvite = any;
/** 修改用户数据 参数 */
export type IResponseGetBackUserSetData = any;
/** 测试Index 参数 */
export type IResponseGetBackIndex = any;
/** 获取json形式文档 参数 */
export type IResponseGetDocsJson = any;
/** 获取swagger形式文档 参数 */
export type IResponseGetDocsSwagger = any;
/** 获取sdk 参数 */
export type IResponseGetDocsSdk = any;
/** 登录 参数 */
export interface IResponsePostUserApgIopLogin {
  /** 是否是新用户 */
  is_new_user: boolean;
  /** 最后登录时间 */
  last_login_at?: Date;
  /** 是否是今天第一次登录 */
  is_today_first_login: boolean;
  /** 金管家用户id */
  id: number;
  /** 创建时间 */
  create_at?: Date;
  /** 更新时间 */
  update_at?: Date;
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
}

/** 获取用户信息 参数 */
export interface IResponseGetUserApgIopInfo {
  /** 金管家用户id */
  id: number;
  /** 创建时间 */
  create_at?: Date;
  /** 更新时间 */
  update_at?: Date;
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
  last_login_at?: Date;
}

/** 金管家小程序登录 参数 */
export interface IResponsePostUserApgIopMiniLogin {
  /** 微信小程序用户信息,传code才会返回该值 */
  wx_mini_user?: ISchemaApgMiniWxUser;
  /** 金管家用户信息 */
  apg_user: ISchemaApgMiniApgUser;
}

/** 获取我的代理人信息 参数 */
export interface IResponseGetUserApgIopAgentInfo {
  /** 代理人信息 */
  agent_info: ISchemaApgAgentInfo;
}

/** 登录 参数 */
export interface IResponsePostUserApgLogin {
  /** 是否是新用户 */
  is_new_user: boolean;
  /** 最后登录时间 */
  last_login_at?: Date;
  /** 是否是今天第一次登录 */
  is_today_first_login: boolean;
  /** 金管家用户id */
  id: number;
  /** 创建时间 */
  create_at?: Date;
  /** 更新时间 */
  update_at?: Date;
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
}

/** 获取用户信息 参数 */
export interface IResponseGetUserApgInfo {
  /** 金管家用户id */
  id: number;
  /** 创建时间 */
  create_at?: Date;
  /** 更新时间 */
  update_at?: Date;
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
  last_login_at?: Date;
}

/** 金管家小程序登录 参数 */
export interface IResponsePostUserApgMiniLogin {
  /** 微信小程序用户信息,传code才会返回该值 */
  wx_mini_user?: ISchemaApgMiniWxUser;
  /** 金管家用户信息 */
  apg_user: ISchemaApgMiniApgUser;
}

/** 获取我的代理人信息 参数 */
export interface IResponseGetUserApgAgentInfo {
  /** 代理人信息 */
  agent_info: ISchemaApgAgentInfo;
}

/** 登录 参数 */
export interface IResponsePostUserWxMiniLogin {
  /** 是否是新用户 */
  is_new_user: boolean;
  /** 最后登录时间 */
  last_login_at?: Date;
  /** 是否是今天第一次登录 */
  is_today_first_login: boolean;
  /** 微信小程序用户id */
  id: number;
  /** 创建时间 */
  create_at?: Date;
  /** 更新时间 */
  update_at?: Date;
  open_id: string;
  union_id?: string;
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
}

/** 获取用户信息 参数 */
export interface IResponseGetUserWxMiniInfo {
  /** 微信小程序用户id */
  id: number;
  /** 创建时间 */
  create_at?: Date;
  /** 更新时间 */
  update_at?: Date;
  open_id: string;
  union_id?: string;
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
  last_login_at?: Date;
}

/** 授权 参数 */
export interface IResponsePostUserWxMiniGrant {
  /** 微信小程序用户id */
  id: number;
  /** 创建时间 */
  create_at?: Date;
  /** 更新时间 */
  update_at?: Date;
  open_id: string;
  union_id?: string;
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
  last_login_at?: Date;
}

/** 绑定手机号 参数 */
export interface IResponsePostUserWxMiniBindPhone {
  /** 微信小程序用户id */
  id: number;
  /** 创建时间 */
  create_at?: Date;
  /** 更新时间 */
  update_at?: Date;
  open_id: string;
  union_id?: string;
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
  last_login_at?: Date;
}

/** 微信授权，获取微信用户信息授权地址 参数 */
export interface IResponseGetUserWxRabbitpreUrl {
  /** 授权地址 */
  auth_url: string;
}

/** 微信授权，使用授权token获取用户信息 参数 */
export interface IResponseGetUserWxRabbitpreInfo {
  /** 用户id */
  id: number;
  /** oepnid */
  openid: string;
  /** unionid */
  unionid?: string;
  /** nickname */
  nickname?: string;
  /** 头像地址 */
  avatar?: string;
  /** country */
  country?: string;
  /** province */
  province?: string;
  /** 城市 */
  city?: string;
}

/** 隐式授权 参数 */
export interface IResponsePostUserWxBaseAuth {
  /** 是否是新用户 */
  is_new_user: boolean;
  /** 最后登录时间 */
  last_login_at?: Date;
  /** 是否是今天第一次登录 */
  is_today_first_login: boolean;
  /** 微信用户id */
  id: number;
  /** 创建时间 */
  create_at?: Date;
  /** 更新时间 */
  update_at?: Date;
  open_id: string;
  union_id?: string;
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
}

/** 显式授权 参数 */
export interface IResponsePostUserWxGrant {
  /** 是否是新用户 */
  is_new_user: boolean;
  /** 最后登录时间 */
  last_login_at?: Date;
  /** 是否是今天第一次登录 */
  is_today_first_login: boolean;
  /** 微信用户id */
  id: number;
  /** 创建时间 */
  create_at?: Date;
  /** 更新时间 */
  update_at?: Date;
  open_id: string;
  union_id?: string;
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
}

/** 获取用户信息 参数 */
export interface IResponseGetUserWxInfo {
  /** 微信用户id */
  id: number;
  /** 创建时间 */
  create_at?: Date;
  /** 更新时间 */
  update_at?: Date;
  open_id: string;
  union_id?: string;
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
  last_login_at?: Date;
}

/** 测试Index 参数 */
export type IResponseGetUtilsIndex = any;
