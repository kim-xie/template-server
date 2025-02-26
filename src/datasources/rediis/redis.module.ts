import { Module } from '@nestjs/common';
import { RedisModule } from '@nestjs/redis';
import { RedisService } from './redis.service';

@Module({
  imports: [
    RedisModule.forRoot({
      url: 'redis://localhost:6379',
    }),
  ],
  providers: [RedisService],
  exports: [RedisService],
})
export class RedisModule {}
