const mongoose = require('mongoose');

// 建立连接
export function connectMongoDB(connectUrl, logger) {
  let MONGODB_CONNECTSTRING = connectUrl;
  if (!MONGODB_CONNECTSTRING) {
    const { MONGODB_USERNAME, MONGODB_PASSWORD, MONGODB_HOST, MONGODB_DBNAME } =
      process.env || {};
    MONGODB_CONNECTSTRING = `mongodb://${MONGODB_USERNAME}:${MONGODB_PASSWORD}@${MONGODB_HOST}/${MONGODB_DBNAME}?retryWrites=true`;
  }
  if (MONGODB_CONNECTSTRING) {
    process.env['MONGODB_DATABASE_URL'] = MONGODB_CONNECTSTRING;
    // Mongodb v3.2.22 mongoose v5.5
    mongoose
      .connect(MONGODB_CONNECTSTRING, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        serverSelectionTimeoutMS: 30000,
      })
      .then(() =>
        logger.log(`Connected to MongoDB Cluster: ${MONGODB_CONNECTSTRING}`),
      )
      .catch((err) => logger.error(`MongoDB Connection Error: ${err}`));
  }
}
