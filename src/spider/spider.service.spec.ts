import { Test, TestingModule } from '@nestjs/testing';
import { SpiderService } from './spider.service';

describe('SpiderService', () => {
  let service: SpiderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SpiderService],
    }).compile();

    service = module.get<SpiderService>(SpiderService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
