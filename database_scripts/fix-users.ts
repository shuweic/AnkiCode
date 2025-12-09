import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

// 加载环境变量 - 从根目录读取
dotenv.config({ path: path.resolve(__dirname, '../.env') });

if (!process.env.MONGODB_URI) {
  console.error('❌ MONGODB_URI not found in environment variables');
  console.error('   Please copy .env.example to .env and configure your MongoDB connection');
  process.exit(1);
}

// User schema matching the backend model
const userSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true },
    notificationEmail: String,
    passwordHash: String,
    leetcodeUsername: String,
    problemIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Problem' }],
    settings: {
      notifications: {
        optIn: Boolean,
      },
      skipWeekends: Boolean,
    },
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);

async function fixUsers() {
  try {
    const mongoUri = process.env.MONGODB_URI;

    if (!mongoUri) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }

    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(mongoUri);
    console.log('✅ Connected successfully\n');

    // Find all users missing notificationEmail
    const usersWithoutNotificationEmail = await User.find({
      $or: [
        { notificationEmail: { $exists: false } },
        { notificationEmail: null },
        { notificationEmail: '' },
      ],
    }).lean();

    console.log(`📊 Found ${usersWithoutNotificationEmail.length} user(s) without notificationEmail\n`);

    if (usersWithoutNotificationEmail.length === 0) {
      console.log('✅ All users have notificationEmail set. Database is clean!');
      await mongoose.connection.close();
      return;
    }

    // Display users that will be fixed
    console.log('Users to fix:');
    usersWithoutNotificationEmail.forEach((user, index) => {
      console.log(`\n${index + 1}. User ID: ${user._id}`);
      console.log(`   Name: ${user.name || 'N/A'}`);
      console.log(`   Email: ${user.email || 'N/A'}`);
      console.log(`   Notification Email: ${user.notificationEmail || 'MISSING'}`);
    });

    console.log('\n🔧 Fixing users...');
    let fixedCount = 0;

    for (const user of usersWithoutNotificationEmail) {
      if (user.email) {
        await User.updateOne(
          { _id: user._id },
          { $set: { notificationEmail: user.email } }
        );
        fixedCount++;
      } else {
        console.log(`⚠️  Skipping user ${user._id} - no email found`);
      }
    }

    console.log(`✅ Fixed ${fixedCount} user(s)\n`);
    console.log('✅ Database fix completed!');
  } catch (error) {
    console.error('❌ Error fixing users:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Connection closed');
  }
}

fixUsers();

