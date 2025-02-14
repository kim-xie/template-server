import { Controller, Get, Param, Query } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';
import { SpiderService } from './spider.service';
import {
  startSchedule,
  closeSchedule,
  getSchedules,
} from '@src/utils/scheduler';

@ApiTags('爬虫模块')
@Controller('spider')
export class SpiderController {
  constructor(private readonly spiderService: SpiderService) {}

  @Get('/start')
  @ApiOperation({ summary: '启动单次爬虫' })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: String,
    description: '每个平台爬取的消息条数, 默认为3',
  })
  @ApiQuery({
    name: 'robot',
    required: false,
    type: String,
    description: '要推送到的机器人ID',
  })
  @ApiResponse({
    status: 200,
    description: '爬虫',
  })
  async getJueJinNews(
    @Query('limit') limit: string,
    @Query('robot') robot: string,
  ) {
    return await this.spiderService.getSpiderNews(+limit, robot);
  }

  @Get('startSchduler')
  @ApiOperation({ summary: '启动调度器爬虫' })
  @ApiQuery({
    name: 'name',
    required: true,
    type: String,
    description: '调度器名称,避免重名覆盖',
  })
  @ApiQuery({
    name: 'rule',
    required: true,
    type: String,
    description: '调度规则，采用corn表达式，例如每分钟执行一次：*/1 * * * *',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: String,
    description: '每个平台爬取的消息条数, 默认为3',
  })
  @ApiQuery({
    name: 'robot',
    required: false,
    type: String,
    description: '要推送到的机器人ID',
  })
  async startSchduler(
    @Query('name') name: string,
    @Query('rule') rule: string,
    @Query('limit') limit: string,
    @Query('robot') robot: string,
  ) {
    const schedules = await getSchedules();
    if (schedules.some((schedule) => schedule === name)) {
      return { code: 0, message: '存在重复的调度器' };
    }
    await startSchedule(
      () => {
        this.spiderService.getSpiderNews(+limit, robot);
      },
      rule || '0 0 8 * * 1-5',
      name || 'front_end_spider',
    );
  }

  @Get('stopSchduler/:name')
  @ApiOperation({ summary: '停止某个调度器' })
  @ApiParam({
    name: 'name',
    required: true,
    type: String,
    description: '调度器名称',
  })
  async stopSchduler(@Param('name') name: string) {
    await closeSchedule(name);
    return await getSchedules();
  }

  @Get('schdulers')
  @ApiOperation({ summary: '查询所有调度器' })
  async schdulers() {
    return await getSchedules();
  }

  @Get('keywords')
  @ApiOperation({ summary: '查询所有爬虫关键词' })
  async getKeywords() {
    return this.spiderService.getKeywords();
  }

  @Get('keywords/:keyword')
  @ApiOperation({ summary: '设置爬虫关键词' })
  @ApiParam({
    name: 'keyword',
    required: true,
    type: String,
    description: '关键词，设置多个用逗号分隔，如：性能,前端',
  })
  async setKeywords(@Param('keyword') keyword: string) {
    return this.spiderService.setKeywords(keyword);
  }

  @Get('delkeywords/:keyword')
  @ApiOperation({ summary: '删除爬虫关键词' })
  @ApiParam({
    name: 'keyword',
    required: true,
    type: String,
    description: '关键词，删除多个用逗号分隔，如：性能,前端',
  })
  async delkeywords(@Param('keyword') keyword: string) {
    return this.spiderService.delKeyword(keyword);
  }

  @Get('subscribes')
  @ApiOperation({ summary: '查询所有订阅' })
  async getSubscribes() {
    return this.spiderService.getSubscribes();
  }

  @Get('delSubscribe/:keyword')
  @ApiOperation({ summary: '删除某个订阅' })
  @ApiParam({
    name: 'keyword',
    required: true,
    type: String,
    description: '要删除的列表中的key，如：csdnUrl',
  })
  async delSubscribe(@Param('keyword') keyword: string) {
    return this.spiderService.delSubscribes(keyword);
  }

  @Get('restoreSubscribes')
  @ApiOperation({ summary: '还原所有订阅' })
  async restoreSubscribes() {
    return this.spiderService.restoreSubscribes();
  }
}
