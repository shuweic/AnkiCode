import { Response, NextFunction } from 'express';
import { Problem } from '../models/Problem';
import { Reminder } from '../models/Reminder';
import { User } from '../models/User';
import { AuthRequest } from '../types';
import { markDoneSchema } from '../validators/dashboard';
import { sendSuccess } from '../utils/responseWrapper';
import { AppError } from '../middleware/errorHandler';
import { calculateNextReviewDate } from '../utils/forgettingCurve';

export const getTodayReview = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.userId) {
      throw new AppError('Authentication required.', 401);
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Find reminders due today
    const reminders = await Reminder.find({
      userId: req.userId,
      scheduledFor: { $lt: tomorrow },
      status: 'pending',
    })
      .populate('problemId')
      .lean();

    // Filter out incomplete problems
    const todayProblems = reminders
      .filter((reminder: any) => {
        const problem = reminder.problemId;
        return problem && problem.status !== 'done';
      })
      .map((reminder: any) => {
        const problem = reminder.problemId;
        return {
          problem: {
            id: problem._id,
            name: problem.name,
            rating: problem.rating,
            notes: problem.notes,
            status: problem.status,
            deadline: problem.deadline,
            lastPracticedAt: problem.lastPracticedAt,
          },
          reminder: {
            id: reminder._id,
            scheduledFor: reminder.scheduledFor,
            status: reminder.status,
          },
        };
      });

    // Find first-time problems due today without reminders
    const firstTimeProblems = await Problem.find({
      ownerId: req.userId,
      deadline: { $gte: today, $lt: tomorrow },
      status: { $ne: 'done' },
      lastPracticedAt: { $exists: false },
    }).lean();

    // Check if these problems already have reminders
    const firstTimeProblemIds = firstTimeProblems.map((p) => p._id.toString());
    const existingReminderProblemIds = new Set(
      todayProblems.map((tp: any) => tp.problem.id.toString())
    );

    const newTodayProblems = firstTimeProblems
      .filter((p) => !existingReminderProblemIds.has(p._id.toString()))
      .map((problem) => ({
        problem: {
          id: problem._id,
          name: problem.name,
          rating: problem.rating,
          notes: problem.notes,
          status: problem.status,
          deadline: problem.deadline,
          lastPracticedAt: problem.lastPracticedAt,
        },
        reminder: null,
      }));

    const allTodayProblems = [...todayProblems, ...newTodayProblems];

    sendSuccess(res, "Today's review list retrieved successfully.", {
      items: allTodayProblems,
      count: allTodayProblems.length,
    });
  } catch (error) {
    next(error);
  }
};

export const markDone = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.userId) {
      throw new AppError('Authentication required.', 401);
    }

    const validatedData = markDoneSchema.parse(req.body);

    // Find problem
    const problem = await Problem.findOne({
      _id: validatedData.problemId,
      ownerId: req.userId,
    });

    if (!problem) {
      throw new AppError('Problem not found.', 404);
    }

    if (problem.status === 'done') {
      throw new AppError('Problem is already marked as done.', 400);
    }

    const completedAt = new Date(validatedData.completedAt);

    // Update problem
    problem.lastPracticedAt = completedAt;
    problem.confidenceHistory.push({
      date: completedAt,
      level: validatedData.confidence,
    });

    // If status is todo, update to in_progress
    if (problem.status === 'todo') {
      problem.status = 'in_progress';
    }

    await problem.save();

    // Get user settings
    const user = await User.findById(req.userId);
    const skipWeekends = user?.settings?.skipWeekends || false;

    // Calculate next review date
    const nextReviewDate = calculateNextReviewDate(
      validatedData.confidence,
      completedAt,
      problem.confidenceHistory,
      skipWeekends
    );

    // Create new reminder
    const newReminder = await Reminder.create({
      problemId: problem._id,
      userId: req.userId,
      scheduledFor: nextReviewDate,
      createdFrom: 'practice',
      status: 'pending',
      meta: {
        confidence: validatedData.confidence,
        durationSec: validatedData.durationSec,
      },
    });

    // Mark old reminders as sent
    await Reminder.updateMany(
      {
        problemId: problem._id,
        userId: req.userId,
        status: 'pending',
        _id: { $ne: newReminder._id },
      },
      { status: 'sent' }
    );

    sendSuccess(res, 'Practice logged successfully. Next reminder scheduled.', {
      problem: {
        id: problem._id,
        name: problem.name,
        status: problem.status,
        lastPracticedAt: problem.lastPracticedAt,
        confidenceHistory: problem.confidenceHistory,
      },
      nextReminder: {
        id: newReminder._id,
        scheduledFor: newReminder.scheduledFor,
      },
    });
  } catch (error) {
    next(error);
  }
};

