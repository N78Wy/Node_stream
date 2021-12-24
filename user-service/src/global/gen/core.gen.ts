import { CoreGen } from "../../core";
import { ModelEnhancer } from "../../models/enhancer";
import {
  ApgAgentModel,
  ApgUserModel,
  ApgUserAgentRelationModel,
  UserInviteModel,
  UserRelationModel,
  WxMiniUserModel,
  WxUserModel,
} from "../../models";

import {
  BackUserService,
  UserApgService,
  UserWxMiniService,
  UserWxRabbitpreService,
  UserWxService,
  UserService,
} from "../../services";

const BACKUSERSERVICE_M_SYM = Symbol("BACKUSERSERVICE");
const USERAPGSERVICE_M_SYM = Symbol("USERAPGSERVICE");
const USERWXMINISERVICE_M_SYM = Symbol("USERWXMINISERVICE");
const USERWXRABBITPRESERVICE_M_SYM = Symbol("USERWXRABBITPRESERVICE");
const USERWXSERVICE_M_SYM = Symbol("USERWXSERVICE");
const USERSERVICE_M_SYM = Symbol("USERSERVICE");
export class Service extends CoreGen<any> {
  get backUser() {
    return this.getCache(BACKUSERSERVICE_M_SYM, BackUserService);
  }
  get userApg() {
    return this.getCache(USERAPGSERVICE_M_SYM, UserApgService);
  }
  get userWxMini() {
    return this.getCache(USERWXMINISERVICE_M_SYM, UserWxMiniService);
  }
  get userWxRabbitpre() {
    return this.getCache(USERWXRABBITPRESERVICE_M_SYM, UserWxRabbitpreService);
  }
  get userWx() {
    return this.getCache(USERWXSERVICE_M_SYM, UserWxService);
  }
  get user() {
    return this.getCache(USERSERVICE_M_SYM, UserService);
  }
}
const APGAGENT_M_SYM = Symbol("APGAGENT");
const APGUSER_M_SYM = Symbol("APGUSER");
const APGUSERAGENTRELATION_M_SYM = Symbol("APGUSERAGENTRELATION");
const USERINVITE_M_SYM = Symbol("USERINVITE");
const USERRELATION_M_SYM = Symbol("USERRELATION");
const WXMINIUSER_M_SYM = Symbol("WXMINIUSER");
const WXUSER_M_SYM = Symbol("WXUSER");
export class Model extends ModelEnhancer {
  /** undefined */
  get apgAgent() {
    return this.getCache(APGAGENT_M_SYM, ApgAgentModel);
  }

  /** undefined */
  get apgUser() {
    return this.getCache(APGUSER_M_SYM, ApgUserModel);
  }

  /** undefined */
  get apgUserAgentRelation() {
    return this.getCache(APGUSERAGENTRELATION_M_SYM, ApgUserAgentRelationModel);
  }

  /** undefined */
  get userInvite() {
    return this.getCache(USERINVITE_M_SYM, UserInviteModel);
  }

  /** undefined */
  get userRelation() {
    return this.getCache(USERRELATION_M_SYM, UserRelationModel);
  }

  /** undefined */
  get wxMiniUser() {
    return this.getCache(WXMINIUSER_M_SYM, WxMiniUserModel);
  }

  /** undefined */
  get wxUser() {
    return this.getCache(WXUSER_M_SYM, WxUserModel);
  }
}
