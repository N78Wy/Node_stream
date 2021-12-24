import { Dingding } from "@gz/dingding";
import { logger, pkg } from "../global";

const projectName = pkg.name;
const dingding = new Dingding();
const slowNotifyGap = 2 * 60 * 1000;
let lastSlowNotifyTime = new Date().getTime() - slowNotifyGap;

export function notifySlowSql(sql: string, spent: number) {
  const nowTime = Date.now();
  if (nowTime - lastSlowNotifyTime > slowNotifyGap) {
    lastSlowNotifyTime = nowTime;
    const content = [
      `警报:慢查询！！！`,
      `项目名:${projectName}`,
      ,
      `开发环境: ${process.env.NODE_ENV || "dev"}`,
      `开发人员: ${pkg.username}`,
      `查询时间:${spent}ms`,
      `查询语句:${sql}`,
    ].join("\n");

    return dingding
      .notify({
        msgtype: "text",
        text: { content },
      })
      .catch((err) => {
        logger.error("钉钉通知失败", err);
      });
  }
}
