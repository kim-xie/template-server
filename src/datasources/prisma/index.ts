import { PrismaClient } from '@prisma/client';
// 动态连接
export const connectPrisma = (datasourceUrl, logger, cb) => {
  try {
    // mysql数据库连接
    const prisma = new PrismaClient({
      datasourceUrl,
      log: ['query', 'info', 'warn', 'error'],
    });
    logger.log(`Prisma Connected to Database: ${datasourceUrl}`);
    cb?.(prisma);
  } catch (err) {
    logger.error(`Prisma Connected to Database is error: ${err}`);
  }
};
