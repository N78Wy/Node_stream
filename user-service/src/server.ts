/**
 * @file 入口文件
 * @author Yourtion Guo <yourtion@gmail.com>
 */

import { AddressInfo } from "net";
import { app } from "./app";
import { config, configLoader, discover, isMasterInstance, logger, mysql, pkg, redis } from "./global";

process.on("uncaughtException", (err) => {
  logger.error({
    msg: "uncaughtException",
    err,
  });
});

process.on("unhandledRejection", (err) => {
  logger.error({
    msg: "unhandledRejection",
    err,
  });
});

app
  .start()
  .then(() => {
    app.listen(
      {
        port: +(config.app?.port || process.env.PORT || 0),
        host: config.app?.host || process.env.HOST || "127.0.0.1",
      },
      async () => {
        const address = app.server.address() as AddressInfo;
        if (isMasterInstance && config.discover?.register) {
          await discover.registerService({
            port: address.port,
            weight: config.discover?.weight,
          });
        }
        if (isMasterInstance) {
          console.log(`部署${pkg.name}成功,端口为:${address.port}`);
        }
        logger.info(`${pkg.name} is listening on http://${address.address}:${address.port}`);
        process.send && process.send("ready");
      }
    );

    // Graceful shutdown
    process.on("SIGINT", async () => {
      async function cleanUp() {
        await Promise.all(
          // 忽略错误
          [
            redis && redis.disconnect(),
            mysql && mysql.end(),
            config.discover?.register && isMasterInstance && discover.deregisterService(),
            configLoader.unload(),
          ].map((v) => v && v.catch && v.catch(() => {}))
        );
      }

      app.server.close(async () => {
        await cleanUp();
        logger.info("server graceful shutdown");
        logger.flush();
        process.exit();
      });

      // Force close server after 5secs
      setTimeout(async (e) => {
        logger.error({
          msg: "Forcing server close !!!",
          e,
        });
        logger.flush();
        await cleanUp();
        process.exit(1);
      }, 5000);
    });
  })
  .catch((err) => {
    console.log(`部署${pkg.name}失败`);
    logger.error({
      msg: "start app failed",
      err,
    });
    process.exit(1);
  });
