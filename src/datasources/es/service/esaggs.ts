import { Injectable, Logger, Inject } from '@nestjs/common';
import { Client } from '@elastic/elasticsearch';

/**
 * ES 集合查询
 * 分桶聚合：Bucket (分类)
 * 指标聚合：Metrics (avg|max|min|sum|cardinality|value count|stats|top hits)
 * 管道聚合：Pipeline (聚合结果 -> 下个聚合操作)
 */
@Injectable()
export class EsAggsService {
  private readonly logger = new Logger(EsAggsService.name);
  constructor(@Inject('ESClient') private readonly es: Client) {}

  /**
   * 分桶聚合操作
   * @param params
   * @returns
   */
  bucketAggs = async (params: any) => {
    const {
      aggs_name = 'aggs_name',
      hits_size = 0,
      field,
      size = 10,
      order,
      query,
    } = params;
    const body = {
      query,
      size: hits_size,
      aggs: {
        [aggs_name]: {
          terms: {
            field,
            size,
            order,
          },
        },
      },
    };
    this.logger.log(`es bucket serach params: ${body}`);
    return await this.es.search(body);
  };

  /**
   * 指标聚合 metrics可取值(avg、max、min、sum、value_count、stats(全统计)、cardinality(去重))
   * @param params
   * @returns
   */
  metricsAggs = async (params: any) => {
    const {
      aggs_name = 'aggs_name',
      hits_size = 0,
      field,
      size = 10,
      order,
      query,
      metrics = 'avg',
    } = params;
    const body = {
      query,
      size: hits_size,
      aggs: {
        [aggs_name]: {
          [metrics]: {
            field,
            size,
            order,
          },
        },
      },
    };
    this.logger.log(`es metrics serach params: ${body}`);
    return await this.es.search(body);
  };

  /**
   * 管道聚合
   * @param params
   * @returns
   */
  pipelineAggs = async (params: any) => {
    const {
      aggs_name = 'aggs_name',
      hits_size = 0,
      field,
      size = 10,
      order,
      aggs_name2 = 'aggs_name2',
      field2,
      size2 = 10,
      order2,
      metrics2 = 'avg',
      query,
      metrics = 'avg',
    } = params;
    const body = {
      query,
      size: hits_size,
      aggs: {
        [aggs_name]: {
          [metrics]: {
            field,
            size,
            order,
          },
          aggs: {
            [aggs_name2]: {
              [metrics2]: {
                field2,
                size2,
                order2,
              },
            },
          },
        },
      },
    };
    this.logger.log(`es pipeline serach params: ${body}`);
    return await this.es.search(body);
  };
}
