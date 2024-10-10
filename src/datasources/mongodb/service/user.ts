import UserSchema from '../model/user';

// 入库
export function createUser(data) {
  return new Promise((resolve, reject) => {
    try {
      const userModal = new UserSchema({ ...data });
      userModal.save((err, data) => {
        mongodbRes(err, data, resolve, reject, 'save');
      });
    } catch (err) {
      reject(err);
    }
  });
}

// 查询全部
export function findAllUser() {
  return new Promise((resolve, reject) => {
    try {
      UserSchema.find((err, data) => {
        mongodbRes(err, data, resolve, reject, 'findAll');
      });
    } catch (err) {
      reject(err);
    }
  });
}

// 条件查询
export function findByUser(condition) {
  return new Promise((resolve, reject) => {
    try {
      UserSchema.find({ ...condition }, (err, data) => {
        mongodbRes(err, data, resolve, reject, 'findByUser');
      });
    } catch (err) {
      reject(err);
    }
  });
}

// 条件查询count
export function findByUserCount(condition) {
  return new Promise((resolve, reject) => {
    try {
      const count = UserSchema.find({ ...condition }, (err, data) => {
        mongodbRes(err, data, '', reject, 'findByUserCount');
      }).count();
      resolve(count);
    } catch (err) {
      reject(err);
    }
  });
}

// 更新
export function updateUserById(id, newData) {
  return new Promise((resolve, reject) => {
    try {
      UserSchema.findByIdAndUpdate(
        id,
        { ...newData },
        { new: true },
        (err, data) => {
          mongodbRes(err, data, resolve, reject, 'updateUserById');
        },
      );
    } catch (err) {
      reject(err);
    }
  });
}

// 删除
export function deleteUserById(id) {
  return new Promise((resolve, reject) => {
    try {
      UserSchema.findByIdAndDelete(id, (err, data) => {
        mongodbRes(err, data, resolve, reject, 'deleteUserById');
      });
    } catch (err) {
      reject(err);
    }
  });
}

// mongodb响应统一封装
export function mongodbRes(err, data, resolve, reject, method) {
  if (err) {
    console.log(`UserSchema ${method} err:`, err);
    reject(err);
    return;
  }
  // 数据太长只显示前3
  console.log(
    `UserSchema ${method} success:`,
    !Array.isArray(data) ? [data] : data,
  );
  resolve?.(data);
}
