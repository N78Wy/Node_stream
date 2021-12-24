import { apiService } from "../../api";

export function getTsType(type: string) {
  const realType = type.endsWith("[]") ? type.slice(0, -2) : type;
  let tsType = "any";
  if (apiService.schema.has(realType)) {
    tsType = `ISchema${realType}`;
  } else if (apiService.type.has(realType)) {
    tsType = apiService.type.get(realType).info.tsType || "any";
  }
  if (type.startsWith("ENUM")) {
    tsType = "any";
  }
  return `${tsType}${type.endsWith("[]") ? "[]" : ""}`;
}
