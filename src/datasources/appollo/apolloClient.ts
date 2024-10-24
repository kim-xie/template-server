import { ApolloClient } from './apollo';
import log from 'loglevel';
import * as fs from 'fs';
import * as path from 'path';

// 设置日志级别
log.setLevel('error');

// 修改 .env 文件的指定键值
function updateEnvFile(key: string, value: string) {
  const envFilePath = path.join(__dirname, '..', '..', '..', '.env');
  const envFileContent = fs.readFileSync(envFilePath, 'utf8');
  const newContent = envFileContent
    .split('\n')
    .map((line) => {
      if (line.startsWith(key)) {
        return `${key}=${value}`;
      }
      return line;
    })
    .join('\n');

  fs.writeFileSync(envFilePath, newContent, 'utf8');
}

// 根据apollo配置设置环境变量
export function setEnv(configs, type, logger) {
  // 获取所有空间的配置
  let config = {
    es: { host: '' },
    mongodb: { username: '', pwd: '', host: '', dbname: '' },
    mysql: { username: '', pwd: '', host: '', dbname: '' },
  };

  // 解析配置
  Object.keys(configs)?.forEach((key) => {
    config = { ...config, ...configs[key]?.configurations };
  });

  const { es, mongodb, mysql } = config;
  // ES
  process.env['ES_HOST'] = es?.host;
  // MONGODB
  process.env['MONGODB_USERNAME'] = mongodb?.username;
  process.env['MONGODB_PASSWORD'] = mongodb?.pwd;
  process.env['MONGODB_HOST'] = mongodb?.host;
  process.env['MONGODB_DBNAME'] = mongodb?.dbname;

  // MYSQL
  process.env['MYSQL_USERNAME'] = mysql?.username;
  process.env['MYSQL_PASSWORD'] = mysql?.pwd;
  process.env['MYSQL_HOST'] = mysql?.host;
  process.env['MYSQL_DBNAME'] = mysql?.dbname;

  if (!es?.host) {
    return;
  }

  if (!mongodb?.host) {
    return;
  }

  if (mysql?.host) {
    const { MYSQL_USERNAME, MYSQL_PASSWORD, MYSQL_HOST, MYSQL_DBNAME } =
      process.env || {};
    if (MYSQL_HOST && !process.env['MYSQL_DATABASE_URL']) {
      const MYSQL_CONNECTSTRING = `mysql://${MYSQL_USERNAME}:${MYSQL_PASSWORD}@${MYSQL_HOST}/${MYSQL_DBNAME}`;
      process.env['MYSQL_DATABASE_URL'] = MYSQL_CONNECTSTRING;
      logger.info(`MYSQL Nodes: ${process.env['MYSQL_DATABASE_URL']}`);
    }
  }

  // if (mongodb?.host) {
  //   const { MONGODB_USERNAME, MONGODB_PASSWORD, MONGODB_HOST, MONGODB_DBNAME } =
  //     process.env || {};
  //   if (MONGODB_HOST && !process.env['MONGODB_DATABASE_URL']) {
  //     logger.info(`MongoDB Nodes: ${MONGODB_HOST}`);
  //     const MONGODB_CONNECTSTRING = `mongodb://${MONGODB_USERNAME}:${MONGODB_PASSWORD}@${MONGODB_HOST}/${MONGODB_DBNAME}?authSource=admin&retryWrites=true`;
  //     process.env['MONGODB_DATABASE_URL'] = MONGODB_CONNECTSTRING;
  //     logger.info(`MongoDB Nodes: ${process.env['MONGODB_DATABASE_URL']}`);
  //   }
  // }

  logger.info(`ApolloClient ${type} done`);
}

// 启动apollo Client
export async function startApolloServer(logger, cb?: () => void) {
  try {
    // apollo客户端实例  host配置：192.168.10.1 apollo-config.91160.com（开发、测试环境）
    const apolloClient = new ApolloClient({
      metaServerUrl: 'http://apollo-config.91160.com',
      clusterName: 'default',
      namespaceList: ['application', 'security'],
      appId: 'webrobot',
      logger: log,
    });

    // 初始化配置
    apolloClient.init().then(() => {
      // 获取所有配置
      const config = apolloClient.getConfigs();
      setEnv(config, 'init', logger);
      // 只在初始化的时候启动监听（避免appollo配置更新导致重复监听）
      cb?.();
    });

    // 监控配置变更
    apolloClient.onChange((config) => {
      setEnv(config, 'onChange', logger);
    });
  } catch (err) {
    console.log('apolloClient error: ', err);
  }
}
