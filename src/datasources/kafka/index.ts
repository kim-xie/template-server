import { Kafka } from 'kafkajs';
// 建立连接
export function connectKafka(kafkaInfo, logger, cb) {
  try {
    const { clientId, brokers, groupId } = kafkaInfo || {};
    const kafka = new Kafka({
      clientId,
      brokers: brokers.split(','),
    });
    logger.log(`Connected to Kafka: ${brokers.split(',')}`);
    cb?.(kafka, groupId || clientId);
  } catch (err) {
    logger.error(`Connected to Kafka is error: ${err}`);
  }
}
