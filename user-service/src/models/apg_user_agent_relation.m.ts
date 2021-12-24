/**
 * @file apgUserAgentRelation Model undefined
 * @author Yourtion Guo <yourtion@gmail.com>
 */

import {
  IModelsApgUserAgentRelation,
  apgUserAgentRelationTable,
  apgUserAgentRelationFields,
  apgUserAgentRelationPRI,
} from "../global/gen/models.gen";
import Base, { IBaseOptions } from "./base";
import { Context } from "../web";
import { config, pkg } from "../global";

export class ApgUserAgentRelationModel extends Base<IModelsApgUserAgentRelation, typeof apgUserAgentRelationTable> {
  constructor(
    ctx: Context,
    options?: Partial<Omit<IBaseOptions<IModelsApgUserAgentRelation, string>, "tableWithoutPrefix">>
  ) {
    const prefix = config.orm?.tablePrefix || `${pkg.shortName}_`;
    Object.assign(options, {
      table: `${prefix}${apgUserAgentRelationTable}`,
      tableWithoutPrefix: apgUserAgentRelationTable,
      fields: apgUserAgentRelationFields,
      primaryKey: apgUserAgentRelationPRI,
    });
    super(ctx, options as any);
  }
}
