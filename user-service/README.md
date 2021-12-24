# 用户服务

### 该服务提供了以下类型和方法

- ```UserType```类型，用户类型，现有以下三种类型
  - Apg，金管家
  - Wx，微信
  - WxMini，微信小程序

- ```UserClaims```类型，用户数据

- ```userAuthGuard``` 中间件， 用于确保用户是有登录态的，使用方式如下

  ```typescript
  import { userAuthGuard, UserType, getUserFromSession } from "@gz/user-service";

  // 确保用户有登录就行，不在乎用户的类型
  api
    .post("/one")
    .middleware(userAuthGuard())
    .register(async ctx => {
      // 拿用户信息
      const user = getUserFromSession(ctx);
    });

  // 确保是微信的用户才能进来这个路由
  api
    .post("/two")
    .middleware(userAuthGuard(UserType.Wx))
    .register(async ctx => {
    });
  ```

- ```setUserToSession```方法，将用户保存至session上，如果有自定义的登录接口，可以使用该方法

  ```typescript
  import { setUserToSession } from "@gz/user-service";

  api
    .post("/login")
    .register(async ctx => {
      setUserToSession(ctx, {
        // 用户具体表的id,如用户类型是Apg,则指的是apg_user表的id
        id: 1,
        // 用户总表的id,即user表的id
        userId: 1,
        openId: "xx",
        // 你自己的用户类型，枚举，不要是1 2 3，会跟原有的类型冲突
        type: 5
      });
    })
  ```

- ```getUserFromSession```方法，将用户从session中取出来

  ```typescript
  import { getUserFromSession } from "@gz/user-service";

  api
    .post("/test")
    .register(async ctx => {
      const user = getUserFromSession(ctx);
    })
  ```
