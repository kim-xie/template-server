import { ElasticsearchService } from '@nestjs/elasticsearch';
import { Injectable, Logger } from '@nestjs/common';

/**
 * ES 脚本查询 ctx(执行上下文)
 */
@Injectable()
export class EsScriptService {
  private readonly logger: Logger = new Logger();
  constructor(private readonly esService: ElasticsearchService) {}

  /**
   * es 自定义脚本
   * @param params
   * @returns
   */
  script = async (params: any) => {
    const {
      script_params,
      script_source,
      lang = 'javascript',
      ...esQuerys
    } = params;
    const body = {
      script: {
        lang,
        source: `ctx.${script_source}`,
        params: script_params,
      },
      ...esQuerys,
    };
    this.logger.log('script serach params: ', body);
    return await this.esService.search(body);
  };
}
