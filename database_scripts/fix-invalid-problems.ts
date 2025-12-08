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

// Use the actual Problem model schema
const problemSchema = new mongoose.Schema(
  {
    leetcodeId: {
      type: Number,
      required: [true, 'LeetCode problem number is required'],
    },
    titleSlug: {
      type: String,
      required: true,
      trim: true,
    },
    name: {
      type: String,
      required: [true, 'Problem name is required'],
      trim: true,
    },
    difficulty: {
      type: String,
      enum: ['Easy', 'Medium', 'Hard'],
      required: true,
    },
    deadline: {
      type: Date,
      required: [true, 'Deadline is required'],
    },
    notes: {
      type: String,
      default: '',
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    status: {
      type: String,
      enum: ['todo', 'in_progress', 'done'],
      default: 'todo',
    },
    lastPracticedAt: {
      type: Date,
    },
    confidenceHistory: [
      {
        date: {
          type: Date,
          required: true,
        },
        level: {
          type: String,
          enum: ['hard', 'medium', 'easy'],
          required: true,
        },
      },
    ],
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

const Problem = mongoose.model('Problem', problemSchema);

async function fixInvalidProblems() {
  try {
    const mongoUri = process.env.MONGODB_URI;

    if (!mongoUri) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }

    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(mongoUri);
    console.log('✅ Connected successfully\n');

    // Find all problems missing required fields
    const invalidProblems = await Problem.find({
      $or: [
        { leetcodeId: { $exists: false } },
        { leetcodeId: null },
        { titleSlug: { $exists: false } },
        { titleSlug: null },
        { titleSlug: '' },
        { difficulty: { $exists: false } },
        { difficulty: null },
        { difficulty: '' },
      ],
    }).lean();

    console.log(`📊 Found ${invalidProblems.length} invalid problem(s)\n`);

    if (invalidProblems.length === 0) {
      console.log('✅ No invalid problems found. Database is clean!');
      await mongoose.connection.close();
      return;
    }

    // Display invalid problems
    console.log('Invalid problems:');
    invalidProblems.forEach((problem, index) => {
      console.log(`\n${index + 1}. Problem ID: ${problem._id}`);
      console.log(`   Name: ${problem.name || 'N/A'}`);
      console.log(`   Missing fields:`);
      if (!problem.leetcodeId) console.log(`     - leetcodeId`);
      if (!problem.titleSlug) console.log(`     - titleSlug`);
      if (!problem.difficulty) console.log(`     - difficulty`);
      console.log(`   Status: ${problem.status || 'N/A'}`);
      console.log(`   Owner: ${problem.ownerId}`);
    });

    console.log('\n⚠️  These problems were created by the old seed script and are missing required fields.');
    console.log('   They cannot be saved with the current schema.\n');

    // Ask what to do (for now, we'll delete them)
    // In a real scenario, you might want to:
    // 1. Delete them (if they're test data)
    // 2. Migrate them to a different collection
    // 3. Add placeholder values (not recommended)

    console.log('🗑️  Deleting invalid problems...');
    const deleteResult = await Problem.deleteMany({
      _id: { $in: invalidProblems.map((p) => p._id) },
    });

    console.log(`✅ Deleted ${deleteResult.deletedCount} invalid problem(s)\n`);

    // Also clean up any reminders associated with these problems
    const Reminder = mongoose.model(
      'Reminder',
      new mongoose.Schema({
        problemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Problem' },
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        scheduledFor: Date,
        createdFrom: String,
        status: String,
        meta: {
          confidence: String,
          durationSec: Number,
        },
      })
    );

    const orphanedReminders = await Reminder.deleteMany({
      problemId: { $in: invalidProblems.map((p) => p._id) },
    });

    if (orphanedReminders.deletedCount > 0) {
      console.log(`✅ Deleted ${orphanedReminders.deletedCount} orphaned reminder(s)\n`);
    }

    console.log('✅ Database cleanup completed!');
  } catch (error) {
    console.error('❌ Error fixing invalid problems:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Connection closed');
  }
}

fixInvalidProblems();

