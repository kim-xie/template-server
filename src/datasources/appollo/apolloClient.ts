import log from 'loglevel';
import { ApolloClient } from './apollo';

// 设置日志级别
log.setLevel('error');

// 根据apollo配置设置环境变量
export function setEnv(configs, type) {
  // 获取所有空间的配置
  let config = {};
  Object.keys(configs)?.forEach((key) => {
    config = { ...config, ...configs[key]?.configurations };
  });

  const { es, mongodb } = config;
  process.env['ES_HOST'] = es?.host;
  process.env['MONGODB_USERNAME'] = mongodb?.username;
  process.env['MONGODB_PASSWORD'] = mongodb?.pwd;
  process.env['MONGODB_HOST'] = mongodb?.host;
  process.env['MONGODB_DBNAME'] = mongodb?.dbname;

  if (!es?.host) {
    console.log('not found es config');
    return;
  }

  if (!mongodb?.host) {
    console.log('not found mongodb config');
    return;
  }

  console.log(`apolloClient ${type} done`);
}

// 启动apollo Client
export function startApolloServer(cb: () => void) {
  try {
    // apollo客户端实例  host配置：192.168.10.1 apollo-config.91160.com（开发、测试环境）
    const apolloClient = new ApolloClient({
      metaServerUrl: 'http://apollo-config.91160.com',
      clusterName: 'default',
      namespaceList: ['application', 'security'],
      appId: 'webrobot',
      logger: log
    });

    // 初始化配置
    apolloClient.init().then(() => {
      // 获取所有配置
      const config = apolloClient.getConfigs();
      setEnv(config, 'init');

      cb?.();
    });

    // 监控配置变更
    apolloClient.onChange((config: unknown) => {
      setEnv(config, 'onChange');
    });

  } catch (err) {
    console.log('apolloClient error: ', err);
  }
}
