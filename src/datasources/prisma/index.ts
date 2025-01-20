import { PrismaClient } from '@prisma/client';
// 动态连接
export const connectPrisma = (datasourceUrl, logger, cb) => {
  try {
    // mysql数据库连接
    const prisma = new PrismaClient({
      datasourceUrl,
      log: ['query', 'info', 'warn', 'error'],
    });
    logger.log(`Prisma connected to the database: ${datasourceUrl}`);
    cb?.(prisma);
  } catch (err) {
    logger.error(`Prisma connected to the database is error: ${err}`);
  }
};
