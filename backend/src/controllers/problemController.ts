import { Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { Problem } from '../models/Problem';
import { User } from '../models/User';
import { Reminder } from '../models/Reminder';
import { AuthRequest } from '../types';
import { createProblemSchema, updateProblemSchema } from '../validators/problem';
import { sendSuccess, sendCreated, sendNoContent } from '../utils/responseWrapper';
import { AppError } from '../middleware/errorHandler';
import { parseProblemQuery } from '../utils/queryParser';
import { getLeetCodeProblemBySlug } from '../services/leetcodeService';

export const getProblems = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.userId) {
      throw new AppError('Authentication required.', 401);
    }

    const { filter, sort, skip, limit } = parseProblemQuery(req.query, req.userId);

    const problems = await Problem.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Problem.countDocuments(filter);

    sendSuccess(res, 'Problems retrieved successfully.', {
      problems,
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

export const createProblem = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.userId) {
      throw new AppError('Authentication required.', 401);
    }

    const validatedData = createProblemSchema.parse(req.body);

    // Check if user has already added this problem
    const existing = await Problem.findOne({
      ownerId: req.userId,
      leetcodeId: validatedData.leetcodeId,
    });

    if (existing) {
      throw new AppError('You have already added this problem.', 400);
    }

    // Step 1: Search for titleSlug by problem number
    const LEETCODE_API_BASE = 'https://alfa-leetcode-api.onrender.com';
    const limit = validatedData.leetcodeId < 100 ? 100 : validatedData.leetcodeId < 500 ? 500 : 1000;
    
    let problemsResponse;
    try {
      problemsResponse = await (await import('axios')).default.get(
        `${LEETCODE_API_BASE}/problems`,
        { params: { limit }, timeout: 15000 }
      );
    } catch (apiError) {
      throw new AppError('Failed to connect to LeetCode API. Please try again later.', 503);
    }

    const problems = problemsResponse.data.problemsetQuestionList;
    if (!problems || !Array.isArray(problems)) {
      throw new AppError('Invalid response from LeetCode API.', 500);
    }

    const foundProblem = problems.find(
      (p: any) => parseInt(p.questionFrontendId) === validatedData.leetcodeId
    );

    if (!foundProblem) {
      throw new AppError(`LeetCode problem #${validatedData.leetcodeId} not found.`, 404);
    }

    // Step 2: Get detailed information using titleSlug
    const leetcodeProblem = await getLeetCodeProblemBySlug(foundProblem.titleSlug);

    if (!leetcodeProblem) {
      throw new AppError('Failed to fetch problem details from LeetCode API.', 500);
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // 创建问题
      const problem = await Problem.create(
        [
          {
            leetcodeId: validatedData.leetcodeId,
            titleSlug: foundProblem.titleSlug,
            name: leetcodeProblem.title,
            difficulty: leetcodeProblem.difficulty,
            deadline: new Date(validatedData.deadline),
            notes: validatedData.notes || '',
            tags: leetcodeProblem.topicTags?.map((tag: any) => tag.name) || [],
            status: 'todo',
            ownerId: req.userId,
            confidenceHistory: [],
          },
        ],
        { session }
      );

      // 更新用户的 problemIds
      await User.findByIdAndUpdate(
        req.userId,
        { $push: { problemIds: problem[0]._id } },
        { session }
      );

      await session.commitTransaction();

      sendCreated(res, `LeetCode #${validatedData.leetcodeId} - ${leetcodeProblem.title} added successfully.`, problem[0]);
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  } catch (error) {
    next(error);
  }
};

export const getProblemById = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.userId) {
      throw new AppError('Authentication required.', 401);
    }

    const problem = await Problem.findOne({
      _id: req.params.id,
      ownerId: req.userId,
    }).lean();

    if (!problem) {
      throw new AppError('Problem not found.', 404);
    }

    sendSuccess(res, 'Problem retrieved successfully.', problem);
  } catch (error) {
    next(error);
  }
};

export const updateProblem = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.userId) {
      throw new AppError('Authentication required.', 401);
    }

    const validatedData = updateProblemSchema.parse(req.body);

    const updateData: any = {};
    if (validatedData.name !== undefined) updateData.name = validatedData.name;
    if (validatedData.deadline !== undefined)
      updateData.deadline = new Date(validatedData.deadline);
    if (validatedData.rating !== undefined) updateData.rating = validatedData.rating;
    if (validatedData.notes !== undefined) updateData.notes = validatedData.notes;
    if (validatedData.tags !== undefined) updateData.tags = validatedData.tags;
    if (validatedData.status !== undefined) updateData.status = validatedData.status;

    const problem = await Problem.findOneAndUpdate(
      { _id: req.params.id, ownerId: req.userId },
      updateData,
      { new: true, runValidators: true }
    );

    if (!problem) {
      throw new AppError('Problem not found.', 404);
    }

    sendSuccess(res, 'Problem updated successfully.', problem);
  } catch (error) {
    next(error);
  }
};

export const deleteProblem = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.userId) {
      throw new AppError('Authentication required.', 401);
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // 删除问题
      const problem = await Problem.findOneAndDelete(
        { _id: req.params.id, ownerId: req.userId },
        { session }
      );

      if (!problem) {
        await session.abortTransaction();
        throw new AppError('Problem not found.', 404);
      }

      // 从用户的 problemIds 中移除
      await User.findByIdAndUpdate(
        req.userId,
        { $pull: { problemIds: problem._id } },
        { session }
      );

      // 删除相关的提醒
      await Reminder.deleteMany({ problemId: problem._id }, { session });

      await session.commitTransaction();

      sendNoContent(res);
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  } catch (error) {
    next(error);
  }
};

