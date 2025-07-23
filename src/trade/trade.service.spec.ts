import { Test, TestingModule } from '@nestjs/testing';
import { TradeService } from './trade.service';

describe('TradeService', () => {
  let service: TradeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TradeService],
    }).compile();

    service = module.get<TradeService>(TradeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
