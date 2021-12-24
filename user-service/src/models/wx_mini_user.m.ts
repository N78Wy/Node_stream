/**
 * @file wxMiniUser Model undefined
 * @author Yourtion Guo <yourtion@gmail.com>
 */

import { IModelsWxMiniUser, wxMiniUserTable, wxMiniUserFields, wxMiniUserPRI } from "../global/gen/models.gen";
import Base, { IBaseOptions } from "./base";
import { Context } from "../web";
import { config, pkg } from "../global";

export class WxMiniUserModel extends Base<IModelsWxMiniUser, typeof wxMiniUserTable> {
  constructor(ctx: Context, options?: Partial<Omit<IBaseOptions<IModelsWxMiniUser, string>, "tableWithoutPrefix">>) {
    const prefix = config.orm?.tablePrefix || `${pkg.shortName}_`;
    Object.assign(options, {
      table: `${prefix}${wxMiniUserTable}`,
      tableWithoutPrefix: wxMiniUserTable,
      fields: wxMiniUserFields,
      primaryKey: wxMiniUserPRI,
    });
    super(ctx, options as any);
  }
}
