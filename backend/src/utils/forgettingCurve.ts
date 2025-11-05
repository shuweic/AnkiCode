import { ConfidenceLevel, ConfidenceEntry } from '../types';

/**
 * 计算下次复习的日期，基于遗忘曲线算法
 * @param confidence 本次练习的信心等级
 * @param completedAt 完成时间
 * @param history 历史信心记录
 * @param skipWeekends 是否跳过周末
 * @returns 下次复习的日期
 */
export function calculateNextReviewDate(
  confidence: ConfidenceLevel,
  completedAt: Date,
  history: ConfidenceEntry[] = [],
  skipWeekends: boolean = false
): Date {
  // 基础间隔
  let daysToAdd = 1;

  switch (confidence) {
    case 'hard':
      daysToAdd = 1;
      break;
    case 'medium':
      daysToAdd = 3;
      break;
    case 'easy':
      daysToAdd = 7;
      break;
  }

  // 检查最近3次是否都是 easy
  if (confidence === 'easy' && history.length >= 3) {
    const recentThree = history.slice(-3);
    const allEasy = recentThree.every((entry) => entry.level === 'easy');

    if (allEasy) {
      // 如果之前已经是14天或更多，则延长到30天
      const lastInterval = getLastInterval(history);
      if (lastInterval >= 14) {
        daysToAdd = 30;
      } else {
        daysToAdd = 14;
      }
    }
  }

  // 计算下次日期
  let nextDate = new Date(completedAt);
  nextDate.setDate(nextDate.getDate() + daysToAdd);

  // 跳过周末
  if (skipWeekends) {
    nextDate = skipWeekendDays(nextDate);
  }

  // 确保不早于完成时间
  if (nextDate < completedAt) {
    nextDate = new Date(completedAt);
  }

  return nextDate;
}

/**
 * 从历史记录推测上一次的间隔天数
 */
function getLastInterval(history: ConfidenceEntry[]): number {
  if (history.length < 2) return 0;

  const last = history[history.length - 1];
  const secondLast = history[history.length - 2];

  const diffMs = new Date(last.date).getTime() - new Date(secondLast.date).getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  return diffDays;
}

/**
 * 跳过周末，如果日期是周六或周日，则移到下周一
 */
function skipWeekendDays(date: Date): Date {
  const dayOfWeek = date.getDay();

  if (dayOfWeek === 6) {
    // 周六 -> 周一
    date.setDate(date.getDate() + 2);
  } else if (dayOfWeek === 0) {
    // 周日 -> 周一
    date.setDate(date.getDate() + 1);
  }

  return date;
}

