import { Inject, Injectable, Logger } from '@nestjs/common';
import { Client } from '@elastic/elasticsearch';
/**
 * ES 图表数据查询 histogram、date_histogram、percentile、percentile_ranks
 */
@Injectable()
export class EsHistogramService {
  private readonly logger = new Logger(EsHistogramService.name);
  constructor(@Inject('ESClient') private readonly es: Client) {}

  /**
   * 直方图
   * @param params
   * @returns
   */
  histogram = async (params: any) => {
    const {
      histogram_name = 'histogram_name',
      hits_size = 0,
      field,
      interval,
      query,
    } = params;
    const body = {
      query,
      size: hits_size,
      aggs: {
        [histogram_name]: {
          histogram: {
            field,
            interval,
          },
        },
      },
    };
    this.logger.log(`es histogram serach params: ${body}`);
    return await this.es.search(body);
  };

  /**
   * 日期直方图
   * @param params
   * @returns
   */
  dateHistogram = async (params: any) => {
    const {
      histogram_name = 'histogram_name',
      hits_size = 0,
      field,
      interval,
      query,
      format = 'YYYY-MM-DD HH:mm:ss',
    } = params;
    const body = {
      query,
      size: hits_size,
      aggs: {
        [histogram_name]: {
          date_histogram: {
            field,
            fixed_interval: interval,
            format,
          },
        },
      },
    };
    this.logger.log(`es date_histogram serach params: ${body}`);
    return await this.es.search(body);
  };

  /**
   * 百分比图
   * @param params
   * @returns
   */
  percentile = async (params: any) => {
    const {
      histogram_name = 'histogram_name',
      hits_size = 0,
      field,
      query,
    } = params;
    const body: any = {
      query,
      size: hits_size,
      aggs: {
        [histogram_name]: {
          percentile: {
            field,
          },
        },
      },
    };
    this.logger.log(`es percentile serach params: ${body}`);
    return await this.es.search(body);
  };
}
