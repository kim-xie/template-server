# 服务端通用脚手架

## 技术栈

nestjs + typescript + pnpm

## 功能列表

1、jwt 授权登录
2、swagger api 文档生成

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

## 对外API

pnpm install swagger-ui-express @nestjs/swagger

## Apollo
