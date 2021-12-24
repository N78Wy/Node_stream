/**
 * @file wxUser Model undefined
 * @author Yourtion Guo <yourtion@gmail.com>
 */

import { IModelsWxUser, wxUserTable, wxUserFields, wxUserPRI } from "../global/gen/models.gen";
import Base, { IBaseOptions } from "./base";
import { Context } from "../web";
import { config, pkg } from "../global";

export class WxUserModel extends Base<IModelsWxUser, typeof wxUserTable> {
  constructor(ctx: Context, options?: Partial<Omit<IBaseOptions<IModelsWxUser, string>, "tableWithoutPrefix">>) {
    const prefix = config.orm?.tablePrefix || `${pkg.shortName}_`;
    Object.assign(options, {
      table: `${prefix}${wxUserTable}`,
      tableWithoutPrefix: wxUserTable,
      fields: wxUserFields,
      primaryKey: wxUserPRI,
    });
    super(ctx, options as any);
  }
}
