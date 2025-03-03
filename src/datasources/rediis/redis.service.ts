import { Injectable, Logger } from '@nestjs/common';
import { GlobalService } from '@src/global/global.service';

@Injectable()
export class RedisService {
  private readonly logger = new Logger(RedisService.name);
  constructor(private readonly globalService: GlobalService) {}

  getRedisClient() {
    return this.globalService.getRedis();
  }
}
