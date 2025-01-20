import { Injectable, Logger } from '@nestjs/common';
import { EsBaseService } from './service/esbase';
import { EsAggsService } from './service/esaggs';
import { EsHistogramService } from './service/eshistogram';
import { EsScriptService } from './service/esscript';
import dayjs from '@src/utils/dateUtil';

/**
 * es api:
 * https://www.elastic.co/guide/en/elasticsearch/reference/8.2/docs.html
 */
@Injectable()
export class EsService {
  private readonly logger = new Logger(EsService.name);
  private readonly esPrefix = 'fed-monitor';
  constructor(
    private readonly esBaseService: EsBaseService,
    private readonly esAggsService: EsAggsService,
    private readonly esHistogramService: EsHistogramService,
    private readonly esScriptService: EsScriptService,
  ) {}

  // 获取es服务
  getEsClient() {
    return this.esBaseService;
  }

  // 添加
  async create(params: any) {
    return await this.esBaseService.create(params);
  }

  // 更新
  async update(params: any) {
    return await this.esBaseService.update(params);
  }

  // 删除
  async delete(params: any) {
    return await this.esBaseService.delete(params);
  }

  // 添加、修改、删除数据
  async bulk(params: any) {
    return await this.esBaseService.bulk(params);
  }

  // 查询数据
  async search(params: any) {
    return await this.esBaseService.search(params);
  }

  // 批查询
  async msearch(params: any) {
    return await this.esBaseService.msearch(params);
  }

  // 查询精准数据
  async get(params: any) {
    return await this.esBaseService.get(params);
  }

  // 批操作
  async mget(params: any) {
    return await this.esBaseService.mget(params);
  }

  // 查询数量
  async count(params: any) {
    return await this.esBaseService.count(params);
  }

  // 分桶聚合操作
  async bucketAggs(params: any) {
    return await this.esAggsService.bucketAggs(params);
  }

  // 指标聚合操作
  async metricsAggs(params: any) {
    return await this.esAggsService.metricsAggs(params);
  }

  // 管道聚合操作
  async pipelineAggs(params: any) {
    return await this.esAggsService.pipelineAggs(params);
  }

  // 直方图表数据查询操作
  async histogram(params: any) {
    return await this.esHistogramService.histogram(params);
  }

  // 日期直方图表数据查询操作
  async dateHistogram(params: any) {
    return await this.esHistogramService.dateHistogram(params);
  }

  // 百分比图表数据查询操作
  async percentile(params: any) {
    return await this.esHistogramService.percentile(params);
  }

  // 自定义脚本查询
  async script(params: any) {
    return await this.esScriptService.script(params);
  }

  /**
   * 字段转keyword
   * @param field
   * @returns
   */
  fieldToKeyWord(field: string) {
    return this.esBaseService.fieldToKeyWord(field);
  }

  /**
   * keyword to field
   * @param field
   * @returns
   */
  keyWordToField(field: string) {
    return this.esBaseService.keyWordToField(field);
  }

  /**
   * 获取es索引
   * @param params
   * @returns
   */
  getEsIndex(params: any) {
    const {
      apiKey = '',
      date = dayjs().format('YYYYMMDD'),
      category = '',
      type = '',
      subType = '',
    } = params;

    if (!apiKey) {
      this.logger.error('apiKey is required');
      return;
    }

    if (!category) {
      this.logger.error('category is required');
      return;
    }

    if (!type) {
      this.logger.error('type is required');
      return;
    }

    let index = `${
      this.esPrefix
    }-app${apiKey}-${date}-${category.toLowerCase()}-${type.toLowerCase()}`;

    if (subType) {
      index += `-${subType.toLowerCase()}`;
    }

    return index;
  }

  /**
   * 分页查询
   * @param params
   * @returns
   */
  async searchBy(params: any) {
    const timeFormat = 'YYYYMMDD';
    const {
      category,
      type,
      subType = '*',
      apiKey,
      pageNo,
      pageSize,
      source = [],
      startTime = dayjs().format(timeFormat),
      endTime = dayjs().format(timeFormat),
      ...rest
    } = params;

    this.logger.log('------es search params------' + params);

    let date: string | string[] = endTime;
    let index = [];

    // 起始时间
    if (startTime && endTime && startTime !== endTime) {
      const day = dayjs(endTime).diff(startTime, 'day');
      const dateArr = [];
      for (let i = 0; i <= day; i++) {
        dateArr.push(dayjs(startTime).add(i, 'day').format(timeFormat));
      }
      date = dateArr;
    }

    if (type && Array.isArray(type)) {
      if (date && Array.isArray(date)) {
        index = date.map((item) => {
          return type.map((ty) => {
            const index = this.getEsIndex({
              apiKey,
              date: item,
              category,
              type: ty,
              subType,
            });
            return index;
          });
        });
      } else {
        index = type.map((ty) => {
          const index = this.getEsIndex({
            apiKey,
            date,
            category,
            type: ty,
            subType,
          });
          return index;
        });
      }
    } else {
      if (date && Array.isArray(date)) {
        index = date.map((item) => {
          return this.getEsIndex({
            apiKey,
            date: item,
            category,
            type,
            subType,
          });
        });
      } else {
        index = [
          this.getEsIndex({
            apiKey,
            date,
            category,
            type,
            subType,
          }),
        ];
      }
    }

    this.logger.log('es search index: ' + index);

    if (!index) {
      this.logger.error('index can not be empty index = ' + index);
      return;
    }

    const from = pageNo > 0 ? pageNo - 1 : 0;
    const size = pageSize || 10;

    const body = this.assembleSearchBody(rest);

    const searchDatas: any = await this.search({
      index,
      body,
      from,
      size,
      _source: source,
      sort: 'data.timestamp:desc',
      ignore_unavailable: true,
      allow_no_indices: true,
    });

    const resultObj = {
      total: searchDatas?.hits.total.value || 0,
      list: searchDatas?.hits.hits || [],
      pageNo: from + 1,
      pageSize: size,
    };

    this.logger.log('es search result: ' + JSON.stringify(resultObj));

    return resultObj;
  }

  /**
   * 组装查询参数
   * @param searchParams
   * @returns
   */
  assembleSearchBody(searchParams: Record<string, any>) {
    const keys = Object.keys(searchParams);
    if (!keys.length) {
      return {};
    }

    const queryKeysList = [
      'apiEnv',
      'request.url',
      'response.status',
      'response.errorCode',
      'response.data',
      'userId',
      'pageUrl',
      'level',
    ];

    const body = {
      query: {
        bool: {
          must: [],
        },
      },
    };

    if (searchParams?.apiKey) {
      body.query.bool.must.push({
        match_phrase: {
          'authInfo.apiKey.keyword': searchParams.apiKey,
        },
      });
    }

    keys.forEach((key: string) => {
      if (searchParams[key] && queryKeysList.includes(key)) {
        body.query.bool.must.push({
          match_phrase: {
            [['apiEnv', 'userId'].includes(key)
              ? `authInfo.${key}.keyword`
              : key === 'ip'
                ? `clientInfo.${key}`
                : `data.${key}`]: searchParams[key],
          },
        });
      }
    });

    return body;
  }

  // 查询数量
  async getCount(params: any) {
    const { date, category, type, subType } = params;
    const index = this.getEsIndex({ date, category, type, subType });
    if (!index) {
      this.logger.error('index can not be empty index = ' + index);
      return;
    }
    return await this.count({
      index,
      body: {
        query: {
          match_all: {},
        },
      },
    });
  }
}
