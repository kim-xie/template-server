import { Module, Global } from '@nestjs/common';
import { ApolloConfigService } from '../appollo/apolloClient.service';
import { connectMongoDB } from './index';

@Global()
@Module({
  providers: [
    {
      provide: 'MongoDBClient',
      inject: [ApolloConfigService],
      useFactory: async (apolloConfigService: ApolloConfigService) => {
        // 读取apollo配置
        const mongoConnectInfo =
          await apolloConfigService.getMongodbConnection();
        const mongoClient = await connectMongoDB(mongoConnectInfo);
        return mongoClient;
      },
    },
  ],
  exports: ['MongoDBClient'],
})
export class MongoDBModule {}
