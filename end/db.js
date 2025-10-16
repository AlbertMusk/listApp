const { DATABASE_URL } = require('./config');
const mongoose = require('mongoose');

const MONGO_URI = DATABASE_URL || 'mongodb://localhost:27017/list';; // 根据实际情况修改数据库名

async function connectDB() {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB 连接成功');
  } catch (err) {
    console.error('MongoDB 连接失败:', err);
    process.exit(1);
  }
}

module.exports = connectDB;