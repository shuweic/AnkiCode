import axios from 'axios';

const LEETCODE_API_BASE = 'https://alfa-leetcode-api.onrender.com';

interface LeetCodeProblem {
  questionId: string;
  questionFrontendId: string;
  title: string;
  titleSlug: string;
  difficulty: string;
  topicTags: Array<{ name: string }>;
}

interface LeetCodeUserStats {
  username: string;
  ranking: number;
  totalSolved: number;
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
}

/**
 * 根据题号获取 LeetCode 题目信息
 */
export async function getLeetCodeProblemByNumber(
  problemNumber: number
): Promise<LeetCodeProblem | null> {
  try {
    // 先获取题目列表找到对应的 titleSlug
    const response = await axios.get(`${LEETCODE_API_BASE}/problems`, {
      params: { limit: 1 },
      timeout: 10000,
    });

    // 由于 API 限制，我们需要用另一种方式
    // 直接用常见的 title slug 格式尝试
    const titleSlug = await findTitleSlugByNumber(problemNumber);
    
    if (!titleSlug) {
      return null;
    }

    return await getLeetCodeProblemBySlug(titleSlug);
  } catch (error) {
    console.error('Error fetching LeetCode problem:', error);
    return null;
  }
}

/**
 * 根据 titleSlug 获取题目详情
 */
export async function getLeetCodeProblemBySlug(
  titleSlug: string
): Promise<any | null> {
  try {
    const response = await axios.get(`${LEETCODE_API_BASE}/select`, {
      params: { titleSlug },
      timeout: 15000,
    });

    // alfa-leetcode-api 返回的数据结构
    const data = response.data;
    
    return {
      questionId: data.questionId,
      questionFrontendId: data.questionFrontendId,
      title: data.questionTitle || data.title, // API 返回 questionTitle
      titleSlug: data.titleSlug,
      difficulty: data.difficulty,
      topicTags: data.topicTags || [],
      content: data.question || data.content, // API 返回 question 字段
    };
  } catch (error: any) {
    console.error('Error fetching LeetCode problem by slug:', error.message);
    return null;
  }
}

/**
 * 获取 LeetCode 用户信息
 */
export async function getLeetCodeUserInfo(
  username: string
): Promise<LeetCodeUserStats | null> {
  try {
    const response = await axios.get(`${LEETCODE_API_BASE}/${username}`, {
      timeout: 10000,
    });

    return {
      username: response.data.username,
      ranking: response.data.ranking,
      totalSolved: response.data.totalSolved,
      easySolved: response.data.easySolved,
      mediumSolved: response.data.mediumSolved,
      hardSolved: response.data.hardSolved,
    };
  } catch (error) {
    console.error('Error fetching LeetCode user info:', error);
    return null;
  }
}

/**
 * 简单的映射：根据题号猜测 titleSlug
 * 这是一个简化方案，实际可能需要维护一个映射表
 */
async function findTitleSlugByNumber(problemNumber: number): Promise<string | null> {
  // 一些常见题目的映射
  const commonProblems: Record<number, string> = {
    1: 'two-sum',
    2: 'add-two-numbers',
    3: 'longest-substring-without-repeating-characters',
    4: 'median-of-two-sorted-arrays',
    5: 'longest-palindromic-substring',
    15: '3sum',
    20: 'valid-parentheses',
    21: 'merge-two-sorted-lists',
    53: 'maximum-subarray',
    70: 'climbing-stairs',
    121: 'best-time-to-buy-and-sell-stock',
    206: 'reverse-linked-list',
    // 可以继续添加更多...
  };

  return commonProblems[problemNumber] || null;
}

/**
 * 通过搜索获取题目信息（备用方案）
 */
export async function searchLeetCodeProblem(
  problemNumber: number,
  titleSlug?: string
): Promise<LeetCodeProblem | null> {
  if (titleSlug) {
    return await getLeetCodeProblemBySlug(titleSlug);
  }
  return await getLeetCodeProblemByNumber(problemNumber);
}

