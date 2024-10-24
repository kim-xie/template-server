# 服务端通用脚手架

## 技术栈

nestjs + typescript + pnpm + prisma + docker + winston + mongodb + mysql + elasticsearch

## 功能列表

1、jwt 登录鉴权
2、swagger api 在线文档
3、appollo appollo对接
4、数据库连接（MySQL、MongoDB）持久层框架ORM（prisma）
5、基建：代码规范、风格、文件命名、提交规范、CICD、docker、拦截器、中间件，统一出参
6、日志跟踪（winston）

## Project setup

```bash
$ pnpm install
```

## Compile and run the project

```bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
```

## Run tests

```bash
# unit tests
$ pnpm run test

# e2e tests
$ pnpm run test:e2e

# test coverage
$ pnpm run test:cov
```

## 基建

pnpm install -D @commitlint/cli @commitlint/config-angular @commitlint/config-conventional

pnpm install -D @ls-lint/ls-lint

pnpm install -D eslint prettier husky lint-staged

## 日志

pnpm install nest-winston winston winston-daily-rotate-file

日志按日分割

## 对外API

pnpm install swagger-ui-express @nestjs/swagger

## Apollo

参考配置：http://10.1.10.106:8070/config.html?#/appid=webrobot
**具体使用查看datasources/appollo**

## jwt

pnpm install @nestjs/jwt @nestjs/passport passport passport-jwt

## prisma

pnpm install @nestjs/prisma prisma @prisma/client

**Monogodb采用原生的连接方式，不使用prisma。具体使用查看datasources/mongodb**

```js

// 初始化(生成prisma模型定义文件，数据库连接驱动)
npx prisma init

// 迁移数据库 将定义的数据模型迁到数据库中 (以下命令仅适用于关系型数据库mysql等)
pnpm run db:migrate or npx prisma migrate dev --name init

// 生成客户端
pnpm run db:generate or npx prisma generate

// 连接数据库客户端执行数据初始化
pnpm run db:seed

```

**开发环境测试数据库请看：https://confluence.rd.91160.com/pages/viewpage.action?pageId=24790653**
