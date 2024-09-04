import { Module, Global } from '@nestjs/common';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { EsService } from './es.service';
import { EsAggsService } from './service/esaggs';
import { EsBaseService } from './service/esbase';
import { EsHistogramService } from './service/eshistogram';
import { EsScriptService } from './service/esscript';

@Global()
@Module({
  imports: [
    ElasticsearchModule.registerAsync({
      useFactory: () => ({
        node: 'http://49.234.134.123:9200',
      }),
    }),
  ],
  providers: [
    EsService,
    EsAggsService,
    EsBaseService,
    EsHistogramService,
    EsScriptService,
  ],
  exports: [EsService],
})
export class EsModule {}
