import { Test, TestingModule } from '@nestjs/testing';
import { WechatRobotService } from './wechatRobot.service';

describe('WechatRobotService', () => {
  let service: WechatRobotService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WechatRobotService],
    }).compile();

    service = module.get<WechatRobotService>(WechatRobotService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
