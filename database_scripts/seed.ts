import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import path from 'path';

// 加载环境变量
const envPath = path.resolve(__dirname, '.env');
dotenv.config({ path: envPath });

if (!process.env.MONGODB_URI) {
  dotenv.config({ path: path.resolve(__dirname, '../backend/.env') });
}

// 定义 Schema（与后端相同）
const userSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true },
    passwordHash: String,
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
    name: String,
    deadline: Date,
    rating: Number,
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
    assignees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
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

// 辅助函数：生成随机日期
function randomDate(start: Date, end: Date): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

// 辅助函数：生成随机整数
function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// 辅助函数：随机选择数组元素
function randomChoice<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

async function seedDatabase() {
  try {
    const mongoUri = process.env.MONGODB_URI;

    if (!mongoUri) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }

    console.log('🔌 Connecting to MongoDB Atlas...');
    await mongoose.connect(mongoUri);
    console.log('✅ Connected successfully');

    // 检查是否已有数据
    const existingUsers = await User.countDocuments();
    if (existingUsers > 0) {
      console.log('⚠️  Database already contains data. Run wipe.ts first if you want to start fresh.');
      console.log('   Continuing anyway...');
    }

    console.log('🌱 Seeding database...');

    // 1. 创建用户（25个）
    console.log('👥 Creating users...');
    const users = [];
    const passwordHash = await bcrypt.hash('password123', 10);

    for (let i = 1; i <= 25; i++) {
      const user = await User.create({
        name: `User ${i}`,
        email: `user${i}@example.com`,
        passwordHash,
        problemIds: [],
        settings: {
          notifications: {
            optIn: Math.random() > 0.3, // 70% 选择接收通知
          },
          skipWeekends: Math.random() > 0.7, // 30% 跳过周末
        },
      });
      users.push(user);
    }
    console.log(`   ✓ Created ${users.length} users`);

    // 2. 创建问题（120个）
    console.log('📝 Creating problems...');
    const problemNames = [
      'Two Sum',
      'Add Two Numbers',
      'Longest Substring',
      'Median of Two Sorted Arrays',
      'Longest Palindromic Substring',
      'ZigZag Conversion',
      'Reverse Integer',
      'String to Integer (atoi)',
      'Palindrome Number',
      'Regular Expression Matching',
      'Container With Most Water',
      'Integer to Roman',
      'Roman to Integer',
      'Longest Common Prefix',
      '3Sum',
      '3Sum Closest',
      'Letter Combinations',
      '4Sum',
      'Remove Nth Node',
      'Valid Parentheses',
      'Merge Two Sorted Lists',
      'Generate Parentheses',
      'Merge k Sorted Lists',
      'Swap Nodes in Pairs',
      'Reverse Nodes in k-Group',
      'Remove Duplicates',
      'Remove Element',
      'Implement strStr()',
      'Divide Two Integers',
      'Substring with Concatenation',
      'Next Permutation',
      'Longest Valid Parentheses',
      'Search in Rotated Array',
      'Find First and Last Position',
      'Search Insert Position',
      'Valid Sudoku',
      'Sudoku Solver',
      'Count and Say',
      'Combination Sum',
      'Combination Sum II',
      'First Missing Positive',
      'Trapping Rain Water',
      'Multiply Strings',
      'Wildcard Matching',
      'Jump Game',
      'Jump Game II',
      'Permutations',
      'Permutations II',
      'Rotate Image',
      'Group Anagrams',
      'Pow(x, n)',
      'Maximum Subarray',
      'Spiral Matrix',
      'Jump Game III',
      'Merge Intervals',
      'Insert Interval',
      'Length of Last Word',
      'Spiral Matrix II',
      'Permutation Sequence',
      'Rotate List',
      'Unique Paths',
      'Unique Paths II',
      'Minimum Path Sum',
      'Valid Number',
      'Plus One',
      'Add Binary',
      'Text Justification',
      'Sqrt(x)',
      'Climbing Stairs',
      'Simplify Path',
      'Edit Distance',
      'Set Matrix Zeroes',
      'Search a 2D Matrix',
      'Sort Colors',
      'Minimum Window Substring',
      'Combinations',
      'Subsets',
      'Word Search',
      'Remove Duplicates II',
      'Search in Rotated II',
      'Remove Duplicates from List',
      'Remove Duplicates from List II',
      'Largest Rectangle',
      'Maximal Rectangle',
      'Partition List',
      'Scramble String',
      'Merge Sorted Array',
      'Gray Code',
      'Subsets II',
      'Decode Ways',
      'Reverse Linked List II',
      'Restore IP Addresses',
      'Binary Tree Inorder',
      'Unique Binary Search Trees',
      'Unique Binary Search Trees II',
      'Interleaving String',
      'Validate Binary Search Tree',
      'Recover Binary Search Tree',
      'Same Tree',
      'Symmetric Tree',
      'Binary Tree Level Order',
      'Binary Tree Zigzag',
      'Maximum Depth',
      'Construct Binary Tree',
      'Convert Sorted Array to BST',
      'Convert Sorted List to BST',
      'Balanced Binary Tree',
      'Minimum Depth',
      'Path Sum',
      'Path Sum II',
      'Flatten Binary Tree',
      'Distinct Subsequences',
      'Populating Next Right',
      'Pascal Triangle',
      'Pascal Triangle II',
      'Triangle',
      'Best Time to Buy Stock',
      'Best Time to Buy Stock II',
    ];

    const tags = [
      'Array',
      'String',
      'Hash Table',
      'Dynamic Programming',
      'Math',
      'Sorting',
      'Greedy',
      'Depth-First Search',
      'Breadth-First Search',
      'Binary Search',
      'Tree',
      'Backtracking',
      'Stack',
      'Heap',
      'Graph',
      'Sliding Window',
      'Two Pointers',
      'Linked List',
    ];

    const statuses = ['todo', 'in_progress', 'done'];
    const confidenceLevels = ['hard', 'medium', 'easy'];

    const now = new Date();
    const problems = [];

    for (let i = 0; i < 120; i++) {
      const owner = randomChoice(users);
      const status = randomChoice(statuses);
      const isDone = status === 'done' || (status === 'in_progress' && Math.random() > 0.5);

      // 生成截止日期（过去30天到未来30天）
      const deadline = randomDate(
        new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
        new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)
      );

      const problem: any = {
        name: problemNames[i % problemNames.length] + ` #${Math.floor(i / problemNames.length) + 1}`,
        deadline,
        rating: randomInt(1, 5),
        notes: Math.random() > 0.5 ? `Notes for problem ${i + 1}` : '',
        tags: [randomChoice(tags), randomChoice(tags)].filter(
          (v, i, a) => a.indexOf(v) === i
        ),
        status,
        ownerId: owner._id,
        assignees: [],
        confidenceHistory: [],
      };

      // 如果问题已完成或进行中，添加练习历史
      if (isDone) {
        const practiceCount = randomInt(1, 5);
        for (let j = 0; j < practiceCount; j++) {
          const practiceDate = randomDate(
            new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000),
            now
          );
          problem.confidenceHistory.push({
            date: practiceDate,
            level: randomChoice(confidenceLevels),
          });
        }
        // 按日期排序
        problem.confidenceHistory.sort((a: any, b: any) => a.date.getTime() - b.date.getTime());
        problem.lastPracticedAt = problem.confidenceHistory[problem.confidenceHistory.length - 1].date;
      }

      const createdProblem = await Problem.create(problem);
      problems.push(createdProblem);

      // 更新用户的 problemIds
      await User.findByIdAndUpdate(owner._id, {
        $push: { problemIds: createdProblem._id },
      });
    }
    console.log(`   ✓ Created ${problems.length} problems`);

    // 统计各状态的问题数量
    const todoCount = problems.filter((p) => p.status === 'todo').length;
    const inProgressCount = problems.filter((p) => p.status === 'in_progress').length;
    const doneCount = problems.filter((p) => p.status === 'done').length;
    console.log(`     - Todo: ${todoCount}`);
    console.log(`     - In Progress: ${inProgressCount}`);
    console.log(`     - Done: ${doneCount}`);

    // 3. 创建提醒（约 60 个）
    console.log('⏰ Creating reminders...');
    const reminders = [];

    // 为部分未完成的问题创建提醒
    const activeProblems = problems.filter((p) => p.status !== 'done');
    const problemsWithReminders = activeProblems.slice(0, 60);

    for (const problem of problemsWithReminders) {
      const owner = users.find((u) => u._id.toString() === problem.ownerId.toString());
      if (!owner) continue;

      // 50% 的提醒是今天或之前的（用于测试今日复习列表）
      const isToday = Math.random() > 0.5;
      let scheduledFor: Date;

      if (isToday) {
        scheduledFor = randomDate(
          new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
          now
        );
      } else {
        scheduledFor = randomDate(
          new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000),
          new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)
        );
      }

      const reminder = await Reminder.create({
        problemId: problem._id,
        userId: owner._id,
        scheduledFor,
        createdFrom: Math.random() > 0.7 ? 'manual' : 'practice',
        status: 'pending',
        meta: {
          confidence: problem.confidenceHistory.length > 0 
            ? problem.confidenceHistory[problem.confidenceHistory.length - 1].level 
            : undefined,
          durationSec: randomInt(300, 3600),
        },
      });
      reminders.push(reminder);
    }
    console.log(`   ✓ Created ${reminders.length} reminders`);

    console.log('✅ Database seeded successfully!');
    console.log('\n📊 Summary:');
    console.log(`   - Users: ${users.length}`);
    console.log(`   - Problems: ${problems.length}`);
    console.log(`   - Reminders: ${reminders.length}`);
    console.log('\n🔐 Test credentials:');
    console.log('   Email: user1@example.com');
    console.log('   Password: password123');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Connection closed');
  }
}

seedDatabase();

