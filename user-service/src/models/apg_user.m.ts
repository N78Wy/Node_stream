/**
 * @file apgUser Model undefined
 * @author Yourtion Guo <yourtion@gmail.com>
 */

import { IModelsApgUser, apgUserTable, apgUserFields, apgUserPRI } from "../global/gen/models.gen";
import Base, { IBaseOptions } from "./base";
import { Context } from "../web";
import { config, pkg } from "../global";

export class ApgUserModel extends Base<IModelsApgUser, typeof apgUserTable> {
  constructor(ctx: Context, options?: Partial<Omit<IBaseOptions<IModelsApgUser, string>, "tableWithoutPrefix">>) {
    const prefix = config.orm?.tablePrefix || `${pkg.shortName}_`;
    Object.assign(options, {
      table: `${prefix}${apgUserTable}`,
      tableWithoutPrefix: apgUserTable,
      fields: apgUserFields,
      primaryKey: apgUserPRI,
    });
    super(ctx, options as any);
  }
}
