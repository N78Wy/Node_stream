import { Etcd3 } from "etcd3";

const { ETCD_HOST: host, ETCD_USERNAME: username, ETCD_PASSWORD: password } = process.env;

export const etcd = new Etcd3({
  hosts: host || "http://127.0.0.1:2379",
  auth: username
    ? {
        username: username,
        password: password || "",
      }
    : undefined,
});
