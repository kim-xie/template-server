import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class RedisService {
  private readonly logger = new Logger(RedisService.name);
  constructor() {}

  getRedisClient() {
    return '';
  }
}
