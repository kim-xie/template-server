import { Logger } from '@nestjs/common';
import { Kafka } from 'kafkajs';
const connectLogger = new Logger('connectKafka');
// 建立连接
export async function connectKafka(
  kafkaInfo,
  logger = connectLogger,
  cb = null,
) {
  try {
    // brokers 格式：ip:9200,ip:9200,ip:9200
    const { clientId, brokers, groupId } = kafkaInfo || {};
    if (!clientId || !brokers) {
      logger.error('Not Found Kafka Connect Info');
      return;
    }
    const kafka = await new Kafka({
      clientId,
      brokers: brokers.split(','),
    });
    logger.log(`Connected to Kafka: ${brokers.split(',')}`);
    cb?.(kafka, groupId || clientId);
    process.env.KafkaGroupId = groupId || clientId;
    return kafka;
  } catch (err) {
    logger.error(`Connected to Kafka is error: ${err}`);
  }
}
