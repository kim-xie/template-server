import Redis from 'ioredis';
// 动态连接
export const connectRedis = async (nodes, logger, cb) => {
  if (!nodes) {
    logger.error('not found Redis nodes');
    return;
  }
  // Connect to 127.0.0.1:6380, db 4, using password "authpassword"
  // redis://username:authpassword@127.0.0.1:6380/4
  //   const redisClient = new Redis(nodes);
  //   const redisClient = new Redis.Cluster(
  //     [
  //       { host: '10.0.11.10', port: 6379 },
  //       { host: '10.0.11.11', port: 6379 },
  //     ],
  //     {
  //       redisOptions: {
  //         password: nodes.pwd,
  //       },
  //     },
  //   );

  const { host } = nodes;
  const sentinels = host?.split(',')?.map((item) => {
    const [host, port] = item.split(':');
    return {
      host,
      port,
    };
  });

  // 哨兵模式示例
  const redisClient = new Redis({
    sentinels: sentinels,
    name: nodes.sentinels, // 需与哨兵配置的主节点名称一致
    password: nodes.pwd, // 主节点密码
    db: nodes.dbname, // db
  });
  redisClient.on('connect', () => {
    logger.log(`Connected to Redis: ${JSON.stringify(sentinels)}`);
    cb?.(redisClient);
  });

  redisClient.on('error', (error) => {
    logger.error(`Connected to Redis is error: ${error}`);
  });
};
