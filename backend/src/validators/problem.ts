import { z } from 'zod';

// 极简：只需要题号，其他信息自动获取
export const createProblemSchema = z.object({
  leetcodeId: z.number().min(1, 'LeetCode problem number is required'),
  deadline: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Invalid deadline date format',
  }),
  notes: z.string().optional(),
});

export const updateProblemSchema = z.object({
  notes: z.string().optional(),
  status: z.enum(['todo', 'in_progress', 'done']).optional(),
  deadline: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), {
      message: 'Invalid deadline date format',
    })
    .optional(),
});

