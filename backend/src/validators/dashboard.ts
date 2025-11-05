import { z } from 'zod';

export const markDoneSchema = z.object({
  problemId: z.string().min(1, 'Problem ID is required'),
  confidence: z.enum(['hard', 'medium', 'easy'], {
    errorMap: () => ({ message: 'Confidence must be hard, medium, or easy' }),
  }),
  completedAt: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Invalid completion date format',
  }),
  durationSec: z.number().min(0).optional(),
});

