import { Inject, Injectable, Logger } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService {
  private readonly logger = new Logger(RedisService.name);
  constructor(@Inject('RedisClient') private readonly redis: Redis) {}

  redisSetDemo() {
    return this.redis.set('key', 'value');
  }

  redisGetDemo() {
    return this.redis.get('key');
  }
}
