/**
 * @file apgAgent Model undefined
 * @author Yourtion Guo <yourtion@gmail.com>
 */

import { IModelsApgAgent, apgAgentTable, apgAgentFields, apgAgentPRI } from "../global/gen/models.gen";
import Base, { IBaseOptions } from "./base";
import { Context } from "../web";
import { config, pkg } from "../global";

export class ApgAgentModel extends Base<IModelsApgAgent, typeof apgAgentTable> {
  constructor(ctx: Context, options?: Partial<Omit<IBaseOptions<IModelsApgAgent, string>, "tableWithoutPrefix">>) {
    const prefix = config.orm?.tablePrefix || `${pkg.shortName}_`;
    Object.assign(options, {
      table: `${prefix}${apgAgentTable}`,
      tableWithoutPrefix: apgAgentTable,
      fields: apgAgentFields,
      primaryKey: apgAgentPRI,
    });
    super(ctx, options as any);
  }
}
