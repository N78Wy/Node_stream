export interface ISchemaApgUser {
  /** 金管家用户id */
  id: number;
  /** 创建时间 */
  create_at?: Date;
  /** 更新时间 */
  update_at?: Date;
  /** open_id */
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
export interface ISchemaApgAgentInfo {
  /** open_id */
  open_id?: string | null;
  /** 手机号码,带*的 */
  mobile?: string | null;
  /** 姓名 */
  nickname?: string | null;
  /** 头像 */
  avatar?: string | null;
  /** 头像类型(00系统、01自定义、02上传至七牛的自定义头像） */
  avatar_type?: string | null;
  /** 业务员号,带*的 */
  mark_agent_no?: string | null;
  /** 所属二级机构 */
  institution?: string | null;
  /** 所属二级机构编码 */
  region_code?: string | null;
  /** 封面 */
  card_url?: string | null;
  /** 拓展信息 */
  ext?: Record<string, any>;
  /** 是否有代理人 */
  is_exists: boolean;
}
export interface ISchemaApgMiniApgUser {
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
  /** open_id */
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
  /** 代理人信息 */
  agent_info?: ISchemaApgAgentInfo;
}
export interface ISchemaApgMiniWxUser {
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
  /** open_id */
  open_id: string;
  /** union_id */
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
export interface ISchemaWxMiniUser {
  /** 微信小程序用户id */
  id: number;
  /** 创建时间 */
  create_at?: Date;
  /** 更新时间 */
  update_at?: Date;
  /** open_id */
  open_id: string;
  /** union_id */
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
