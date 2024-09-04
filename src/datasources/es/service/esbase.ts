import { ElasticsearchService } from '@nestjs/elasticsearch';
import { Injectable, Logger } from '@nestjs/common';

/**
 * es api:
 * https://www.elastic.co/guide/en/elasticsearch/reference/8.2/docs.html
 */
@Injectable()
export class EsBaseService {
  private readonly logger: Logger = new Logger();
  private readonly esPrefix = 'fed-monitor';
  constructor(private readonly esService: ElasticsearchService) {}

  // 获取es服务
  getEsClient() {
    return this.esService;
  }

  // 添加
  async create(params: any) {
    return await this.esService.create(params);
  }

  // 更新
  async update(params: any) {
    return await this.esService.update(params);
  }

  // 删除
  async delete(params: any) {
    return await this.esService.delete(params);
  }

  // 添加、修改、删除数据
  async bulk(params: any) {
    return await this.esService.bulk(params);
  }

  // 查询数据
  async search(params: any) {
    return await this.esService.search(params);
  }

  // 批查询
  async msearch(params: any) {
    return await this.esService.msearch(params);
  }

  // 查询
  async get(params: any) {
    return await this.esService.get(params);
  }

  // 批操作
  async mget(params: any) {
    return await this.esService.mget(params);
  }

  // 查询数量
  async count(params: any) {
    return await this.esService.count(params);
  }

  /**
   * 字段转keyword
   * @param field
   * @returns
   */
  fieldToKeyWord(field: string) {
    if (field && !field.endsWith('.keyword')) {
      return field + '.keyword';
    }
    return field;
  }

  /**
   * keyword to field
   * @param field
   * @returns
   */
  keyWordToField(field: string) {
    if (field && field.endsWith('.keyword')) {
      return field.replace('.keyword', '');
    }
    return field;
  }
}
