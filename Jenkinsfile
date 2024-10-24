#!/usr/bin/env groovy
@Library('jenkins-shared-library@master') _

// 项目部署路径  template-server为代码仓库名，这里需要跟随项目代码仓库名一致
def deploy_path = '/app/wwwroot/api/node-server/template-server'


def config = [:]
config.put('DEPLOY_PATH', "${deploy_path}")
config.put('NODE_VER', 'v18.17.1')
config.put('PKG_TOOL', 'pnpm')

// 开启以下配置可自动部署到测试环境， 需要测试同意
// config.put('DEPLOY_TEST_ENV', 'true')

vue_build(config)
