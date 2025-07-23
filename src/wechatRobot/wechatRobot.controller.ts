import { Controller, Get, Post, Body } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { WechatRobotService } from './wechatRobot.service';

@ApiTags('微信机器人模块')
@Controller('wechatRobot')
export class WechatRobotController {
  constructor(private readonly wechatRobotService: WechatRobotService) {}

  @Get('/start')
  @ApiOperation({ summary: '启动微信机器人' })
  @ApiResponse({
    status: 200,
    description: '启动微信机器人',
  })
  async start() {
    return this.wechatRobotService.start();
  }

  @Get('/stop')
  @ApiOperation({ summary: '关闭微信机器人' })
  @ApiResponse({
    status: 200,
    description: '关闭微信机器人',
  })
  async stop() {
    return this.wechatRobotService.stop();
  }

  @Post('sendMessage')
  @ApiOperation({ summary: '发送消息' })
  @ApiResponse({
    status: 200,
    description: '发送消息成功',
  })
  async sendMessage(
    @Body()
    msgInfo: {
      who: string; // 接收人 可以是 wxid 或者 roomid
      msg: string; // 消息内容
      mentionIdList: string[]; // 提醒列表
      type: string; // 消息类型
    },
  ) {
    return await this.wechatRobotService.sendMessage(msgInfo);
  }
}
