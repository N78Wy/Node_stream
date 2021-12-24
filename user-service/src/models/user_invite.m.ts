/**
 * @file userInvite Model undefined
 * @author Yourtion Guo <yourtion@gmail.com>
 */

import { IModelsUserInvite, userInviteTable, userInviteFields, userInvitePRI } from "../global/gen/models.gen";
import Base, { IBaseOptions } from "./base";
import { Context } from "../web";
import { config, pkg } from "../global";

export class UserInviteModel extends Base<IModelsUserInvite, typeof userInviteTable> {
  constructor(ctx: Context, options?: Partial<Omit<IBaseOptions<IModelsUserInvite, string>, "tableWithoutPrefix">>) {
    const prefix = config.orm?.tablePrefix || `${pkg.shortName}_`;
    Object.assign(options, {
      table: `${prefix}${userInviteTable}`,
      tableWithoutPrefix: userInviteTable,
      fields: userInviteFields,
      primaryKey: userInvitePRI,
    });
    super(ctx, options as any);
  }
}
