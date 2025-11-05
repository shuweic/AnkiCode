import { Response, NextFunction } from 'express';
import { User } from '../models/User';
import { AuthRequest } from '../types';
import { sendSuccess } from '../utils/responseWrapper';
import { AppError } from '../middleware/errorHandler';
import { getLeetCodeUserInfo } from '../services/leetcodeService';
import { z } from 'zod';

const updateNotificationsSchema = z.object({
  optIn: z.boolean(),
});

const updateLeetCodeUsernameSchema = z.object({
  leetcodeUsername: z.string().trim(),
});

export const getSettings = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.userId) {
      throw new AppError('Authentication required.', 401);
    }

    const user = await User.findById(req.userId).select('settings');

    if (!user) {
      throw new AppError('User not found.', 404);
    }

    sendSuccess(res, 'Settings retrieved successfully.', user.settings);
  } catch (error) {
    next(error);
  }
};

export const updateNotifications = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.userId) {
      throw new AppError('Authentication required.', 401);
    }

    const validatedData = updateNotificationsSchema.parse(req.body);

    const user = await User.findByIdAndUpdate(
      req.userId,
      { 'settings.notifications.optIn': validatedData.optIn },
      { new: true, runValidators: true }
    ).select('settings');

    if (!user) {
      throw new AppError('User not found.', 404);
    }

    sendSuccess(res, 'Notification settings updated successfully.', user.settings);
  } catch (error) {
    next(error);
  }
};

export const updateLeetCodeUsername = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.userId) {
      throw new AppError('Authentication required.', 401);
    }

    const validatedData = updateLeetCodeUsernameSchema.parse(req.body);

    // 验证 LeetCode 用户名是否存在
    const leetcodeInfo = await getLeetCodeUserInfo(validatedData.leetcodeUsername);

    if (!leetcodeInfo) {
      throw new AppError('LeetCode username not found.', 404);
    }

    const user = await User.findByIdAndUpdate(
      req.userId,
      { leetcodeUsername: validatedData.leetcodeUsername },
      { new: true, runValidators: true }
    ).select('-passwordHash');

    if (!user) {
      throw new AppError('User not found.', 404);
    }

    sendSuccess(res, 'LeetCode username updated successfully.', {
      leetcodeUsername: user.leetcodeUsername,
      leetcodeStats: leetcodeInfo,
    });
  } catch (error) {
    next(error);
  }
};

export const getLeetCodeStats = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.userId) {
      throw new AppError('Authentication required.', 401);
    }

    const user = await User.findById(req.userId).select('leetcodeUsername');

    if (!user || !user.leetcodeUsername) {
      throw new AppError('LeetCode username not set.', 404);
    }

    const leetcodeInfo = await getLeetCodeUserInfo(user.leetcodeUsername);

    if (!leetcodeInfo) {
      throw new AppError('Failed to fetch LeetCode stats.', 500);
    }

    sendSuccess(res, 'LeetCode stats retrieved successfully.', leetcodeInfo);
  } catch (error) {
    next(error);
  }
};

