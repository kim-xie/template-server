const mongoose = require('mongoose');

// 建立连接
export function connectMongoDB(logger) {
  const { MONGODB_USERNAME, MONGODB_PASSWORD, MONGODB_HOST, MONGODB_DBNAME } =
    process.env || {};
  logger.info(`MongoDB Nodes: ${MONGODB_HOST}`);
  if (MONGODB_HOST) {
    const MONGODB_CONNECTSTRING = `mongodb://${MONGODB_USERNAME}:${MONGODB_PASSWORD}@${MONGODB_HOST}/${MONGODB_DBNAME}?authSource=admin&retryWrites=true`;
    process.env['MONGODB_DATABASE_URL'] = MONGODB_CONNECTSTRING;
    // Mongodb v3.2.22 mongoose v5.5
    mongoose
      .connect(MONGODB_CONNECTSTRING, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        serverSelectionTimeoutMS: 30000,
      })
      .then(() => logger.info('Connected to MongoDB Cluster'))
      .catch((err) => logger.error('MongoDB Connection Error: ', err));
  }
}
