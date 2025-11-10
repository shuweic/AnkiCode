import { Request } from 'express';
import { Types } from 'mongoose';

export interface AuthRequest extends Request {
  userId?: string;
}

export interface ApiResponse<T = any> {
  message: string;
  data: T;
}

export type ConfidenceLevel = 'hard' | 'medium' | 'easy';
export type ProblemStatus = 'todo' | 'in_progress' | 'done';
export type ReminderStatus = 'pending' | 'sent' | 'snoozed' | 'cancelled';
export type ReminderCreatedFrom = 'practice' | 'manual';

export interface ConfidenceEntry {
  date: Date;
  level: ConfidenceLevel;
}

export interface UserSettings {
  notifications: {
    optIn: boolean;
  };
  skipWeekends?: boolean;
}

