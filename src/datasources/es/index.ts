import { Client } from '@elastic/elasticsearch';
// 动态连接
export const connectEs = async (nodes, logger, cb) => {
  try {
    if (!nodes) {
      logger.error('not found es nodes');
      return;
    }
    // 创建 Elasticsearch 客户端
    const esClient = await new Client({ nodes: nodes?.split(',') });
    logger.log(`connected to the es: ${nodes}`);
    cb?.(esClient);
  } catch (err) {
    logger.error(`connected to the es is error: ${err}`);
  }
};
