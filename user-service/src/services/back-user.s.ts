import { BaseService } from "../core";

export class BackUserService extends BaseService {
  async clear(user_id: number) {
    const { model } = this.ctx;
    await model.beginTransaction("Clear");
    const where = {
      id: {
        $gt: 0,
      },
    };
    await Promise.all([
      model.apgUser.delete({
        where,
      }),
      model.wxUser.delete({
        where,
      }),
      model.wxMiniUser.delete({
        where,
      }),
    ]);
  }

  async clearAll() {
    const { model } = this.ctx;
    await model.beginTransaction("ClearAll");
    const where = {
      id: {
        $gt: 0,
      },
    };
    const limit = 1000000;
    await Promise.all([
      model.apgUser.delete({
        where,
        limit,
      }),
      model.wxUser.delete({
        where,
        limit,
      }),
      model.wxMiniUser.delete({
        where,
        limit,
      }),
    ]);
  }
}
