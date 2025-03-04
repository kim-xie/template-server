import { Logger } from '@nestjs/common';
import { Client } from '@elastic/elasticsearch';
const connectLogger = new Logger('connectEs');
// 动态连接
export const connectEs = async (nodes, logger = connectLogger, cb = null) => {
  try {
    if (!nodes) {
      logger.error('Not Found ES Nodes');
      return;
    }
    // 创建 Elasticsearch 客户端
    const esClient = await new Client({ nodes: nodes?.split(',') });
    logger.log(`Connected to ES: ${nodes}`);
    cb?.(esClient);
    return esClient;
  } catch (err) {
    logger.error(`Connected to ES is error: ${err}`);
  }
};
