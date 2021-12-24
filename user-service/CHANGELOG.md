# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [2.1.0-beta.36](http://gitlab.szzbmy.com/gz-demo/user-service/compare/v2.1.0-beta.35...v2.1.0-beta.36) (2021-03-26)

## [2.1.0-beta.35](http://gitlab.szzbmy.com/gz-demo/user-service/compare/v2.1.0-beta.34...v2.1.0-beta.35) (2021-03-24)


### Features

* **apg:** 处理查不到代理人信息的情况;合并代理人信息时不要删除旧信息,重定向即可 ([d136d03](http://gitlab.szzbmy.com/gz-demo/user-service/commit/d136d0342549c02c79777ee948926d9c1163c146))

## [2.1.0-beta.34](http://gitlab.szzbmy.com/gz-demo/user-service/compare/v2.1.0-beta.33...v2.1.0-beta.34) (2021-03-23)

## [2.1.0-beta.33](http://gitlab.szzbmy.com/gz-demo/user-service/compare/v2.1.0-beta.32...v2.1.0-beta.33) (2021-03-23)

## [2.1.0-beta.32](http://gitlab.szzbmy.com/gz-demo/user-service/compare/v2.1.0-beta.31...v2.1.0-beta.32) (2021-03-23)


### Features

* **apg:** 登录接不再返回代理人信息,统一由agent_info接口去返回 ([f547efb](http://gitlab.szzbmy.com/gz-demo/user-service/commit/f547efb17d7078cff16a1a96bdb54436b40f5383))

## [2.1.0-beta.31](http://gitlab.szzbmy.com/gz-demo/user-service/compare/v2.1.0-beta.30...v2.1.0-beta.31) (2021-03-23)

## [2.1.0-beta.30](http://gitlab.szzbmy.com/gz-demo/user-service/compare/v2.1.0-beta.29...v2.1.0-beta.30) (2021-03-23)

## [2.1.0-beta.29](http://gitlab.szzbmy.com/gz-demo/user-service/compare/v2.1.0-beta.28...v2.1.0-beta.29) (2021-03-23)


### Features

* **apg:** 抛出原始信息,对指定错误码进行处理 ([4aab4af](http://gitlab.szzbmy.com/gz-demo/user-service/commit/4aab4afc02752a4394a8ea5a55a41c113414eadd))

## [2.1.0-beta.28](http://gitlab.szzbmy.com/gz-demo/user-service/compare/v2.1.0-beta.27...v2.1.0-beta.28) (2021-03-23)


### Features

* **apg:** 增加是否有敏感数据的配置项 ([c20a700](http://gitlab.szzbmy.com/gz-demo/user-service/commit/c20a700865e23b6b29ce6f94b8f62cd87b65038d))

## [2.1.0-beta.27](http://gitlab.szzbmy.com/gz-demo/user-service/compare/v2.1.0-beta.26...v2.1.0-beta.27) (2021-03-19)


### Bug Fixes

* **apg:** 代理人已经存在的情况下不会绑定的问题 ([e8609ba](http://gitlab.szzbmy.com/gz-demo/user-service/commit/e8609ba68a554c2db2bc5164fd5c64ed7ef0ef3f))

## [2.1.0-beta.26](http://gitlab.szzbmy.com/gz-demo/user-service/compare/v2.1.0-beta.25...v2.1.0-beta.26) (2021-03-19)


### Bug Fixes

* **apg:** cond ([84802da](http://gitlab.szzbmy.com/gz-demo/user-service/commit/84802dad01b7ef688958912ab5850e1d648de185))

## [2.1.0-beta.25](http://gitlab.szzbmy.com/gz-demo/user-service/compare/v2.1.0-beta.24...v2.1.0-beta.25) (2021-03-19)

## [2.1.0-beta.24](http://gitlab.szzbmy.com/gz-demo/user-service/compare/v2.1.0-beta.23...v2.1.0-beta.24) (2021-03-17)


### Bug Fixes

* **back-agent:** 如果有open_id需要检查代理人是否存在再决定插入数据 ([464d0fb](http://gitlab.szzbmy.com/gz-demo/user-service/commit/464d0fb6ed930cad6e2ecc2ba4c28d99e81d3e73))

## [2.1.0-beta.23](http://gitlab.szzbmy.com/gz-demo/user-service/compare/v2.1.0-beta.22...v2.1.0-beta.23) (2021-03-17)


### Bug Fixes

* **apg:** sdk放回的代理人信息是空对象的话要当做没有代理人处理 ([179b59d](http://gitlab.szzbmy.com/gz-demo/user-service/commit/179b59d15d1781d3295574c4bbdefd8e6425315d))

## [2.1.0-beta.22](http://gitlab.szzbmy.com/gz-demo/user-service/compare/v2.1.0-beta.21...v2.1.0-beta.22) (2021-03-16)


### Bug Fixes

* **event-bus:** userId 0不会被忽略 ([4649538](http://gitlab.szzbmy.com/gz-demo/user-service/commit/464953852f5d9555f2537ea881877bd833a4f921))

## [2.1.0-beta.21](http://gitlab.szzbmy.com/gz-demo/user-service/compare/v2.1.0-beta.20...v2.1.0-beta.21) (2021-03-16)

## [2.1.0-beta.20](http://gitlab.szzbmy.com/gz-demo/user-service/compare/v2.1.0-beta.19...v2.1.0-beta.20) (2021-03-15)


### Bug Fixes

* **apg_iop:** error cond ([7794f59](http://gitlab.szzbmy.com/gz-demo/user-service/commit/7794f590b6c7f3da816a5f3e9907927607bb8d63))

## [2.1.0-beta.19](http://gitlab.szzbmy.com/gz-demo/user-service/compare/v2.1.0-beta.18...v2.1.0-beta.19) (2021-03-15)


### Bug Fixes

* **apg_iop:** iop ([9daaf37](http://gitlab.szzbmy.com/gz-demo/user-service/commit/9daaf3750a2b0f570e58c5de83592cfc71aca0d5))

## [2.1.0-beta.18](http://gitlab.szzbmy.com/gz-demo/user-service/compare/v2.1.0-beta.17...v2.1.0-beta.18) (2021-03-15)


### Features

* **apg_iop:** open_id,open_token选填 ([752990e](http://gitlab.szzbmy.com/gz-demo/user-service/commit/752990ee3dedd1d3a5c972a0d1cba527e72d0d6d))

## [2.1.0-beta.17](http://gitlab.szzbmy.com/gz-demo/user-service/compare/v2.1.0-beta.16...v2.1.0-beta.17) (2021-03-12)


### Bug Fixes

* **user-apg:** 开放open_id ([2b28b49](http://gitlab.szzbmy.com/gz-demo/user-service/commit/2b28b49ee3b537e4d9d7c48944c74a9434aa9043))

## [2.1.0-beta.16](http://gitlab.szzbmy.com/gz-demo/user-service/compare/v2.1.0-beta.15...v2.1.0-beta.16) (2021-03-12)


### Features

* **apg:** 开放代理人open_id ([8d1722f](http://gitlab.szzbmy.com/gz-demo/user-service/commit/8d1722f7938cb1c0d3a395fa9f5f3bb5907e616b))

## [2.1.0-beta.15](http://gitlab.szzbmy.com/gz-demo/user-service/compare/v2.1.0-beta.14...v2.1.0-beta.15) (2021-03-12)


### Features

* **apg:** 独立一张关联表来管理金管家用户和代理人的信息,这样就可以在用户不登录的情况去关联 ([58697bd](http://gitlab.szzbmy.com/gz-demo/user-service/commit/58697bdac47c998c987a811653a6689ad32bbc57))

## [2.1.0-beta.14](http://gitlab.szzbmy.com/gz-demo/user-service/compare/v2.1.0-beta.13...v2.1.0-beta.14) (2021-03-12)


### Features

* **apg:** 获取代理人信息 ([e69e1fb](http://gitlab.szzbmy.com/gz-demo/user-service/commit/e69e1fb8c4e739ae1ba16a2492ac27c38ee71713))
* **apg-user:** 增加是否存在代理人的选项 ([8ed88ee](http://gitlab.szzbmy.com/gz-demo/user-service/commit/8ed88ee802615516d0a9a3cda3ea663ce7522ac9))
* **back:** 设置用户信息接口 ([b76cdf5](http://gitlab.szzbmy.com/gz-demo/user-service/commit/b76cdf518a899816c522d3490b3cd0aee1a25077))

## [2.1.0-beta.13](http://gitlab.szzbmy.com/gz-demo/user-service/compare/v2.1.0-beta.12...v2.1.0-beta.13) (2021-03-12)


### Features

* **back:** 支持设置open_id ([a524dac](http://gitlab.szzbmy.com/gz-demo/user-service/commit/a524dacf4c8362c2387ad84f3ca7b26915a19621))

## [2.1.0-beta.12](http://gitlab.szzbmy.com/gz-demo/user-service/compare/v2.1.0-beta.11...v2.1.0-beta.12) (2021-03-11)


### Features

* **user:** 验证是否是代理人的事件 ([6e4d7da](http://gitlab.szzbmy.com/gz-demo/user-service/commit/6e4d7da38634137ae30219b96e749bab5d058de9))

## [2.1.0-beta.11](http://gitlab.szzbmy.com/gz-demo/user-service/compare/v2.1.0-beta.10...v2.1.0-beta.11) (2021-03-09)


### Bug Fixes

* fix typescript error ([fc9f06a](http://gitlab.szzbmy.com/gz-demo/user-service/commit/fc9f06aa21055ea9a5da04d1ff4be8292ebdf10c))

## [2.1.0-beta.10](http://gitlab.szzbmy.com/gz-demo/user-service/compare/v2.1.0-beta.9...v2.1.0-beta.10) (2021-03-09)


### Features

* **apg-iop:** 兼容金管家新开放平台版本 ([2350c9a](http://gitlab.szzbmy.com/gz-demo/user-service/commit/2350c9aa2f6d7466d84d8cd46cfa9b27dccfb864))
* **apg-iop:** 自动回退 ([ed41b7d](http://gitlab.szzbmy.com/gz-demo/user-service/commit/ed41b7d33475b393fed412d1d90e3394b01c51ec))

## [2.1.0-beta.9](http://gitlab.szzbmy.com/gz-demo/user-service/compare/v2.1.0-beta.8...v2.1.0-beta.9) (2021-03-08)


### Bug Fixes

* **apg:** name => description ([378d679](http://gitlab.szzbmy.com/gz-demo/user-service/commit/378d679f16a62e60907592f81d6bad7b7f837798))

## [2.1.0-beta.8](http://gitlab.szzbmy.com/gz-demo/user-service/compare/v2.1.0-beta.7...v2.1.0-beta.8) (2021-02-26)


### Bug Fixes

* **back/user:** random string is a variable ([70a91a1](http://gitlab.szzbmy.com/gz-demo/user-service/commit/70a91a121ed4962dd363cec23dff1f1a42192952))

## [2.1.0-beta.7](http://gitlab.szzbmy.com/gz-demo/user-service/compare/v2.1.0-beta.6...v2.1.0-beta.7) (2021-02-26)


### Features

* **back:** 增加邀请用的后门 ([15a393f](http://gitlab.szzbmy.com/gz-demo/user-service/commit/15a393f3c67090199ae08ee1bc2fd18abf940a36))


### Bug Fixes

* **user:** should emit login ([25c2611](http://gitlab.szzbmy.com/gz-demo/user-service/commit/25c26111140cc6185aaa617e42027ed288623a8a))

## [2.1.0-beta.6](http://gitlab.szzbmy.com/gz-demo/user-service/compare/v2.1.0-beta.5...v2.1.0-beta.6) (2021-02-23)

## [2.1.0-beta.5](http://gitlab.szzbmy.com/gz-demo/user-service/compare/v2.1.0-beta.4...v2.1.0-beta.5) (2021-02-03)


### Bug Fixes

* **user:** 添加注释,金管家用户id起始值应从1开始 ([e230122](http://gitlab.szzbmy.com/gz-demo/user-service/commit/e230122d90c101b0946f440edba3096645fb3558))

## [2.1.0-beta.4](http://gitlab.szzbmy.com/gz-demo/user-service/compare/v2.1.0-beta.3...v2.1.0-beta.4) (2021-02-03)


### Features

* **config:** 支持通过配置来调整id起始值 ([4bd2020](http://gitlab.szzbmy.com/gz-demo/user-service/commit/4bd2020726edecc67fc22e16e71fa127d186011e))
* **wx:** 增加深圳微信授权体系的api ([49b6240](http://gitlab.szzbmy.com/gz-demo/user-service/commit/49b62408358f4ace7327d2580d805da8b4c48ddb))

## [2.1.0-beta.3](http://gitlab.szzbmy.com/gz-demo/user-service/compare/v2.1.0-beta.2...v2.1.0-beta.3) (2021-01-27)


### Features

* **user:** 试图中userClaims中获取数据 ([1423de1](http://gitlab.szzbmy.com/gz-demo/user-service/commit/1423de1a7146dac2b2ce95dc82ebbefa466977c6))

## [2.1.0-beta.2](http://gitlab.szzbmy.com/gz-demo/user-service/compare/v2.1.0-beta.1...v2.1.0-beta.2) (2021-01-27)

## [2.1.0-beta.1](http://gitlab.szzbmy.com/gz-demo/user-service/compare/v2.1.0-beta.0...v2.1.0-beta.1) (2021-01-27)


### Features

* **user:** 开放检测用户类型的方法 ([9eee25e](http://gitlab.szzbmy.com/gz-demo/user-service/commit/9eee25e9d4ba32d6ba37ae4b7e56c266597005a2))

## [2.1.0-beta.0](http://gitlab.szzbmy.com/gz-demo/user-service/compare/v2.0.1-beta.0...v2.1.0-beta.0) (2021-01-27)


### Features

* **back:** 增加后门用的方法和schema ([70885ec](http://gitlab.szzbmy.com/gz-demo/user-service/commit/70885ec0aa8b5e0e3ca68b2a34582612ccab0b0a))

### [2.0.1-beta.0](http://gitlab.szzbmy.com/gz-demo/user-service/compare/v1.5.0...v2.0.1-beta.0) (2021-01-26)

## [1.5.0](http://gitlab.szzbmy.com/gz-demo/user-service/compare/v1.5.0-beta.20...v1.5.0) (2021-01-26)


### Features

* yo update ([b0eae4d](http://gitlab.szzbmy.com/gz-demo/user-service/commit/b0eae4db764e4f8718d38f1ca54750d1ae6772f6))
* 去除总表,增加代码覆盖率 ([0c9a071](http://gitlab.szzbmy.com/gz-demo/user-service/commit/0c9a07144e7fbb8ddf4b3867eac62f69487aeeeb))

## [1.5.0-beta.20](http://gitlab.szzbmy.com/gz-demo/user-service/compare/v1.5.0-beta.19...v1.5.0-beta.20) (2021-01-15)


### Features

* **event-bus:** 支持传user_type优化性能 ([e9909eb](http://gitlab.szzbmy.com/gz-demo/user-service/commit/e9909eb0eb33c4c34e0c822d25e239d2b966ee25))

## [1.5.0-beta.19](http://gitlab.szzbmy.com/gz-demo/user-service/compare/v1.5.0-beta.18...v1.5.0-beta.19) (2021-01-15)


### Features

* yo update ([e4ccd4c](http://gitlab.szzbmy.com/gz-demo/user-service/commit/e4ccd4c91073d4657d428671ebedc0faa6fbc38b))
* **apg:** 独立出金管家错误码 ([824081d](http://gitlab.szzbmy.com/gz-demo/user-service/commit/824081d56507f2a88b4856ceb581778018fc0d72))

## [1.5.0-beta.18](http://gitlab.szzbmy.com/gz-demo/user-service/compare/v1.5.0-beta.17...v1.5.0-beta.18) (2021-01-15)


### Bug Fixes

* **wx:** 没有开事务 ([abc5539](http://gitlab.szzbmy.com/gz-demo/user-service/commit/abc5539d88824a0ef80072b3ff1640ade4403671))

## [1.5.0-beta.17](http://gitlab.szzbmy.com/gz-demo/user-service/compare/v1.5.0-beta.16...v1.5.0-beta.17) (2021-01-13)


### Bug Fixes

* **user:** 只能邀请一人的bug ([76cf517](http://gitlab.szzbmy.com/gz-demo/user-service/commit/76cf517aeffa077dfdf21b572d890d620217b0fc))

## [1.5.0-beta.16](http://gitlab.szzbmy.com/gz-demo/user-service/compare/v1.5.0-beta.15...v1.5.0-beta.16) (2021-01-13)


### Bug Fixes

* **user-apg:** ext需要去除 ([00ec99b](http://gitlab.szzbmy.com/gz-demo/user-service/commit/00ec99bf00760b6335af506e4d1deb55f2a21801))

## [1.5.0-beta.15](http://gitlab.szzbmy.com/gz-demo/user-service/compare/v1.5.0-beta.14...v1.5.0-beta.15) (2021-01-13)


### Features

* merge master ([895c0b5](http://gitlab.szzbmy.com/gz-demo/user-service/commit/895c0b5f1ff5aef7d55bee5e7ad0735a1f35d981))


### Bug Fixes

* **user-apg:** level没有正确返回 ([08b33a7](http://gitlab.szzbmy.com/gz-demo/user-service/commit/08b33a77e3d0c3eba9ee0dfe8b5d55a4780fd47d))

## [1.5.0-beta.14](http://gitlab.szzbmy.com/gz-demo/user-service/compare/v1.5.0-beta.13...v1.5.0-beta.14) (2021-01-13)


### Bug Fixes

* 获取用户等级缺失新的openid参数 ([2a9e24e](http://gitlab.szzbmy.com/gz-demo/user-service/commit/2a9e24e76098df1dba28961365ac6a4c963b9bc6))

## [1.5.0-beta.13](http://gitlab.szzbmy.com/gz-demo/user-service/compare/v1.5.0-beta.12...v1.5.0-beta.13) (2021-01-12)


### Features

* **apg:** 获取等级失败时静默处理 ([6470901](http://gitlab.szzbmy.com/gz-demo/user-service/commit/64709012d398a9f8a6f319545bbd9d66374ceb34))


### Bug Fixes

* **agent_info:** null check ([126fd73](http://gitlab.szzbmy.com/gz-demo/user-service/commit/126fd7323a27ed57ff6129004bcee1b6ff6663df))

## [1.5.0-beta.12](http://gitlab.szzbmy.com/gz-demo/user-service/compare/v1.5.0-beta.11...v1.5.0-beta.12) (2021-01-12)

## [1.5.0-beta.11](http://gitlab.szzbmy.com/gz-demo/user-service/compare/v1.5.0-beta.10...v1.5.0-beta.11) (2021-01-12)

## [1.5.0-beta.10](http://gitlab.szzbmy.com/gz-demo/user-service/compare/v1.5.0-beta.9...v1.5.0-beta.10) (2021-01-12)


### Features

* **apg:** iop接口使用不同的openToken和商户号 ([3b84b15](http://gitlab.szzbmy.com/gz-demo/user-service/commit/3b84b1552155dd9b7f4d540f88c4e70643c34fcd))

## [1.5.0-beta.9](http://gitlab.szzbmy.com/gz-demo/user-service/compare/v1.5.0-beta.8...v1.5.0-beta.9) (2021-01-12)


### Bug Fixes

* **config:** 应该使用双问号,否则false也会走默认值 ([eeb33c4](http://gitlab.szzbmy.com/gz-demo/user-service/commit/eeb33c4365be89289392ae51cba070eec9b898f6))

## [1.5.0-beta.8](http://gitlab.szzbmy.com/gz-demo/user-service/compare/v1.5.0-beta.7...v1.5.0-beta.8) (2021-01-12)


### Features

* **apg:** 增加获取用户vip等级的选项 ([192a2b0](http://gitlab.szzbmy.com/gz-demo/user-service/commit/192a2b03199c0633ceaf6580e946437941ebcc62))

## [1.5.0-beta.7](http://gitlab.szzbmy.com/gz-demo/user-service/compare/v1.5.0-beta.6...v1.5.0-beta.7) (2021-01-12)


### Features

* **apg:** 单独获取代理人信息的接口也可以走缓存 ([d593f14](http://gitlab.szzbmy.com/gz-demo/user-service/commit/d593f1494bf5d50dab38f2727f212bc7ef417ce6))
* **user-apg:** 缓存策略 ([b368ef3](http://gitlab.szzbmy.com/gz-demo/user-service/commit/b368ef3610ec6240d1ee91ec2e87416e97a42c14))


### Bug Fixes

* **apg-agent:** 修复重复更新的问题 ([80981a8](http://gitlab.szzbmy.com/gz-demo/user-service/commit/80981a86ba2ca11af9e81c8c06c3adc342a627f9))

## [1.5.0-beta.6](http://gitlab.szzbmy.com/gz-demo/user-service/compare/v1.5.0-beta.5...v1.5.0-beta.6) (2021-01-10)


### Features

* **back:** 设置代理人信息的后门 ([33a0521](http://gitlab.szzbmy.com/gz-demo/user-service/commit/33a05214b71984da7a1ddffbd3626918e33e6ef8))

## [1.5.0-beta.5](http://gitlab.szzbmy.com/gz-demo/user-service/compare/v1.5.0-beta.4...v1.5.0-beta.5) (2021-01-08)


### Features

* **apg:** 代理人信息即使没有open_id也能缓存 ([1ea378a](http://gitlab.szzbmy.com/gz-demo/user-service/commit/1ea378a84649a587c4aebd7a51e60f996d3437e2))
* **apg:** 文档更新 ([96c4c24](http://gitlab.szzbmy.com/gz-demo/user-service/commit/96c4c246e4aab6f4ca11e38439794c546205c5ab))
* **apg:** 适配新的验证代理人接口,同时可根据代理人地区码拓展自定义信息 ([343db94](http://gitlab.szzbmy.com/gz-demo/user-service/commit/343db943e29533ed074af0b65d0578ebd0b4374d))

## [1.5.0-beta.4](http://gitlab.szzbmy.com/gz-demo/user-service/compare/v1.5.0-beta.3...v1.5.0-beta.4) (2021-01-06)


### Features

* **merge:** merge branch from release/1.4.x ([666a17f](http://gitlab.szzbmy.com/gz-demo/user-service/commit/666a17f8225958b56e5f73f6578ba68dc2829487))

## [1.5.0-beta.3](http://gitlab.szzbmy.com/gz-demo/user-service/compare/v1.5.0-beta.2...v1.5.0-beta.3) (2021-01-01)


### Bug Fixes

* **wx-mini:** delete session_key ([1523e8b](http://gitlab.szzbmy.com/gz-demo/user-service/commit/1523e8b760cd14f321d9f19c08975cd768b4a701))

## [1.5.0-beta.2](http://gitlab.szzbmy.com/gz-demo/user-service/compare/v1.5.0-beta.1...v1.5.0-beta.2) (2020-12-30)


### Features

* 增加金管家邀请逻辑 ([b81347d](http://gitlab.szzbmy.com/gz-demo/user-service/commit/b81347d6804947de55b2ebe5a3d7ae2d5e449122))

## [1.5.0-beta.1](http://gitlab.szzbmy.com/gz-demo/user-service/compare/v1.5.0-beta.0...v1.5.0-beta.1) (2020-12-29)


### Bug Fixes

* **ts:** 签名错误 ([6f65616](http://gitlab.szzbmy.com/gz-demo/user-service/commit/6f65616ca7ac2f3605053f05e20fe1ae51f37faf))

## [1.5.0-beta.0](http://gitlab.szzbmy.com/gz-demo/user-service/compare/v1.4.0...v1.5.0-beta.0) (2020-12-29)


### Features

* **event-bus:** auto search type ([80bfaae](http://gitlab.szzbmy.com/gz-demo/user-service/commit/80bfaae2e84723fb5d3871a350ef2878169393d5))

## [1.4.0](http://gitlab.szzbmy.com/gz-demo/user-service/compare/v1.4.0-beta.57...v1.4.0) (2020-12-29)

## [1.4.0-beta.57](http://gitlab.szzbmy.com/gz-demo/user-service/compare/v1.4.0-beta.56...v1.4.0-beta.57) (2020-12-27)


### Bug Fixes

* **apg:** userInfo丢失 ([ed2b076](http://gitlab.szzbmy.com/gz-demo/user-service/commit/ed2b076edbce79d37332ccbdd4ccff373115a6b1))

## [1.4.0-beta.56](http://gitlab.szzbmy.com/gz-demo/user-service/compare/v1.4.0-beta.55...v1.4.0-beta.56) (2020-12-27)


### Bug Fixes

* **apg:** 使用??运算符防止0被忽略 ([4a5c01d](http://gitlab.szzbmy.com/gz-demo/user-service/commit/4a5c01dccc44c565eb398ae5d14ae869c9539bd6))

## [1.4.0-beta.55](http://gitlab.szzbmy.com/gz-demo/user-service/compare/v1.4.0-beta.54...v1.4.0-beta.55) (2020-12-27)


### Bug Fixes

* **apg:** 不查询is_agent后不返回is_agent]的bug ([51728fd](http://gitlab.szzbmy.com/gz-demo/user-service/commit/51728fde2cbefc05b10ee336b0f28aa989682308))

## [1.4.0-beta.54](http://gitlab.szzbmy.com/gz-demo/user-service/compare/v1.4.0-beta.53...v1.4.0-beta.54) (2020-12-27)


### Bug Fixes

* **apg:** is_agent ([03fb3a0](http://gitlab.szzbmy.com/gz-demo/user-service/commit/03fb3a06b868d04ac618dc236c55561f06b4a28e))

## [1.4.0-beta.53](http://gitlab.szzbmy.com/gz-demo/user-service/compare/v1.4.0-beta.52...v1.4.0-beta.53) (2020-12-27)


### Bug Fixes

* **apg:** is_agent ([965e0e4](http://gitlab.szzbmy.com/gz-demo/user-service/commit/965e0e473fa081a77b1db62771a1bfb11d3ebad0))

## [1.4.0-beta.52](http://gitlab.szzbmy.com/gz-demo/user-service/compare/v1.4.0-beta.51...v1.4.0-beta.52) (2020-12-27)


### Features

* **apg:** 新配置项 ([1c9a15a](http://gitlab.szzbmy.com/gz-demo/user-service/commit/1c9a15afb86b6724f1cef9de7712ee3e29d9f728))

## [1.4.0-beta.51](http://gitlab.szzbmy.com/gz-demo/user-service/compare/v1.4.0-beta.50...v1.4.0-beta.51) (2020-12-25)


### Features

* **user-apg:** 缓存项 ([1f6c434](http://gitlab.szzbmy.com/gz-demo/user-service/commit/1f6c434f291e26b68a9ad06b910a06f6a9322e47))

## [1.4.0-beta.50](http://gitlab.szzbmy.com/gz-demo/user-service/compare/v1.4.0-beta.49...v1.4.0-beta.50) (2020-12-23)

## [1.4.0-beta.49](http://gitlab.szzbmy.com/gz-demo/user-service/compare/v1.4.0-beta.48...v1.4.0-beta.49) (2020-12-23)


### Features

* **user-apg:** 开放sdk ([b681db4](http://gitlab.szzbmy.com/gz-demo/user-service/commit/b681db49a72c2f03467af35075129558e1873b5a))

## [1.4.0-beta.48](http://gitlab.szzbmy.com/gz-demo/user-service/compare/v1.4.0-beta.47...v1.4.0-beta.48) (2020-12-23)


### Bug Fixes

* **user-apg:** store存储accessToken,防止每次new的时候token丢失 ([26c9c01](http://gitlab.szzbmy.com/gz-demo/user-service/commit/26c9c0126ea986569238d789e1651f73c5f710e3))

## [1.4.0-beta.47](http://gitlab.szzbmy.com/gz-demo/user-service/compare/v1.4.0-beta.46...v1.4.0-beta.47) (2020-12-23)

## [1.4.0-beta.46](http://gitlab.szzbmy.com/gz-demo/user-service/compare/v1.4.0-beta.45...v1.4.0-beta.46) (2020-12-23)

## [1.4.0-beta.45](http://gitlab.szzbmy.com/gz-demo/user-service/compare/v1.4.0-beta.44...v1.4.0-beta.45) (2020-12-22)


### Features

* **user-apg:** log ([d9cbca5](http://gitlab.szzbmy.com/gz-demo/user-service/commit/d9cbca5241aabe3b8e5b0b1acbdce9b77eadb9c0))

## [1.4.0-beta.44](http://gitlab.szzbmy.com/gz-demo/user-service/compare/v1.4.0-beta.43...v1.4.0-beta.44) (2020-12-22)


### Features

* **agent:** 自动尝试重新获取代理人 ([8c928e7](http://gitlab.szzbmy.com/gz-demo/user-service/commit/8c928e77cf0601360ebc80b55145b7612357583a))

## [1.4.0-beta.43](http://gitlab.szzbmy.com/gz-demo/user-service/compare/v1.4.0-beta.42...v1.4.0-beta.43) (2020-12-18)


### Features

* gen code ([26b6622](http://gitlab.szzbmy.com/gz-demo/user-service/commit/26b662265761f70a352ce504f259d1c136a0bde2))


### Bug Fixes

* **user-apg:** 不能暴露私密信息 ([c112e14](http://gitlab.szzbmy.com/gz-demo/user-service/commit/c112e14cac7bee77232fb88e8d267d335d71fb04))
* **user-apg:** 代理人如果有openId就落库,且返回的应该是下划线 ([7b1acf6](http://gitlab.szzbmy.com/gz-demo/user-service/commit/7b1acf6a74a79273954876ff57a442fb8ddea9cc))

## [1.4.0-beta.42](http://gitlab.szzbmy.com/gz-demo/user-service/compare/v1.4.0-beta.41...v1.4.0-beta.42) (2020-12-18)


### Bug Fixes

* **user-apg:** 代理人不一定有 open id ([6ef675d](http://gitlab.szzbmy.com/gz-demo/user-service/commit/6ef675d352600a9eaf70eaae38cf34a18ce39ad6))

## [1.4.0-beta.41](http://gitlab.szzbmy.com/gz-demo/user-service/compare/v1.4.0-beta.40...v1.4.0-beta.41) (2020-12-18)

## [1.4.0-beta.40](http://gitlab.szzbmy.com/gz-demo/user-service/compare/v1.4.0-beta.39...v1.4.0-beta.40) (2020-12-18)


### Features

* **user-apg:** 代理人信息报错静默处理 ([03c99c6](http://gitlab.szzbmy.com/gz-demo/user-service/commit/03c99c659cd66efaaee25ae724fcc6786105ab4b))

## [1.4.0-beta.39](http://gitlab.szzbmy.com/gz-demo/user-service/compare/v1.4.0-beta.38...v1.4.0-beta.39) (2020-12-16)


### Features

* **user-apg:** 获取代理人信息和验证是否为代理人接口支持传入不同的活动号 ([7c1908d](http://gitlab.szzbmy.com/gz-demo/user-service/commit/7c1908dc8628b0098f20df4e46067ff2c7ad8b5f))

## [1.4.0-beta.38](http://gitlab.szzbmy.com/gz-demo/user-service/compare/v1.4.0-beta.37...v1.4.0-beta.38) (2020-12-14)


### Features

* **user:** 存昵称 ([aea1b33](http://gitlab.szzbmy.com/gz-demo/user-service/commit/aea1b33f8e6cd36ce1d1acd8565f29f9624b224c))

## [1.4.0-beta.37](http://gitlab.szzbmy.com/gz-demo/user-service/compare/v1.4.0-beta.36...v1.4.0-beta.37) (2020-12-11)

## [1.4.0-beta.36](http://gitlab.szzbmy.com/gz-demo/user-service/compare/v1.4.0-beta.35...v1.4.0-beta.36) (2020-12-11)


### Features

* **user-apg:** 支持控制代理人级别 ([9516f19](http://gitlab.szzbmy.com/gz-demo/user-service/commit/9516f1996bef4ab967fc74de30cc7170a1d5129b))

## [1.4.0-beta.35](http://gitlab.szzbmy.com/gz-demo/user-service/compare/v1.4.0-beta.34...v1.4.0-beta.35) (2020-12-10)

## [1.4.0-beta.34](http://gitlab.szzbmy.com/gz-demo/user-service/compare/v1.4.0-beta.33...v1.4.0-beta.34) (2020-12-09)

## [1.4.0-beta.33](http://gitlab.szzbmy.com/gz-demo/user-service/compare/v1.4.0-beta.32...v1.4.0-beta.33) (2020-12-09)


### Features

* **event:** 开放获取公共用户信息 ([324c7a0](http://gitlab.szzbmy.com/gz-demo/user-service/commit/324c7a0b7f7d41857534047bfcfe0cf59aac36f0))

## [1.4.0-beta.32](http://gitlab.szzbmy.com/gz-demo/user-service/compare/v1.4.0-beta.31...v1.4.0-beta.32) (2020-12-09)

## [1.4.0-beta.31](http://gitlab.szzbmy.com/gz-demo/user-service/compare/v1.4.0-beta.30...v1.4.0-beta.31) (2020-12-09)


### Bug Fixes

* **type-declare:** | undefined ([c5f4c92](http://gitlab.szzbmy.com/gz-demo/user-service/commit/c5f4c925305f6be61631876f6751961fc75529ad))

## [1.4.0-beta.30](http://gitlab.szzbmy.com/gz-demo/user-service/compare/v1.4.0-beta.29...v1.4.0-beta.30) (2020-12-09)


### Features

* **event:** 添加通讯事件 ([45dde5e](http://gitlab.szzbmy.com/gz-demo/user-service/commit/45dde5e2b0c1d586eee381a1154d56fc2a0608ea))

## [1.4.0-beta.29](http://gitlab.szzbmy.com/gz-demo/user-service/compare/v1.4.0-beta.28...v1.4.0-beta.29) (2020-12-09)


### Features

* **mock:** mock不配置的话默认为true ([8df36c5](http://gitlab.szzbmy.com/gz-demo/user-service/commit/8df36c52d5290c9401426f7acc7795e1c9923c24))


### Bug Fixes

* **mini_login:** 请求下前要关闭事务,needRelation需要处理 ([6f5ebb5](http://gitlab.szzbmy.com/gz-demo/user-service/commit/6f5ebb5bd62f0a21e5f3fe6c2cd6bbbd11e67998))

## [1.4.0-beta.28](http://gitlab.szzbmy.com/gz-demo/user-service/compare/v1.4.0-beta.27...v1.4.0-beta.28) (2020-12-07)


### Features

* **user:** 配置都要有默认值 ([e712d9d](http://gitlab.szzbmy.com/gz-demo/user-service/commit/e712d9d7033fd5c231dd70f91f503f5e2eaab7a9))

## [1.4.0-beta.27](http://gitlab.szzbmy.com/gz-demo/user-service/compare/v1.4.0-beta.26...v1.4.0-beta.27) (2020-12-07)


### Features

* **apg:** 增加单独的获取代理人接口,可通过参数控制登录接口是否返回代理人信息 ([594d7fd](http://gitlab.szzbmy.com/gz-demo/user-service/commit/594d7fdda16aea2f4d33254c8a64577a968eb1d4))

## [1.4.0-beta.26](http://gitlab.szzbmy.com/gz-demo/user-service/compare/v1.4.0-beta.25...v1.4.0-beta.26) (2020-12-07)


### Features

* **apg/mini_login:** code支持可选 ([3d54873](http://gitlab.szzbmy.com/gz-demo/user-service/commit/3d54873306fb18ae0f804f48914bbf58ac42aae2))


### Bug Fixes

* **relation:** 判空 ([40d6646](http://gitlab.szzbmy.com/gz-demo/user-service/commit/40d664681ac8ba47a659119b3423c9fab5d372ad))

## [1.4.0-beta.25](http://gitlab.szzbmy.com/gz-demo/user-service/compare/v1.4.0-beta.24...v1.4.0-beta.25) (2020-12-04)

## [1.4.0-beta.24](http://gitlab.szzbmy.com/gz-demo/user-service/compare/v1.4.0-beta.23...v1.4.0-beta.24) (2020-12-04)

## [1.4.0-beta.23](http://gitlab.szzbmy.com/gz-demo/user-service/compare/v1.4.0-beta.22...v1.4.0-beta.23) (2020-12-03)


### Bug Fixes

* **user:** last_login_at要指向上次的登录时间 ([81ef334](http://gitlab.szzbmy.com/gz-demo/user-service/commit/81ef3345b545bef7ccab38342dd26a07780f0443))

## [1.4.0-beta.22](http://gitlab.szzbmy.com/gz-demo/user-service/compare/v1.4.0-beta.21...v1.4.0-beta.22) (2020-12-03)


### Features

* 提供优化选项 ([a48a625](http://gitlab.szzbmy.com/gz-demo/user-service/commit/a48a625c0ad863f6a6936e541feac23c4dcceef2))
* **event-bus:** 增加登录事件 ([4a384f9](http://gitlab.szzbmy.com/gz-demo/user-service/commit/4a384f93d36c2ccb5c242319094c22957a95f726))

## [1.4.0-beta.21](http://gitlab.szzbmy.com/gz-demo/user-service/compare/v1.4.0-beta.20...v1.4.0-beta.21) (2020-12-03)


### Bug Fixes

* **user-relation:** 用户关系表维护 ([302cc68](http://gitlab.szzbmy.com/gz-demo/user-service/commit/302cc68e02b1606085b0adf716ce579071f1ff2e))

## [1.4.0-beta.20](http://gitlab.szzbmy.com/gz-demo/user-service/compare/v1.4.0-beta.19...v1.4.0-beta.20) (2020-12-03)


### Bug Fixes

* **init.sql:** open_id not unique ([c93b1d3](http://gitlab.szzbmy.com/gz-demo/user-service/commit/c93b1d327440387b55b8f89b5794cbf9ec71b488))

## [1.4.0-beta.19](http://gitlab.szzbmy.com/gz-demo/user-service/compare/v1.4.0-beta.17...v1.4.0-beta.19) (2020-12-03)

## [1.4.0-beta.18](http://gitlab.szzbmy.com/gz-demo/user-service/compare/v1.4.0-beta.17...v1.4.0-beta.18) (2020-12-03)

## [1.4.0-beta.17](http://gitlab.szzbmy.com/gz-demo/user-service/compare/v1.4.0-beta.16...v1.4.0-beta.17) (2020-12-03)


### Bug Fixes

* **auth:** ctx.next() ([c8528c6](http://gitlab.szzbmy.com/gz-demo/user-service/commit/c8528c694bae935107e9b63f1f112a2f823cc380))

## [1.4.0-beta.16](http://gitlab.szzbmy.com/gz-demo/user-service/compare/v1.4.0-beta.15...v1.4.0-beta.16) (2020-12-03)


### Features

* **apg-mini:** 完善用户关联 ([a5a3d4b](http://gitlab.szzbmy.com/gz-demo/user-service/commit/a5a3d4b775de9637a43fa669709cb2ef02747d53))

## [1.4.0-beta.15](http://gitlab.szzbmy.com/gz-demo/user-service/compare/v1.4.0-beta.14...v1.4.0-beta.15) (2020-12-02)


### Features

* yo update ([2b7f773](http://gitlab.szzbmy.com/gz-demo/user-service/commit/2b7f7739a79bd2e2880f4a83cc38b99e95eb15e0))
* **user:** 增加金管家小程序用户场景 ([243661a](http://gitlab.szzbmy.com/gz-demo/user-service/commit/243661ab1a0f8df091852a2515aeff7524a05887))

## [1.4.0-beta.14](http://gitlab.szzbmy.com/gz-demo/user-service/compare/v1.4.0-beta.13...v1.4.0-beta.14) (2020-12-02)


### Features

* yo update ([e935441](http://gitlab.szzbmy.com/gz-demo/user-service/commit/e9354411d186ad41da4849df197860837612def1))

## [1.4.0-beta.13](http://gitlab.szzbmy.com/gz-demo/user-service/compare/v1.4.0-beta.12...v1.4.0-beta.13) (2020-12-02)


### Features

* yo update ([f51b853](http://gitlab.szzbmy.com/gz-demo/user-service/commit/f51b85395f28971fd126548981296c0c6fa300c4))

## [1.4.0-beta.12](http://gitlab.szzbmy.com/gz-demo/user-service/compare/v1.4.0-beta.11...v1.4.0-beta.12) (2020-12-02)


### Features

* yo update ([71dbe4c](http://gitlab.szzbmy.com/gz-demo/user-service/commit/71dbe4c6bb424c7b3e635d0a43b830f44688bcc0))
* yo update ([3ebb282](http://gitlab.szzbmy.com/gz-demo/user-service/commit/3ebb282a8f11507d38f0c324f21a5b69296713c7))

## [1.4.0-beta.11](http://gitlab.szzbmy.com/gz-demo/user-service/compare/v1.4.0-beta.10...v1.4.0-beta.11) (2020-12-02)


### Features

* **back:** 增加后门接口 ([6188768](http://gitlab.szzbmy.com/gz-demo/user-service/commit/618876879559fcefca9e642713334802cb1a7a5f))

## [1.4.0-beta.10](http://gitlab.szzbmy.com/gz-demo/user-service/compare/v1.4.0-beta.9...v1.4.0-beta.10) (2020-12-01)


### Bug Fixes

* **user:** 每次都要更新lastLoginAt ([71b779d](http://gitlab.szzbmy.com/gz-demo/user-service/commit/71b779dc5155b8a0d4986108173c7720504afd92))

## [1.4.0-beta.9](http://gitlab.szzbmy.com/gz-demo/user-service/compare/v1.4.0-beta.8...v1.4.0-beta.9) (2020-11-30)


### Features

* 按照规范开发 ([22478df](http://gitlab.szzbmy.com/gz-demo/user-service/commit/22478dfb8dc52b6749e8fa1d4dfc381ba0a34998))

## [1.4.0-beta.8](http://gitlab.szzbmy.com/gz-demo/user-service/compare/v1.4.0-beta.7...v1.4.0-beta.8) (2020-11-30)


### Features

* yo update ([d4d664e](http://gitlab.szzbmy.com/gz-demo/user-service/commit/d4d664eeba78f4a365d7071b22d49f6478cb1b67))

## [1.4.0-beta.7](http://gitlab.szzbmy.com/gz-demo/user-service/compare/v1.4.0-beta.6...v1.4.0-beta.7) (2020-11-30)

## [1.4.0-beta.6](http://gitlab.szzbmy.com/gz-demo/user-service/compare/v1.4.0-beta.5...v1.4.0-beta.6) (2020-11-30)


### Bug Fixes

* **apg:** agent_info的值应该用数据库下划线的,不可返回agent_no ([4307428](http://gitlab.szzbmy.com/gz-demo/user-service/commit/43074282e32ca8c342ea7dc3b288b838216b97b5))

## [1.4.0-beta.5](http://gitlab.szzbmy.com/gz-demo/user-service/compare/v1.4.0-beta.4...v1.4.0-beta.5) (2020-11-28)


### Bug Fixes

* **wx-mini:** 授权时更新union_id ([614d9b2](http://gitlab.szzbmy.com/gz-demo/user-service/commit/614d9b2d5613882ad7bfaaa68e95680709d09887))

## [1.4.0-beta.4](http://gitlab.szzbmy.com/gz-demo/user-service/compare/v1.4.0-beta.3...v1.4.0-beta.4) (2020-11-28)


### Bug Fixes

* **wx:** 更新union_id ([c60d7f2](http://gitlab.szzbmy.com/gz-demo/user-service/commit/c60d7f2179ef54dee88a113e70312106d479ac49))

## [1.4.0-beta.3](http://gitlab.szzbmy.com/gz-demo/user-service/compare/v1.4.0-beta.2...v1.4.0-beta.3) (2020-11-27)


### Features

* gen code ([db11f0c](http://gitlab.szzbmy.com/gz-demo/user-service/commit/db11f0c517e563ec372cb0d7d446b46f913c3c86))

## [1.4.0-beta.2](http://gitlab.szzbmy.com/gz-demo/user-service/compare/v1.4.0-beta.1...v1.4.0-beta.2) (2020-11-27)


### Features

* yo update ([05e6d38](http://gitlab.szzbmy.com/gz-demo/user-service/commit/05e6d3869ce3cfb803a90494e9ebbbd0fd49b245))

## [1.4.0-beta.1](http://gitlab.szzbmy.com/gz-demo/user-service/compare/v1.4.0-beta.0...v1.4.0-beta.1) (2020-11-27)

## 1.4.0-beta.0 (2020-11-27)


### Features

* string都改为NotEmptyString ([bdd92b9](http://gitlab.szzbmy.com/gz-demo/user-service/commit/bdd92b996c29709d41d552069c7b139a30b6a53f))
* yo update ([da507b9](http://gitlab.szzbmy.com/gz-demo/user-service/commit/da507b9200038bd2a7a40a9009ac3b4aba6c2599))
* yo update ([fc6190d](http://gitlab.szzbmy.com/gz-demo/user-service/commit/fc6190d6480546d1a775a4544c30d5a73a8fb9a9))
* yo update ([402a2c7](http://gitlab.szzbmy.com/gz-demo/user-service/commit/402a2c779b2f679f4677756a0339136cdd26baa8))
* yo update ([6a0a9de](http://gitlab.szzbmy.com/gz-demo/user-service/commit/6a0a9de694136fff79905a1567898511c4e39116))
* yo update ([ac75ec6](http://gitlab.szzbmy.com/gz-demo/user-service/commit/ac75ec64b4abae049f07c9bab985ac8202d1bd8e))
* yo update ([3fafdff](http://gitlab.szzbmy.com/gz-demo/user-service/commit/3fafdff89f5cad7b23357f8a7224bb1d6cd11e8d))
* yo update ([4325509](http://gitlab.szzbmy.com/gz-demo/user-service/commit/432550963e5dbce9a3f175addeef297cb4740b53))
* yo update ([31c7a34](http://gitlab.szzbmy.com/gz-demo/user-service/commit/31c7a345d8b668998fe669f95e0966c3a484c9c9))
* yo update ([47a9e7f](http://gitlab.szzbmy.com/gz-demo/user-service/commit/47a9e7fa6d75f1d5f5516966db2313b7c7e9da4d))
* 从 gz-common-service 拆成 user-service ([b839d75](http://gitlab.szzbmy.com/gz-demo/user-service/commit/b839d7523a0691fca6568b1218d4d50d6edcb4e6))
* 初步完成金管家,微信,微信小程序登录和授权模块 ([4af69b2](http://gitlab.szzbmy.com/gz-demo/user-service/commit/4af69b256f204f2d6c1a8d81c927c414a3fb9441))
* 开放获取用户信息接口 ([61012df](http://gitlab.szzbmy.com/gz-demo/user-service/commit/61012dfe4cbfbc635182523657117c8dfccb6170))
* 类型和方法迁移至auth里 ([0cc16e3](http://gitlab.szzbmy.com/gz-demo/user-service/commit/0cc16e352a7d0e3cd45b70f840047e3d696193aa))
* **apg:** 增加代理人相关逻辑 ([b96dff6](http://gitlab.szzbmy.com/gz-demo/user-service/commit/b96dff61ac7a463d2e723d752ba249e16f617001))
* **index:** export ([9758eb6](http://gitlab.szzbmy.com/gz-demo/user-service/commit/9758eb6d786f01374fc49da34f20d859d7a4fdd2))
* **index:** 开放方法 ([b6f39ac](http://gitlab.szzbmy.com/gz-demo/user-service/commit/b6f39ac5569871f78a3750a07b6b4727d2b8adb1))
* **user:** 返回是不是今天首次登录 ([ad54f8a](http://gitlab.szzbmy.com/gz-demo/user-service/commit/ad54f8a04a7cb78a32e2867b54452f607ec5f8ca))
* **usertype:** 可拓展 ([95b0fbc](http://gitlab.szzbmy.com/gz-demo/user-service/commit/95b0fbca84be96076b6f8af84e0445981d9a5252))


### Bug Fixes

* prefix需要加 / 开头 ([1be252f](http://gitlab.szzbmy.com/gz-demo/user-service/commit/1be252fabbc2bea3878d65f30e4f046e5846b46d))
* 首次登录也要返回last_login_at ([f03ab11](http://gitlab.szzbmy.com/gz-demo/user-service/commit/f03ab1185f9f07d551822632bf25938890e5f631))
* **apg:** 老用户返回last_login_at ([f6dd973](http://gitlab.szzbmy.com/gz-demo/user-service/commit/f6dd973784382d15ffd06fe6487862b4183f1aaa))
* **api-security:** wx => x ([feb584e](http://gitlab.szzbmy.com/gz-demo/user-service/commit/feb584e40c57817a56d01016d495fe9f76ab7736))
* **compose:** 不需要拦截加next ([d4cd115](http://gitlab.szzbmy.com/gz-demo/user-service/commit/d4cd11592b051227805424b0f8a7d23794ccada8))
* **compose:** 需要next ([55b2748](http://gitlab.szzbmy.com/gz-demo/user-service/commit/55b2748a2daad9a58b5ff3897335d2a1081f21bf))
* **framework:** clone ([a172a65](http://gitlab.szzbmy.com/gz-demo/user-service/commit/a172a65430aff607f08c453183317c3f03bd0159))
* 升级 erest 依赖 解决生成文档的问题 ([d3beff9](http://gitlab.szzbmy.com/gz-demo/user-service/commit/d3beff930b9442cb549f5306b0debe8cf993191d))
* **framework:** 只覆盖service,model,其他都用context原有的 ([8b63757](http://gitlab.szzbmy.com/gz-demo/user-service/commit/8b637571a2d150c584e27cba5795a3eb477e3c8b))
* **lastloginat:** 使用上次的登录时间,而不是每次都拿现在时间 ([e067964](http://gitlab.szzbmy.com/gz-demo/user-service/commit/e0679640bb97aabd12fd71440f3c4f692180de88))
* **routers:** 误修改 ([b65ed79](http://gitlab.szzbmy.com/gz-demo/user-service/commit/b65ed7981921d7965701cc218ad97248c797d394))
* **test-init:** sql分析 ([924a1a1](http://gitlab.szzbmy.com/gz-demo/user-service/commit/924a1a1a7e38a96e22ee200eb71a91d51e3191b6))
* **wx:** 显式授权没有插入userType ([406c680](http://gitlab.szzbmy.com/gz-demo/user-service/commit/406c6808f5f85006f622e1e6a19c57b29b4a1f4d))
