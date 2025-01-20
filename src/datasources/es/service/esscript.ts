import { Injectable, Logger } from '@nestjs/common';
import { GlobalService } from '@src/global/global.service';
/**
 * ES 脚本查询 ctx(执行上下文)
 */
@Injectable()
export class EsScriptService {
  private readonly logger = new Logger(EsScriptService.name);
  constructor(private readonly esService: GlobalService) {}

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
    this.logger.log('es script serach params: ', body);
    return await this.esService.getEs().search(body);
  };
}
