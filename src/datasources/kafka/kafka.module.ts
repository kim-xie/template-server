import { Global, Module } from '@nestjs/common';
import { KafkaService } from './kafka.service';
import { ApolloConfigService } from '../appollo/apolloClient.service';
import { connectKafka } from './index';

@Global()
@Module({
  providers: [
    {
      provide: 'KafkaClient',
      inject: [ApolloConfigService],
      useFactory: async (apolloConfigService: ApolloConfigService) => {
        // 读取apollo配置
        const kafkaConnectInfo = await apolloConfigService.getKafkaConnection();
        const kafkaClient = await connectKafka(kafkaConnectInfo);
        return kafkaClient;
      },
    },
    KafkaService,
  ],
  exports: [KafkaService, 'KafkaClient'],
})
export class KafkaModule {}
