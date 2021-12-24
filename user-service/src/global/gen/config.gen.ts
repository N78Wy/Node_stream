export interface IConfigApp {
  host: string;
  /**
   * 服务监听端口
   */
  port: number;
}

export interface IConfigLogger {
  /**
   * 日志等级
   */
  level: string;
  /**
   * 是否打印格式后的日志
   */
  prettyPrint: boolean;
  /**
   * 可选值: file,console, file输出至文件,console输出至控制台
   */
  out: string;
}

export interface IConfigOrm {
  /**
   * 自定义表前缀,不填默认为项目短名加下划线
   */
  tablePrefix: string;
  /**
   * 打印慢日志
   */
  logSlowQuery: number;
  prepareStatement: boolean;
}

export interface IConfigSession {
  secret: string;
}

export interface IConfigCookie {
  maxAge: number;
}

export interface IConfigSqlGuardium {
  /**
   * 是否启用sql分析,开启后运行单元测试会输出执行过的sql分析情况
   */
  enable: boolean;
}

export interface IConfigDiscover {
  /**
   * 是否注册服务信息到配置中心
   */
  register: boolean;
  /**
   * 负载权重
   */
  weight: number;
}

export interface IConfigRedis {
  host: string;
  port: number;
  db: number;
  /**
   * 自定义redis key前缀,不填或为空时默认为项目短名
   */
  keyPrefix: string;
}

export interface IConfigMysqlDataSourcesDefault {
  host: string;
  user: string;
  password: string;
  database: string;
  timezone: string;
}

export interface IConfigMysqlDataSources {
  default: IConfigMysqlDataSourcesDefault;
}

export interface IConfigMysql {
  dataSources: IConfigMysqlDataSources;
}

export interface IConfigSign {
  enable: boolean;
  /**
   * 密钥
   */
  secret: string;
  /**
   * 二重密钥
   */
  confuseSecret: string;
  disableUrls: any[];
}

export interface IConfigApg {
  clientId: string;
  clientSecret: string;
  merchantCode: string;
  activityId: string;
  iopMerchantCode: string;
  env: string;
}

export interface IConfigWxOpenPlatform1 {
  host: string;
}

export interface IConfigWxOpenPlatform {
  /**
   * 开放平台配置相关配置
   */
  1: IConfigWxOpenPlatform1;
}

export interface IConfigWxRabbitpre {
  /**
   * 公众号应用id
   */
  host: string;
  /**
   * totp密钥
   */
  wsId: string;
  secret: string;
  templateId: string;
  mock: boolean;
}

export interface IConfigWx {
  openPlatform: number;
  appId: string;
  mock: boolean;
  /**
   * 深圳微信授权相关配置
   */
  rabbitpre: IConfigWxRabbitpre;
}

export interface IConfigWxMini {
  appId: string;
  appSecret: string;
  mock: boolean;
}

export interface IConfigUserApgRegion01 {
  name: string;
}

export interface IConfigUserApgRegion {
  /**
   * 代理人信息额外拓展表,根据机构编码对应<br/>
   * 用 _ 开头是防止数字key被转成其他进制
   */
  _01: IConfigUserApgRegion01;
}

export interface IConfigUserApg {
  /**
   * 是否额外返回另外的信息<br/>
   * 如果有isAgent，就会把该用户是不是代理人返回给前端，并落库<br/>
   * 如果有level, 就会获取该用户的vip等级, 返回给前端并把信息落库
   */
  extReturn: string[];
  /**
   * true:获取活动的代理人,false:获取金管家app的代理人
   */
  isSignUpAgent: boolean;
  /**
   * 如果获取不到代理人,是否自动尝试获取另一个维度的代理人<br/>
   * 比如 isSignUpAgent 配置了 true,然后接口获取不到时,会自动再去获取一遍app的代理人<br/>
   * 比如 isSignUpAgent 配置了 false,然后接口获取不到时,会自动再去获取一遍活动的代理人<br/>
   * 获取不到指的是金管家返回空对象或不返回
   */
  retryIfAgentNotExists: boolean;
  /**
   * 验证是否为代理人的活动id,不传默认使用apg的活动id
   */
  isAgentActivityId: string;
  /**
   * 获取代理人信息要传的活动id,不传默认使用apg的活动id
   */
  agentInfoActivityId: string;
  /**
   * 只有新用户才查询用户信息,默认true
   */
  getUserInfoOnlyNewUser: boolean;
  /**
   * 获取用户等级调优选项<br/>
   * 是否只有新用户才会去查询等级,默认false
   */
  getUserLevelOnlyNewUser: boolean;
  /**
   * 没有等级的情况是否去查询等级,默认true
   */
  getUserLevelIfNotLevel: boolean;
  /**
   * 有等级的情况是否去查询等级,默认true
   */
  getUserLevelIfHasLevel: boolean;
  /**
   * 获取用户等级接口报错时是否抛错,默认true
   */
  throwGetUserLevelError: boolean;
  /**
   * 获取代理人信息接口调优相关选项<br/>
   * 是否只有新用户才会去查询对应的代理人信息,默认false
   */
  getAgentInfoOnlyNewUser: boolean;
  /**
   * 没有代理人的情况是否查询代理人信息,默认true
   */
  getAgentInfoIfNotAgent: boolean;
  /**
   * 有代理人的情况是否查询代理人信息,默认true
   */
  getAgentInfoIfHasAgent: boolean;
  /**
   * 获取代理人信息接口报错时是否抛错,默认true
   */
  throwGetAgentInfoError: boolean;
  /**
   * 验证是否为代理人接口调优相关选项<br/>
   * 是否只有新用户才去查询是否为代理人,默认false
   */
  validateIsAgentOnlyNewUser: boolean;
  /**
   * 不是代理人的情况查询是不是代理人,默认true
   */
  validateIsAgentIfNotAgent: boolean;
  /**
   * 是代理人的情况查询是不是代理人,默认true
   */
  validateIsAgentIfIsAgent: boolean;
  /**
   * 验证是否为代理人的时候,如果是epass用户则认为不是代理人,默认true
   */
  validateIsAgentExcludeEpass: boolean;
  /**
   * 验证是否为代理人接口报错时是否抛错,默认true
   */
  throwValidateIsAgentError: boolean;
  /**
   * 金管家新开放平台接口报未授权时自动回退至旧平台,默认false
   */
  rollbackOnIopAuthError: boolean;
  /**
   * 使用金管家新开放平台的接口有没有涉及敏感数据的获取,有的话要设置为true
   */
  iopWithCredentails: boolean;
  region: IConfigUserApgRegion;
}

export interface IConfigUser {
  /**
   * 是否需要关联用户
   */
  needRelation: boolean;
  /**
   * 金管家用户id起始值
   */
  apgUserStartId: number;
  /**
   * 微信用户id起始值
   */
  wxUserStartId: number;
  /**
   * 微信小程序用户id起始值
   */
  wxMiniUserStartId: number;
  apg: IConfigUserApg;
}

export interface IConfig {
  [key: string]: any;
  env: string;
  ispro: boolean;
  /**
   * 本地开发与单元测试配置
   */
  app: IConfigApp;
  logger: IConfigLogger;
  orm: IConfigOrm;
  session: IConfigSession;
  cookie: IConfigCookie;
  /**
   * sql分析器
   */
  sqlGuardium: IConfigSqlGuardium;
  discover: IConfigDiscover;
  redis: IConfigRedis;
  mysql: IConfigMysql;
  sign: IConfigSign;
  apg: IConfigApg;
  wxOpenPlatform: IConfigWxOpenPlatform;
  /**
   * 开放平台微信授权相关配置
   */
  wx: IConfigWx;
  wxMini: IConfigWxMini;
  user: IConfigUser;
}
