import { Response, NextFunction } from 'express';
import { Reminder } from '../models/Reminder';
import { Problem } from '../models/Problem';
import { AuthRequest } from '../types';
import { sendSuccess, sendCreated } from '../utils/responseWrapper';
import { AppError } from '../middleware/errorHandler';
import { parseReminderQuery } from '../utils/queryParser';
import { z } from 'zod';

const createReminderSchema = z.object({
  problemId: z.string().min(1, 'Problem ID is required'),
  scheduledFor: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Invalid scheduled date format',
  }),
});

const updateReminderSchema = z.object({
  status: z.enum(['pending', 'sent', 'snoozed', 'cancelled']),
});

export const getReminders = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.userId) {
      throw new AppError('Authentication required.', 401);
    }

    const { filter, sort, skip, limit } = parseReminderQuery(req.query, req.userId);

    const reminders = await Reminder.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .populate('problemId', 'name deadline status')
      .lean();

    const total = await Reminder.countDocuments(filter);

    sendSuccess(res, 'Reminders retrieved successfully.', {
      reminders,
      pagination: {
        total,
        page: Math.floor(skip / limit) + 1,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const createReminder = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.userId) {
      throw new AppError('Authentication required.', 401);
    }

    const validatedData = createReminderSchema.parse(req.body);

    // 验证问题存在且属于当前用户
    const problem = await Problem.findOne({
      _id: validatedData.problemId,
      ownerId: req.userId,
    });

    if (!problem) {
      throw new AppError('Problem not found.', 404);
    }

    const reminder = await Reminder.create({
      problemId: validatedData.problemId,
      userId: req.userId,
      scheduledFor: new Date(validatedData.scheduledFor),
      createdFrom: 'manual',
      status: 'pending',
      meta: {},
    });

    sendCreated(res, 'Reminder created successfully.', reminder);
  } catch (error) {
    next(error);
  }
};

export const updateReminder = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.userId) {
      throw new AppError('Authentication required.', 401);
    }

    const validatedData = updateReminderSchema.parse(req.body);

    const reminder = await Reminder.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { status: validatedData.status },
      { new: true, runValidators: true }
    );

    if (!reminder) {
      throw new AppError('Reminder not found.', 404);
    }

    sendSuccess(res, 'Reminder updated successfully.', reminder);
  } catch (error) {
    next(error);
  }
};

