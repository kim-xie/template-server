import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaService.name);
  constructor() {
    super({
      log: ['query', 'info', 'warn', 'error'],
    });
  }

  async onModuleInit() {
    await this.$connect(); // 连接数据库
    this.logger.log(`Connected to the database`);
  }

  async onModuleDestroy() {
    await this.$disconnect(); // 断开连接
    this.logger.log('Disconnected from the database');
  }
}
