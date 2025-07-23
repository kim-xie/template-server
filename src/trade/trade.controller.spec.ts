import { Test, TestingModule } from '@nestjs/testing';
import { TradeController } from './trade.controller';

describe('TradeController', () => {
  let controller: TradeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TradeController],
    }).compile();

    controller = module.get<TradeController>(TradeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
