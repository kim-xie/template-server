const mongoose = require('mongoose');

// 建立连接
export function connectMongoDB() {
  const { MONGODB_USERNAME, MONGODB_PASSWORD, MONGODB_HOST, MONGODB_DBNAME } =
    process.env || {};
  console.log('mongodb nodes: ', MONGODB_HOST);
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
      .then(() => console.log('Connected to MongoDB Cluster'))
      .catch((err) => console.error('MongoDB Connection Error: ', err));
  }
}
