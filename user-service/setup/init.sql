CREATE TABLE IF NOT EXISTS `uservice_apg_user`
(
    `id`            BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT '金管家用户id',
    `create_at`     DATETIME           NOT NULL DEFAULT NOW() COMMENT '创建时间',
    `update_at`     DATETIME           NOT NULL DEFAULT NOW() ON UPDATE NOW() COMMENT '更新时间',
    `open_id`       VARCHAR(64) BINARY NOT NULL,
    `nickname`      VARCHAR(64) COMMENT '昵称',
    `avatar`        VARCHAR(2048) COMMENT '头像',
    `is_agent`      TINYINT(1) COMMENT '是否是代理人',
    `is_freshman`   VARCHAR(64) COMMENT '意义未知,只知道 is_freshman = false && is_agent = 1 的情况下才是真正的代理人,前端判断的时候看is_agent是否等于1就行了, 不用理会该字段',
    `agent_type`    VARCHAR(64) COMMENT '查询代理人信息返回的',
    `level`         VARCHAR(64) COMMENT '用户vip等级',
    `last_login_at` DATETIME           NOT NULL DEFAULT NOW() COMMENT '最后登录时间',
    UNIQUE INDEX (`open_id`) USING HASH
) ENGINE = InnoDB
  CHARSET = utf8mb4
  AUTO_INCREMENT = 0 COMMENT '金管家用户';

CREATE TABLE IF NOT EXISTS `uservice_apg_user_agent_relation`
(
    `id`           BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT '金管家用户id',
    `create_at`    DATETIME           NOT NULL DEFAULT NOW() COMMENT '创建时间',
    `update_at`    DATETIME           NOT NULL DEFAULT NOW() ON UPDATE NOW() COMMENT '更新时间',
    `user_open_id` VARCHAR(64) BINARY NOT NULL COMMENT '金管家用户open id',
    `agent_id`     INT UNSIGNED       NOT NULL COMMENT '代理人id',
    UNIQUE INDEX (`user_open_id`, `agent_id`) USING HASH,
    INDEX (`agent_id`)
) ENGINE = InnoDB
  CHARSET = utf8mb4 COMMENT '金管家用户代理人关联表';

CREATE TABLE IF NOT EXISTS `uservice_wx_user`
(
    `id`            BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT '微信用户id',
    `create_at`     DATETIME           NOT NULL DEFAULT NOW() COMMENT '创建时间',
    `update_at`     DATETIME           NOT NULL DEFAULT NOW() ON UPDATE NOW() COMMENT '更新时间',
    `open_id`       VARCHAR(64) BINARY NOT NULL,
    `union_id`      VARCHAR(64)        NOT NULL DEFAULT '',
    `nickname`      VARCHAR(64) COMMENT '昵称',
    `avatar`        VARCHAR(2048) COMMENT '头像',
    `sex`           CHAR(1) COMMENT '性别,0:未知,1:男,2:女',
    `city`          VARCHAR(64) COMMENT '城市',
    `province`      VARCHAR(64) COMMENT '省份',
    `country`       VARCHAR(64) COMMENT '国家',
    `language`      VARCHAR(64) COMMENT '语言',
    `privilege`     TEXT COMMENT '特权',
    `last_login_at` DATETIME           NOT NULL DEFAULT NOW() COMMENT '最后登录时间',
    UNIQUE INDEX (`open_id`) USING HASH
) ENGINE = InnoDB
  CHARSET = utf8mb4
  AUTO_INCREMENT = 200000000 COMMENT '微信用户';

CREATE TABLE IF NOT EXISTS `uservice_wx_mini_user`
(
    `id`            BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT '微信小程序用户id',
    `create_at`     DATETIME           NOT NULL DEFAULT NOW() COMMENT '创建时间',
    `update_at`     DATETIME           NOT NULL DEFAULT NOW() ON UPDATE NOW() COMMENT '更新时间',
    `open_id`       VARCHAR(64) BINARY NOT NULL,
    `union_id`      VARCHAR(64)        NOT NULL DEFAULT '',
    `nickname`      VARCHAR(64) COMMENT '昵称',
    `avatar`        VARCHAR(2048) COMMENT '头像',
    `gender`        TINYINT UNSIGNED COMMENT '性别,0:未知,1:男性,2:女性',
    `city`          VARCHAR(64) COMMENT '国家',
    `province`      VARCHAR(64) COMMENT '省份',
    `country`       VARCHAR(64) COMMENT '国家',
    `phone`         VARCHAR(20) COMMENT '用户绑定的手机号（国外手机号会有区号）',
    `pure_phone`    VARCHAR(20) COMMENT '没有区号的手机号',
    `country_code`  VARCHAR(64) COMMENT '区号',
    `last_login_at` DATETIME           NOT NULL DEFAULT NOW() COMMENT '最后登录时间',
    UNIQUE INDEX (`open_id`) USING HASH
) ENGINE = InnoDB
  CHARSET = utf8mb4
  AUTO_INCREMENT = 400000000 COMMENT '微信小程序用户';

CREATE TABLE IF NOT EXISTS `uservice_apg_agent`
(
    `id`            BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT '金管家代理人id',
    `create_at`     DATETIME NOT NULL DEFAULT NOW() COMMENT '创建时间',
    `update_at`     DATETIME NOT NULL DEFAULT NOW() ON UPDATE NOW() COMMENT '更新时间',
    `open_id`       VARCHAR(64),
    `mobile`        VARCHAR(20) COMMENT '手机号码,带*的',
    `nickname`      VARCHAR(64) COMMENT '姓名',
    `avatar`        VARCHAR(2048) COMMENT '头像',
    `avatar_type`   VARCHAR(20) COMMENT '头像类型(00系统、01自定义、02上传至七牛的自定义头像）',
    `agent_no`      VARCHAR(64) COMMENT '业务员号',
    `mark_agent_no` VARCHAR(64) COMMENT '业务员号,带*的',
    `institution`   VARCHAR(64) COMMENT '所属二级机构',
    `region_code`   VARCHAR(64) COMMENT '所属二级机构编码',
    `card_url`      VARCHAR(2048) COMMENT '封面',
    UNIQUE INDEX (`open_id`) USING HASH
) ENGINE = InnoDB
  CHARSET = utf8mb4 COMMENT '金管家代理人';

CREATE TABLE IF NOT EXISTS `uservice_user_relation`
(
    `id`              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT '关联id',
    `create_at`       DATETIME NOT NULL DEFAULT NOW() COMMENT '创建时间',
    `update_at`       DATETIME NOT NULL DEFAULT NOW() ON UPDATE NOW() COMMENT '更新时间',
    `apg_user_id`     BIGINT UNSIGNED COMMENT '金管家用户id',
    `apg_open_id`     VARCHAR(64) COMMENT '金管家用户open id',
    `wx_user_id`      BIGINT UNSIGNED COMMENT '微信用户id',
    `wx_open_id`      VARCHAR(64) COMMENT '微信用户open id',
    `wx_mini_user_id` BIGINT UNSIGNED COMMENT '微信小程序用户id',
    `wx_mini_open_id` VARCHAR(64) COMMENT '微信小程序用户open id',
    UNIQUE INDEX (`apg_user_id`),
    UNIQUE INDEX (`wx_user_id`),
    UNIQUE INDEX (`wx_mini_user_id`),
    INDEX (`apg_open_id`) USING HASH,
    INDEX (`wx_open_id`) USING HASH,
    INDEX (`wx_mini_open_id`) USING HASH
) ENGINE = InnoDB
  CHARSET = utf8mb4 COMMENT '用户关联';

CREATE TABLE IF NOT EXISTS `uservice_user_invite`
(
    `id`               BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT '关联id',
    `create_at`        DATETIME         NOT NULL DEFAULT NOW() COMMENT '创建时间',
    `update_at`        DATETIME         NOT NULL DEFAULT NOW() ON UPDATE NOW() COMMENT '更新时间',
    `user_id`          BIGINT UNSIGNED  NOT NULL COMMENT '邀请者用户id',
    `user_type`        TINYINT UNSIGNED NOT NULL,
    `friend_user_id`   BIGINT UNSIGNED  NOT NULL COMMENT '好友用户id',
    `friend_user_type` TINYINT UNSIGNED NOT NULL,
    `type`             TINYINT(1)       NOT NULL COMMENT '1:邀请方,2:被邀请方',
    UNIQUE INDEX (`user_id`, `friend_user_id`),
    UNIQUE INDEX (`friend_user_id`, `user_id`)
) ENGINE = InnoDB
  CHARSET = utf8mb4 COMMENT '新用户邀请记录';
