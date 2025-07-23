import { Module } from '@nestjs/common';
import { WechatRobotService } from './wechatRobot.service';
import { WechatRobotController } from './wechatRobot.controller';

@Module({
  providers: [WechatRobotService],
  controllers: [WechatRobotController],
})
export class WechatRobotModule {}
