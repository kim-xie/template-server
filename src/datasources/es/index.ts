import { Client } from '@elastic/elasticsearch';
// 动态连接
export const connectEs = async (nodes, logger, cb) => {
  try {
    if (!nodes) {
      logger.error('not found ES nodes');
      return;
    }
    // 创建 Elasticsearch 客户端
    const esClient = await new Client({ nodes: nodes?.split(',') });
    logger.log(`Connected to the ES: ${nodes}`);
    cb?.(esClient);
  } catch (err) {
    logger.error(`Connected to the ES is error: ${err}`);
  }
};
