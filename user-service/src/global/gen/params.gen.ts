/** 清除自身数据 参数 */
export interface IParamsGetBackUserClearSelf {}

/** 清除数据 参数 */
export interface IParamsGetBackUserClear {
  /** open id */
  open_id?: string;
  /** 用户id */
  user_id?: number;
}

/** 清除全部用户数据 参数 */
export interface IParamsGetBackUserClearAll {}

/** 设置我的代理人信息 参数 */
export interface IParamsGetBackUserApgSetAgent {
  /** 用户id */
  user_id?: number;
  /** open id, user_id和open_id 二选一即可 */
  open_id?: string;
  /** 代理人open id */
  agent_open_id?: string;
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

/** 邀请新用户 参数 */
export interface IParamsGetBackUserInvite {
  /** 用户id */
  user_id?: number;
  /** open id, user_id和open_id 二选一即可 */
  open_id?: string;
  /** 要邀请的用户类型, 1: 金管家, 2: 微信, 3: 微信小程序, 用户类型默认为邀请者的类型 */
  invite_user_type?: number;
  /** 要邀请几个用户 */
  invite_num?: number;
}

/** 修改用户数据 参数 */
export interface IParamsGetBackUserSetData {
  /** 用户id */
  user_id?: number;
  /** open id, user_id和open_id 二选一即可 */
  open_id?: string;
  /** 创建时间 */
  create_at?: Date;
  /** 更新时间 */
  update_at?: Date;
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

/** 测试Index 参数 */
export interface IParamsGetBackIndex {}

/** 获取json形式文档 参数 */
export interface IParamsGetDocsJson {}

/** 获取swagger形式文档 参数 */
export interface IParamsGetDocsSwagger {}

/** 获取sdk 参数 */
export interface IParamsGetDocsSdk {}

/** 登录 参数 */
export interface IParamsPostUserApgIopLogin {
  /** open id */
  open_id?: string;
  /** open token */
  open_token?: string;
  /**  iop open id */
  iop_open_id: string;
  /**  iop open token */
  iop_open_token: string;
  /** 邀请人用户id,有邀请机制的活动才需要带此项 */
  inviter_user_id?: number;
}

/** 获取用户信息 参数 */
export interface IParamsGetUserApgIopInfo {
  /** 权限校验,格式 Bearer ${token} */
  authorization?: string;
}

/** 金管家小程序登录 参数 */
export interface IParamsPostUserApgIopMiniLogin {
  /** code,小程序环境中才需要传 */
  code?: string;
  /** 金管家iop open id */
  open_id: string;
  /** 金管家iop open token */
  open_token: string;
}

/** 获取我的代理人信息 参数 */
export interface IParamsGetUserApgIopAgentInfo {
  /** open token */
  open_token: string;
  /** true:获取活动的代理人,false:获取金管家app的代理人,默认为true */
  is_sign_up_agent?: boolean;
}

/** 登录 参数 */
export interface IParamsPostUserApgLogin {
  /** open id */
  open_id: string;
  /** open token */
  open_token: string;
  /**  iop open token,有获取用户等级的需要传 */
  iop_open_token?: string;
  /**  iop open id,有获取用户等级的需要传 */
  iop_open_id?: string;
  /** 邀请人用户id,有邀请机制的活动才需要带此项 */
  inviter_user_id?: number;
}

/** 获取用户信息 参数 */
export interface IParamsGetUserApgInfo {
  /** 权限校验,格式 Bearer ${token} */
  authorization?: string;
}

/** 金管家小程序登录 参数 */
export interface IParamsPostUserApgMiniLogin {
  /** code,小程序环境中才需要传 */
  code?: string;
  /** 金管家open id */
  open_id: string;
  /** 金管家open token */
  open_token: string;
}

/** 获取我的代理人信息 参数 */
export interface IParamsGetUserApgAgentInfo {
  /** open token */
  open_token: string;
  /** true:获取活动的代理人,false:获取金管家app的代理人,默认为true */
  is_sign_up_agent?: boolean;
}

/** 登录 参数 */
export interface IParamsPostUserWxMiniLogin {
  /** code */
  code: string;
}

/** 获取用户信息 参数 */
export interface IParamsGetUserWxMiniInfo {
  /** 权限校验,格式 Bearer ${token} */
  authorization?: string;
}

/** 授权 参数 */
export interface IParamsPostUserWxMiniGrant {
  /** 加密数据 */
  encryptedData: string;
  /** iv */
  iv: string;
}

/** 绑定手机号 参数 */
export interface IParamsPostUserWxMiniBindPhone {
  /** 加密数据 */
  encryptedData: string;
  /** iv */
  iv: string;
}

/** 微信授权，获取微信用户信息授权地址 参数 */
export interface IParamsGetUserWxRabbitpreUrl {
  /** 跳转地址 */
  redirect_url: string;
  /** 隐式授权填:snsapi_base, 显示授权填:snsapi_userinfo, 默认为 snsapi_userinfo */
  scope?: string;
}

/** 微信授权，使用授权token获取用户信息 参数 */
export interface IParamsGetUserWxRabbitpreInfo {
  /** 授权后获取的token */
  token: string;
}

/** 隐式授权 参数 */
export interface IParamsPostUserWxBaseAuth {
  /** 微信授权后跳转携带的code */
  code: string;
}

/** 显式授权 参数 */
export interface IParamsPostUserWxGrant {
  /** 微信授权后跳转携带的code */
  code: string;
}

/** 获取用户信息 参数 */
export interface IParamsGetUserWxInfo {
  /** 权限校验,格式 Bearer ${token} */
  authorization?: string;
}

/** 测试Index 参数 */
export interface IParamsGetUtilsIndex {}
