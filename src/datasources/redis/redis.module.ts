import { Module, Global } from '@nestjs/common';
import { RedisService } from './redis.service';
import { ApolloConfigService } from '../appollo/apolloClient.service';
import { connectRedis } from './index';

@Global()
@Module({
  providers: [
    {
      provide: 'RedisClient',
      inject: [ApolloConfigService],
      useFactory: async (apolloConfigService: ApolloConfigService) => {
        // 读取apollo配置
        const redisConnectInfo = await apolloConfigService.getRedisConnection();
        const redisClient = await connectRedis(redisConnectInfo);
        return redisClient;
      },
    },
    RedisService,
  ],
  exports: [RedisService, 'RedisClient'],
})
export class RedisModule {}
