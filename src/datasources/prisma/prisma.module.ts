import { Module, Global } from '@nestjs/common';
import { ApolloConfigService } from '../appollo/apolloClient.service';
import { connectPrisma } from './index';

/**
 * 异步提供器
 *    使用方式如下：
 *        constructor(@Inject('PrismaClient') private prisma: PrismaClient) {}
 */
@Global()
@Module({
  providers: [
    {
      provide: 'PrismaClient',
      inject: [ApolloConfigService],
      useFactory: async (apolloConfigService: ApolloConfigService) => {
        // 读取apollo配置
        const datasourceUrl = await apolloConfigService.getPrismaConnection();
        const prisma = await connectPrisma(datasourceUrl);
        return prisma;
      },
    },
  ],
  exports: ['PrismaClient'],
})
export class PrismaModule {}
