import { Injectable, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { GlobalService } from '@src/global/global.service';
import { connectMongoDB } from '@src/datasources/mongodb';
import { ApolloClient } from './apollo';
// import { createUser } from '@src/datasources/mongodb/service/user';
@Injectable()
export class ApolloConfigService {
  private readonly logger = new Logger(ApolloConfigService.name);
  private apolloClient;
  private configs;
  constructor(private readonly globalService: GlobalService) {
    this.startApolloServer();
  }
  // 读取Apollo配置
  async getApolloConfigs() {
    const configs =
      this.configs || (await this.apolloClient.getConfigs()) || {};
    let config = {
      es: { host: '' },
      mongodb: { username: '', pwd: '', host: '', dbname: '' },
      mysql: { username: '', pwd: '', host: '', dbname: '', robot: {} },
    };
    // 解析配置
    Object.keys(configs)?.forEach((key) => {
      config = { ...config, ...configs[key]?.configurations };
    });

    // this.logger.log(`ApolloConfigs: ${JSON.stringify(config)}`);

    return config;
  }

  // 获取prisma的连接信息
  async getPrismaConnection() {
    const { mysql } = await this.getApolloConfigs();
    if (!mysql) {
      return;
    }
    const { host, username, pwd, dbname } = mysql;
    const MONGODB_CONNECTION_STRING = `mysql://${username}:${pwd}@${host}/${dbname}?useUnicode=true&characterEncoding=utf8&zeroDateTimeBehavior=convertToNull&allowMultiQueries=true`;
    // this.logger.log(`MONGODB_CONNECTION_STRING: ${MONGODB_CONNECTION_STRING}`);
    return MONGODB_CONNECTION_STRING;
  }

  // 获取mogodb的连接信息
  async getMongodbConnection() {
    const { mongodb } = await this.getApolloConfigs();
    if (!mongodb) {
      return;
    }
    const { host, username, pwd, dbname } = mongodb;

    const MONGODB_CONNECTION_STRING = `mongodb://${username}:${pwd}@${host}/${dbname}?retryWrites=true`;
    // this.logger.log(`MONGODB_CONNECTION_STRING: ${MONGODB_CONNECTION_STRING}`);
    return MONGODB_CONNECTION_STRING;
  }

  // 启动apollo Client
  startApolloServer() {
    try {
      // apollo客户端实例  host配置：192.168.10.1 apollo-config.91160.com（开发、测试环境）
      this.apolloClient = new ApolloClient({
        metaServerUrl: 'http://apollo-config.91160.com',
        clusterName: 'default',
        namespaceList: ['application', 'security'],
        appId: 'intranet-bff',
      });
      // 初始化配置
      this.apolloClient.init().then(async () => {
        this.configs = this.apolloClient.getConfigs();
        // 获取所有配置
        this.logger.log(`apolloClient init done`);
        const datasourceUrl = await this.getPrismaConnection();
        if (!datasourceUrl) {
          return;
        }
        try {
          // mysql数据库连接
          const prisma = new PrismaClient({
            datasourceUrl,
            log: ['query', 'info', 'warn', 'error'],
          });
          this.logger.log(`Prisma connected to the database: ${datasourceUrl}`);
          this.globalService.setPrisma(prisma);
        } catch (err) {
          this.logger.error(
            `Prisma connected to the database is error: ${err}`,
          );
        }

        const monogodbUrl = await this.getMongodbConnection();
        if (!monogodbUrl) {
          return;
        }
        // monogo数据库连接
        await connectMongoDB(monogodbUrl, this.logger);
        // await createUser({ name: 'kim', password: '123456' });
      });

      // 监控配置变更
      this.apolloClient.onChange((config) => {
        this.configs = config;
        // this.logger.log(`apolloClient config changed done`);
      });
    } catch (err) {
      this.logger.log(`apolloClient connect error: ${err}`);
    }
  }
}
