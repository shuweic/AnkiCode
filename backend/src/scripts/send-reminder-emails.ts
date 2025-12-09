import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { User } from '../models/User';
import { Problem } from '../models/Problem';
import { Reminder } from '../models/Reminder';
import { connectDatabase } from '../config/database';
import { createTransporter, getEmailFrom, generateReminderEmailHTML, generateReminderEmailText } from '../email';

// 加载环境变量 - 从根目录读取
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

if (!process.env.MONGODB_URI) {
  console.error('❌ MONGODB_URI not found in environment variables');
  console.error('   Please copy .env.example to .env and configure your MongoDB connection');
  process.exit(1);
}

async function sendReminderEmails() {
  try {
    // Ensure models are registered by accessing them
    void User;
    void Problem;
    void Reminder;

    console.log('🔌 Connecting to MongoDB...');
    await connectDatabase();
    console.log('✅ Connected successfully\n');

    // Calculate end of next day (23:59:59.999)
    // If today is Monday, "next day" is Tuesday, so we want reminders <= Tuesday 23:59:59
    const now = new Date();
    const endOfNextDay = new Date(now);
    endOfNextDay.setDate(now.getDate() + 1); // Tomorrow
    endOfNextDay.setHours(23, 59, 59, 999); // End of tomorrow

    console.log(`📅 Looking for reminders scheduled by ${endOfNextDay.toLocaleString()}\n`);

    // Find all pending reminders scheduled by end of next day
    const reminders = await Reminder.find({
      status: 'pending',
      scheduledFor: { $lte: endOfNextDay },
    })
      .populate('problemId')
      .populate('userId')
      .lean();

    console.log(`📊 Found ${reminders.length} pending reminder(s)\n`);

    if (reminders.length === 0) {
      console.log('✅ No reminders to send. Exiting.');
      await mongoose.connection.close();
      return;
    }

    // Group reminders by user
    const remindersByUser = new Map<string, any[]>();
    
    for (const reminder of reminders) {
      const user = reminder.userId as any;
      const problem = reminder.problemId as any;

      if (!user || !problem) {
        console.log(`⚠️  Skipping reminder ${reminder._id} - missing user or problem data`);
        continue;
      }

      // Check if user has opted in for notifications
      if (!user.settings?.notifications?.optIn) {
        console.log(`⏭️  Skipping user ${user.email} - notifications not opted in`);
        continue;
      }

      // Use notificationEmail or fallback to email
      const email = user.notificationEmail || user.email;
      if (!email) {
        console.log(`⚠️  Skipping user ${user._id} - no email address`);
        continue;
      }

      // skip example.com emails
      if (email.endsWith('@example.com')) {
        console.log(`⏭️  Skipping user ${user._id} - example.com email address`);
        continue;
      }

      if (!remindersByUser.has(email)) {
        remindersByUser.set(email, []);
      }
      remindersByUser.get(email)!.push(reminder);
    }

    console.log(`👥 Found ${remindersByUser.size} user(s) to notify\n`);

    if (remindersByUser.size === 0) {
      console.log('✅ No users to notify. Exiting.');
      await mongoose.connection.close();
      return;
    }

    // Create email transporter
    let transporter;
    try {
      transporter = createTransporter();
      console.log('📧 Email transporter created\n');
    } catch (error: any) {
      console.error('❌ Failed to create email transporter:', error.message);
      console.error('   Please set SMTP_USER and SMTP_PASS in your .env file');
      process.exit(1);
    }

    // Send emails
    let successCount = 0;
    let failureCount = 0;
    const reminderIdsToUpdate: string[] = [];

    for (const [email, userReminders] of remindersByUser.entries()) {
      const user = userReminders[0].userId as any;
      const userName = user.name || 'there';

      try {
        const mailOptions = {
          from: `"AnkiCode" <${getEmailFrom()}>`,
          to: email,
          subject: `📚 You have ${userReminders.length} problem${userReminders.length > 1 ? 's' : ''} to review`,
          html: generateReminderEmailHTML(userName, userReminders),
          text: generateReminderEmailText(userName, userReminders),
        };

        await transporter.sendMail(mailOptions);
        console.log(`✅ Email sent to ${email} (${userReminders.length} reminder(s))`);
        
        // Mark reminders as sent
        userReminders.forEach((r) => {
          reminderIdsToUpdate.push(r._id.toString());
        });
        
        successCount++;
      } catch (error: any) {
        console.error(`❌ Failed to send email to ${email}:`, error.message);
        failureCount++;
      }
    }

    // Update reminder statuses
    if (reminderIdsToUpdate.length > 0) {
      const updateResult = await Reminder.updateMany(
        { _id: { $in: reminderIdsToUpdate } },
        { $set: { status: 'sent' } }
      );
      console.log(`\n📝 Updated ${updateResult.modifiedCount} reminder(s) status to 'sent'`);
    }

    console.log('\n✅ Email sending completed!');
    console.log(`   - Success: ${successCount}`);
    console.log(`   - Failed: ${failureCount}`);
  } catch (error) {
    console.error('❌ Error sending reminder emails:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Connection closed');
  }
}

sendReminderEmails();

