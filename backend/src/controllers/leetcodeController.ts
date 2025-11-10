import { Request, Response, NextFunction } from 'express';
import axios from 'axios';
import { sendSuccess } from '../utils/responseWrapper';
import { AppError } from '../middleware/errorHandler';

const LEETCODE_API_BASE = 'https://alfa-leetcode-api.onrender.com';

interface LeetCodeProblem {
  questionId: string;
  questionFrontendId: string;
  title: string;
  titleSlug: string;
  difficulty: string;
  topicTags?: Array<{ name: string }>;
}

/**
 * 根据题号搜索 LeetCode 题目
 */
export const searchByQuestionId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { questionId } = req.query;

    if (!questionId) {
      throw new AppError('Question ID is required', 400);
    }

    const qid = parseInt(questionId as string, 10);

    if (isNaN(qid) || qid <= 0) {
      throw new AppError('Invalid question ID', 400);
    }

    // 获取题目列表并查找匹配的题号
    // 由于 API 限制，我们获取足够多的题目来覆盖常见题号
    const limit = qid < 100 ? 100 : qid < 500 ? 500 : 1000;
    
    const response = await axios.get(`${LEETCODE_API_BASE}/problems`, {
      params: { limit },
      timeout: 15000,
    });

    const problems = response.data.problemsetQuestionList;

    if (!problems || !Array.isArray(problems)) {
      throw new AppError('Failed to fetch problems from LeetCode API', 500);
    }

    // 查找匹配题号的题目
    const problem = problems.find(
      (p: any) => parseInt(p.questionFrontendId) === qid
    );

    if (!problem) {
      throw new AppError(`Problem #${qid} not found in LeetCode database`, 404);
    }

    // 返回简化的题目信息
    sendSuccess(res, 'Problem found successfully', {
      leetcodeId: parseInt(problem.questionFrontendId),
      titleSlug: problem.titleSlug,
      title: problem.title,
      difficulty: problem.difficulty,
      tags: problem.topicTags?.map((tag: any) => tag.name) || [],
    });
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      if (error.code === 'ECONNABORTED') {
        next(new AppError('LeetCode API request timeout. Please try again.', 504));
      } else {
        next(new AppError('Failed to connect to LeetCode API', 503));
      }
    } else {
      next(error);
    }
  }
};

/**
 * 根据 titleSlug 获取详细信息
 */
export const getProblemDetails = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { titleSlug } = req.query;

    if (!titleSlug) {
      throw new AppError('Title slug is required', 400);
    }

    const response = await axios.get(`${LEETCODE_API_BASE}/select`, {
      params: { titleSlug },
      timeout: 15000,
    });

    const problem = response.data;

    sendSuccess(res, 'Problem details retrieved successfully', {
      leetcodeId: parseInt(problem.questionFrontendId),
      titleSlug: problem.titleSlug,
      title: problem.title,
      difficulty: problem.difficulty,
      tags: problem.topicTags?.map((tag: any) => tag.name) || [],
      content: problem.content,
      exampleTestcases: problem.exampleTestcases,
    });
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      if (error.code === 'ECONNABORTED') {
        next(new AppError('LeetCode API request timeout. Please try again.', 504));
      } else if (error.response?.status === 404) {
        next(new AppError('Problem not found on LeetCode', 404));
      } else {
        next(new AppError('Failed to connect to LeetCode API', 503));
      }
    } else {
      next(error);
    }
  }
};

