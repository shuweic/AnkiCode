import { FilterQuery } from 'mongoose';
import { IProblem } from '../models/Problem';
import { IReminder } from '../models/Reminder';

interface ProblemQueryParams {
  q?: string;
  status?: string;
  minRating?: string;
  maxRating?: string;
  deadlineBefore?: string;
  deadlineAfter?: string;
  sort?: string;
  page?: string;
  limit?: string;
}

interface ReminderQueryParams {
  status?: string;
  before?: string;
  after?: string;
  page?: string;
  limit?: string;
}

export function parseProblemQuery(
  query: ProblemQueryParams,
  userId: string
): {
  filter: FilterQuery<IProblem>;
  sort: any;
  skip: number;
  limit: number;
} {
  const filter: FilterQuery<IProblem> = { ownerId: userId };

  // 文本搜索
  if (query.q) {
    filter.$text = { $search: query.q };
  }

  // 状态过滤
  if (query.status && ['todo', 'in_progress', 'done'].includes(query.status)) {
    filter.status = query.status;
  }

  // 评分过滤
  if (query.minRating || query.maxRating) {
    filter.rating = {};
    if (query.minRating) {
      const min = parseInt(query.minRating, 10);
      if (!isNaN(min)) filter.rating.$gte = min;
    }
    if (query.maxRating) {
      const max = parseInt(query.maxRating, 10);
      if (!isNaN(max)) filter.rating.$lte = max;
    }
  }

  // 截止日期过滤
  if (query.deadlineBefore || query.deadlineAfter) {
    filter.deadline = {};
    if (query.deadlineBefore) {
      const before = new Date(query.deadlineBefore);
      if (!isNaN(before.getTime())) filter.deadline.$lte = before;
    }
    if (query.deadlineAfter) {
      const after = new Date(query.deadlineAfter);
      if (!isNaN(after.getTime())) filter.deadline.$gte = after;
    }
  }

  // 排序
  const sort: any = {};
  if (query.sort) {
    const sortFields = query.sort.split(',');
    sortFields.forEach((field) => {
      if (field.startsWith('-')) {
        sort[field.substring(1)] = -1;
      } else {
        sort[field] = 1;
      }
    });
  } else {
    sort.deadline = 1; // 默认按截止日期升序
  }

  // 分页
  const page = parseInt(query.page || '1', 10);
  const limit = parseInt(query.limit || '20', 10);
  const skip = (page - 1) * limit;

  return { filter, sort, skip, limit };
}

export function parseReminderQuery(
  query: ReminderQueryParams,
  userId: string
): {
  filter: FilterQuery<IReminder>;
  sort: any;
  skip: number;
  limit: number;
} {
  const filter: FilterQuery<IReminder> = { userId };

  // 状态过滤
  if (query.status && ['pending', 'sent', 'snoozed', 'cancelled'].includes(query.status)) {
    filter.status = query.status;
  }

  // 时间过滤
  if (query.before || query.after) {
    filter.scheduledFor = {};
    if (query.before) {
      const before = new Date(query.before);
      if (!isNaN(before.getTime())) filter.scheduledFor.$lte = before;
    }
    if (query.after) {
      const after = new Date(query.after);
      if (!isNaN(after.getTime())) filter.scheduledFor.$gte = after;
    }
  }

  // 排序
  const sort: any = { scheduledFor: 1 };

  // 分页
  const page = parseInt(query.page || '1', 10);
  const limit = parseInt(query.limit || '20', 10);
  const skip = (page - 1) * limit;

  return { filter, sort, skip, limit };
}

