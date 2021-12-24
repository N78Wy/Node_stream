import { getShortName, parseDependency } from "./base/utils";
import child_process from "child_process";

const pjson: Record<string, any> = require("../../package.json");

export const pkg = {
  ...pjson,
  name: pjson.name.split("/")[1] || pjson.name,
  shortName: getShortName(pjson.name),
  username: (typeof pjson.author === "string" ? pjson.author : pjson.author.name).split(" ")[0],
} as {
  name: string;
  author: string | { name: string; email: string };
  shortName: string;
  username: string;
  frameworks: Array<{ raw: string; name: string; scope: string; version: string }>;
  dependencies: Record<string, string>;
};

pkg.frameworks = pjson.frameworks
  ? (pjson.frameworks as string[]).map((f) => {
      const dependency = parseDependency(f);
      if (!dependency.version) {
        console.log(`package.json中的frameworks ${f} 没有指定版本,请指定版本后再重新执行 npm run code`);
        viewFrameworkVersions();
        process.exit(1);
      }
      return dependency;
    })
  : [];

export function mergePkg(p: any) {
  Object.assign(pkg, p);
}

export function viewFrameworkVersions(limit = 10, reverse = true) {
  const fVersions = new Array(limit).fill(null).map(() => ({})) as Array<Record<string, string>>;
  console.log(`查看所有服务${reverse ? "最新" : "最开始"}${limit}个版本`);
  for (const f of pjson.frameworks as string[]) {
    try {
      let versions = JSON.parse(
        child_process.execSync(`npm view ${f} versions --json`, { encoding: "utf8", stdio: "pipe" })
      ) as string[];
      if (reverse) {
        versions = versions.reverse();
      }
      versions = versions.slice(0, limit);

      for (let i = 0, len = versions.length; i < len; i++) {
        fVersions[i][f] = versions[i];
      }
    } catch (e) {
      fVersions[0][f] = "error";
    }
  }
  console.table(fVersions, pjson.frameworks);
}
