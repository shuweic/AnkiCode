import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import path from 'path';

// 加载环境变量
dotenv.config({ path: path.resolve(__dirname, '.env') });
if (!process.env.MONGODB_URI) {
  dotenv.config({ path: path.resolve(__dirname, '../backend/.env') });
}

// Schema
const userSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true },
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

const problemSchema = new mongoose.Schema(
  {
    leetcodeId: Number,
    titleSlug: String,
    name: String,
    difficulty: String,
    deadline: Date,
    notes: String,
    tags: [String],
    status: String,
    lastPracticedAt: Date,
    confidenceHistory: [
      {
        date: Date,
        level: String,
      },
    ],
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

const reminderSchema = new mongoose.Schema(
  {
    problemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Problem' },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    scheduledFor: Date,
    createdFrom: String,
    status: String,
    meta: {
      confidence: String,
      durationSec: Number,
    },
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);
const Problem = mongoose.model('Problem', problemSchema);
const Reminder = mongoose.model('Reminder', reminderSchema);

// 常见 LeetCode 题目
const leetcodeProblems = [
  { id: 1, slug: 'two-sum', name: 'Two Sum', difficulty: 'Easy' },
  { id: 2, slug: 'add-two-numbers', name: 'Add Two Numbers', difficulty: 'Medium' },
  { id: 3, slug: 'longest-substring-without-repeating-characters', name: 'Longest Substring Without Repeating Characters', difficulty: 'Medium' },
  { id: 15, slug: '3sum', name: '3Sum', difficulty: 'Medium' },
  { id: 20, slug: 'valid-parentheses', name: 'Valid Parentheses', difficulty: 'Easy' },
  { id: 21, slug: 'merge-two-sorted-lists', name: 'Merge Two Sorted Lists', difficulty: 'Easy' },
  { id: 53, slug: 'maximum-subarray', name: 'Maximum Subarray', difficulty: 'Medium' },
  { id: 70, slug: 'climbing-stairs', name: 'Climbing Stairs', difficulty: 'Easy' },
  { id: 121, slug: 'best-time-to-buy-and-sell-stock', name: 'Best Time to Buy and Sell Stock', difficulty: 'Easy' },
  { id: 206, slug: 'reverse-linked-list', name: 'Reverse Linked List', difficulty: 'Easy' },
  { id: 217, slug: 'contains-duplicate', name: 'Contains Duplicate', difficulty: 'Easy' },
  { id: 226, slug: 'invert-binary-tree', name: 'Invert Binary Tree', difficulty: 'Easy' },
  { id: 242, slug: 'valid-anagram', name: 'Valid Anagram', difficulty: 'Easy' },
  { id: 704, slug: 'binary-search', name: 'Binary Search', difficulty: 'Easy' },
];

function randomDate(start: Date, end: Date): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function randomChoice<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

async function seedDatabase() {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error('MONGODB_URI is not defined');
    }

    console.log('🔌 Connecting to MongoDB Atlas...');
    await mongoose.connect(mongoUri);
    console.log('✅ Connected successfully');

    console.log('🌱 Seeding LeetCode-focused database...');

    // 创建用户
    console.log('👥 Creating users...');
    const passwordHash = await bcrypt.hash('password123', 10);
    const user = await User.create({
      name: 'Demo User',
      email: 'demo@example.com',
      passwordHash,
      leetcodeUsername: 'demo',
      problemIds: [],
      settings: {
        notifications: {
          optIn: true,
        },
        skipWeekends: false,
      },
    });
    console.log(`   ✓ Created demo user`);

    // 创建问题
    console.log('📝 Creating LeetCode problems...');
    const problems = [];
    const now = new Date();
    const statuses = ['todo', 'in_progress', 'done'];
    const confidenceLevels = ['hard', 'medium', 'easy'];

    for (const lc of leetcodeProblems) {
      const status = randomChoice(statuses);
      const deadline = randomDate(
        new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
        new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)
      );

      const problem: any = {
        leetcodeId: lc.id,
        titleSlug: lc.slug,
        name: lc.name,
        difficulty: lc.difficulty,
        deadline,
        notes: Math.random() > 0.7 ? `My notes for ${lc.name}` : '',
        tags: ['Array', 'Hash Table'],
        status,
        ownerId: user._id,
        confidenceHistory: [],
      };

      // 如果已完成或进行中，添加练习历史
      if (status !== 'todo') {
        const practiceCount = Math.floor(Math.random() * 3) + 1;
        for (let j = 0; j < practiceCount; j++) {
          const practiceDate = randomDate(
            new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
            now
          );
          problem.confidenceHistory.push({
            date: practiceDate,
            level: randomChoice(confidenceLevels),
          });
        }
        problem.confidenceHistory.sort((a: any, b: any) => a.date.getTime() - b.date.getTime());
        problem.lastPracticedAt = problem.confidenceHistory[problem.confidenceHistory.length - 1].date;
      }

      const createdProblem = await Problem.create(problem);
      problems.push(createdProblem);
      await User.findByIdAndUpdate(user._id, {
        $push: { problemIds: createdProblem._id },
      });
    }
    console.log(`   ✓ Created ${problems.length} LeetCode problems`);

    // 统计
    const todoCount = problems.filter((p) => p.status === 'todo').length;
    const inProgressCount = problems.filter((p) => p.status === 'in_progress').length;
    const doneCount = problems.filter((p) => p.status === 'done').length;
    console.log(`     - Todo: ${todoCount}`);
    console.log(`     - In Progress: ${inProgressCount}`);
    console.log(`     - Done: ${doneCount}`);

    // 创建提醒
    console.log('⏰ Creating reminders...');
    const reminders = [];
    const activeProblems = problems.filter((p) => p.status !== 'done');

    for (const problem of activeProblems) {
      const isToday = Math.random() > 0.5;
      let scheduledFor: Date;

      if (isToday) {
        scheduledFor = randomDate(
          new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
          now
        );
      } else {
        scheduledFor = randomDate(
          new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000),
          new Date(now.getTime() + 15 * 24 * 60 * 60 * 1000)
        );
      }

      const reminder = await Reminder.create({
        problemId: problem._id,
        userId: user._id,
        scheduledFor,
        createdFrom: 'practice',
        status: 'pending',
        meta: {
          confidence: 'medium',
          durationSec: 1800,
        },
      });
      reminders.push(reminder);
    }
    console.log(`   ✓ Created ${reminders.length} reminders`);

    console.log('✅ Database seeded successfully!');
    console.log('\n📊 Summary:');
    console.log(`   - Users: 1`);
    console.log(`   - LeetCode Problems: ${problems.length}`);
    console.log(`   - Reminders: ${reminders.length}`);
    console.log('\n🔐 Test credentials:');
    console.log('   Email: demo@example.com');
    console.log('   Password: password123');
    console.log('   LeetCode Username: demo (you can change this in settings)');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Connection closed');
  }
}

seedDatabase();

