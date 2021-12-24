export const TYPES = {
  /** 布尔值 */
  Boolean: "Boolean",
  /** 日期(2017-05-01) */
  Date: "Date",
  /** 字符串 */
  String: "String",
  /** 自动去首尾空格的字符串 */
  TrimString: "TrimString",
  /** 不能为空字符串的字符串 */
  NotEmptyString: "NotEmptyString",
  /** 数值 */
  Number: "Number",
  /** 整数 */
  Integer: "Integer",
  /** 浮点数 */
  Float: "Float",
  /** 对象 */
  Object: "Object",
  /** 数组 */
  Array: "Array",
  /** 来源于JSON字符串的对象 */
  JSON: "JSON",
  /** JSON字符串 */
  JSONString: "JSONString",
  /** 任意类型 */
  Any: "Any",
  /** MongoDB ObjectId 字符串 */
  MongoIdString: "MongoIdString",
  /** 邮箱地址 */
  Email: "Email",
  /** 域名（比如：domain.com） */
  Domain: "Domain",
  /** 字母字符串（a-zA-Z） */
  Alpha: "Alpha",
  /** 字母和数字字符串（a-zA-Z0-9） */
  AlphaNumeric: "AlphaNumeric",
  /** ASCII字符串 */
  Ascii: "Ascii",
  /** base64字符串 */
  Base64: "Base64",
  /** URL字符串 */
  URL: "URL",
  /** 枚举类型 */
  ENUM: "ENUM",
  /** 逗号分隔的Int数组 */
  IntArray: "IntArray",
  /** 逗号分隔的字符串数组 */
  StringArray: "StringArray",
  /** 可为null字符串 */
  NullableString: "NullableString",
  /** 可为null整数 */
  NullableInteger: "NullableInteger",
} as const;

export const SCHEMAS = {
  /**
   * ApgUser
   * @param id 金管家用户id (Integer)
   * @param create_at 创建时间 (Date)
   * @param update_at 更新时间 (Date)
   * @param open_id  (String)
   * @param nickname 昵称 (NullableString)
   * @param avatar 头像 (NullableString)
   * @param is_agent 是否是代理人 (NullableInteger)
   * @param is_freshman 意义未知,只知道 is_freshman = false && is_agent = 1 的情况下才是真正的代理人,前端判断的时候看is_agent是否等于1就行了, 不用理会该字段 (NullableString)
   * @param agent_type 查询代理人信息返回的 (NullableString)
   * @param level 用户vip等级 (NullableString)
   * @param last_login_at 最后登录时间 (Date)
   */
  ApgUser: "ApgUser",
  ApgUserArray: "ApgUser[]",
  /**
   * ApgAgentInfo
   * @param open_id  (NullableString)
   * @param mobile 手机号码,带*的 (NullableString)
   * @param nickname 姓名 (NullableString)
   * @param avatar 头像 (NullableString)
   * @param avatar_type 头像类型(00系统、01自定义、02上传至七牛的自定义头像） (NullableString)
   * @param mark_agent_no 业务员号,带*的 (NullableString)
   * @param institution 所属二级机构 (NullableString)
   * @param region_code 所属二级机构编码 (NullableString)
   * @param card_url 封面 (NullableString)
   * @param ext 拓展信息 (Object)
   * @param is_exists 是否有代理人 (Boolean)
   */
  ApgAgentInfo: "ApgAgentInfo",
  ApgAgentInfoArray: "ApgAgentInfo[]",
  /**
   * ApgMiniApgUser
   * @param is_new_user 是否是新用户 (Boolean)
   * @param last_login_at 最后登录时间 (Date)
   * @param is_today_first_login 是否是今天第一次登录 (Boolean)
   * @param id 金管家用户id (Integer)
   * @param create_at 创建时间 (Date)
   * @param update_at 更新时间 (Date)
   * @param open_id  (String)
   * @param nickname 昵称 (NullableString)
   * @param avatar 头像 (NullableString)
   * @param is_agent 是否是代理人 (NullableInteger)
   * @param is_freshman 意义未知,只知道 is_freshman = false && is_agent = 1 的情况下才是真正的代理人,前端判断的时候看is_agent是否等于1就行了, 不用理会该字段 (NullableString)
   * @param agent_type 查询代理人信息返回的 (NullableString)
   * @param level 用户vip等级 (NullableString)
   * @param agent_info 代理人信息 (ApgAgentInfo)
   */
  ApgMiniApgUser: "ApgMiniApgUser",
  ApgMiniApgUserArray: "ApgMiniApgUser[]",
  /**
   * ApgMiniWxUser
   * @param is_new_user 是否是新用户 (Boolean)
   * @param last_login_at 最后登录时间 (Date)
   * @param is_today_first_login 是否是今天第一次登录 (Boolean)
   * @param id 微信小程序用户id (Integer)
   * @param create_at 创建时间 (Date)
   * @param update_at 更新时间 (Date)
   * @param open_id  (String)
   * @param union_id  (String)
   * @param nickname 昵称 (NullableString)
   * @param avatar 头像 (NullableString)
   * @param gender 性别,0:未知,1:男性,2:女性 (NullableInteger)
   * @param city 国家 (NullableString)
   * @param province 省份 (NullableString)
   * @param country 国家 (NullableString)
   * @param phone 用户绑定的手机号（国外手机号会有区号） (NullableString)
   * @param pure_phone 没有区号的手机号 (NullableString)
   * @param country_code 区号 (NullableString)
   */
  ApgMiniWxUser: "ApgMiniWxUser",
  ApgMiniWxUserArray: "ApgMiniWxUser[]",
  /**
   * WxMiniUser
   * @param id 微信小程序用户id (Integer)
   * @param create_at 创建时间 (Date)
   * @param update_at 更新时间 (Date)
   * @param open_id  (String)
   * @param union_id  (String)
   * @param nickname 昵称 (NullableString)
   * @param avatar 头像 (NullableString)
   * @param gender 性别,0:未知,1:男性,2:女性 (NullableInteger)
   * @param city 国家 (NullableString)
   * @param province 省份 (NullableString)
   * @param country 国家 (NullableString)
   * @param phone 用户绑定的手机号（国外手机号会有区号） (NullableString)
   * @param pure_phone 没有区号的手机号 (NullableString)
   * @param country_code 区号 (NullableString)
   * @param last_login_at 最后登录时间 (Date)
   */
  WxMiniUser: "WxMiniUser",
  WxMiniUserArray: "WxMiniUser[]",
} as const;
