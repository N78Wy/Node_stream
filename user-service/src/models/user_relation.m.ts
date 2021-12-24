/**
 * @file userRelation Model undefined
 * @author Yourtion Guo <yourtion@gmail.com>
 */

import { IModelsUserRelation, userRelationTable, userRelationFields, userRelationPRI } from "../global/gen/models.gen";
import Base, { IBaseOptions } from "./base";
import { Context } from "../web";
import { config, pkg } from "../global";

export class UserRelationModel extends Base<IModelsUserRelation, typeof userRelationTable> {
  constructor(ctx: Context, options?: Partial<Omit<IBaseOptions<IModelsUserRelation, string>, "tableWithoutPrefix">>) {
    const prefix = config.orm?.tablePrefix || `${pkg.shortName}_`;
    Object.assign(options, {
      table: `${prefix}${userRelationTable}`,
      tableWithoutPrefix: userRelationTable,
      fields: userRelationFields,
      primaryKey: userRelationPRI,
    });
    super(ctx, options as any);
  }
}
