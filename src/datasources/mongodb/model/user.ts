import * as mongoose from 'mongoose';

// UserSchema
const userSchema = new mongoose.Schema(
  {
    name: String,
    password: String,
  },
  { timestamps: true },
);

// 创建模型
export default mongoose.model('User', userSchema, 'user');
