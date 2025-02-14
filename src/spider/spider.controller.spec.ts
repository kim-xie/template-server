import { Test, TestingModule } from '@nestjs/testing';
import { SpiderController } from './spider.controller';

describe('SpiderController', () => {
  let controller: SpiderController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SpiderController],
    }).compile();

    controller = module.get<SpiderController>(SpiderController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
