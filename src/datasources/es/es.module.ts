import { Module, Global } from '@nestjs/common';
import { EsService } from './es.service';
import { EsAggsService } from './service/esaggs';
import { EsBaseService } from './service/esbase';
import { EsHistogramService } from './service/eshistogram';
import { EsScriptService } from './service/esscript';
import { ApolloConfigService } from '../appollo/apolloClient.service';
import { connectEs } from './index';

@Global()
@Module({
  providers: [
    EsService,
    EsAggsService,
    EsBaseService,
    EsHistogramService,
    EsScriptService,
    {
      provide: 'ESClient',
      inject: [ApolloConfigService],
      useFactory: async (apolloConfigService: ApolloConfigService) => {
        // 读取apollo配置
        const datasourceUrl = await apolloConfigService.getESConnection();
        const esClient = await connectEs(datasourceUrl);
        return esClient;
      },
    },
  ],
  exports: [EsService, 'ESClient'],
})
export class EsModule {}
