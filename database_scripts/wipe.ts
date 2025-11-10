import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

// 加载环境变量（优先使用当前目录的 .env，如果没有则使用 backend 的）
const envPath = path.resolve(__dirname, '.env');
dotenv.config({ path: envPath });

// 如果当前目录没有 .env，尝试使用 backend 的
if (!process.env.MONGODB_URI) {
  dotenv.config({ path: path.resolve(__dirname, '../backend/.env') });
}

async function wipeDatabase() {
  try {
    const mongoUri = process.env.MONGODB_URI;

    if (!mongoUri) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }

    console.log('🔌 Connecting to MongoDB Atlas...');
    await mongoose.connect(mongoUri);
    console.log('✅ Connected successfully');

    const db = mongoose.connection.db;

    if (!db) {
      throw new Error('Database connection not established');
    }

    console.log('🗑️  Wiping all collections...');

    // 获取所有集合
    const collections = await db.listCollections().toArray();

    // 删除所有集合
    for (const collection of collections) {
      await db.dropCollection(collection.name);
      console.log(`   ✓ Dropped collection: ${collection.name}`);
    }

    console.log('✅ Database wiped successfully');
  } catch (error) {
    console.error('❌ Error wiping database:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Connection closed');
  }
}

wipeDatabase();

