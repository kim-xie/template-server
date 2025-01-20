import { Injectable, Logger } from '@nestjs/common';
import { GlobalService } from '@src/global/global.service';
import { connectPrisma } from '@src/datasources/prisma';
import { connectMongoDB } from '@src/datasources/mongodb';
import { connectEs } from '@src/datasources/es';
import {
  APOLLO_HOST,
  APOLLO_CLUSTERNAME,
  APOLLO_NAMESPACELIST,
  APOLLO_APPID,
} from '@src/common/constants';
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

  // 获取es的连接信息
  async getESConnection() {
    const { es } = await this.getApolloConfigs();
    if (!es?.host) {
      return;
    }
    return es?.host;
  }

  // 启动apollo Client
  startApolloServer() {
    try {
      // apollo客户端实例  host配置：192.168.10.1 apollo-config.91160.com（开发、测试环境）
      if (this.apolloClient) {
        return;
      }
      this.apolloClient = new ApolloClient({
        metaServerUrl: APOLLO_HOST,
        clusterName: APOLLO_CLUSTERNAME,
        namespaceList: APOLLO_NAMESPACELIST,
        appId: APOLLO_APPID,
      });
      // 初始化配置
      this.apolloClient.init().then(async () => {
        this.configs = this.apolloClient.getConfigs();
        // 获取所有配置
        this.logger.log(`apolloClient init done`);
        // prisma 连接信息
        const datasourceUrl = await this.getPrismaConnection();
        if (!datasourceUrl) {
          return;
        }
        // mysql数据库连接
        connectPrisma(datasourceUrl, this.logger, (prisma) => {
          this.globalService.setPrisma(prisma);
        });

        // monogo 连接信息
        const monogodbUrl = await this.getMongodbConnection();
        if (!monogodbUrl) {
          return;
        }
        // monogo数据库连接
        await connectMongoDB(monogodbUrl, this.logger);
        // await createUser({ name: 'kim', password: '123456' });

        const esNodes = await this.getESConnection();
        if (!esNodes) {
          return;
        }
        await connectEs(esNodes, this.logger, (es) => {
          this.globalService.setEs(es);
        });
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
