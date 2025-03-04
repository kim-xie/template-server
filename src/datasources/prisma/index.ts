import { Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
const connectLogger = new Logger('connectPrisma');
// 动态连接
export const connectPrisma = async (
  datasourceUrl,
  logger = connectLogger,
  cb = null,
) => {
  try {
    if (!datasourceUrl) {
      logger.error('Not Found Prisma DatasourceUrl');
      return;
    }
    // mysql数据库连接
    const prisma = new PrismaClient({
      datasourceUrl,
      log: ['query', 'info', 'warn', 'error'],
    });
    await prisma.$connect().catch((err) => {
      logger.error(`Prisma Connected to Database is error: ${err}`);
    });
    logger.log(`Prisma Connected to Database: ${datasourceUrl}`);
    cb?.(prisma);
    return prisma;
  } catch (err) {
    logger.error(`Prisma Connected to Database is error: ${err}`);
  }
};
