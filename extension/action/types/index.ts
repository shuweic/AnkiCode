export type ConfidenceLevel = 'hard' | 'medium' | 'easy';
export type ProblemStatus = 'todo' | 'in_progress' | 'done';
export type ReminderStatus = 'pending' | 'sent' | 'snoozed' | 'cancelled';

export interface User {
    id: string;
    name: string;
    email: string;
    leetcodeUsername?: string;
    settings: UserSettings;
    problemIds?: string[];
}

export interface UserSettings {
    notifications: {
        optIn: boolean;
    };
    skipWeekends?: boolean;
}

export interface Problem {
    _id?: string;
    id?: string;
    leetcodeId: number;
    titleSlug: string;
    name: string;
    difficulty: string;
    deadline: string;
    notes: string;
    tags: string[];
    status: ProblemStatus;
    lastPracticedAt?: string;
    confidenceHistory?: ConfidenceEntry[];
    ownerId?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface ConfidenceEntry {
    date: string;
    level: ConfidenceLevel;
}

export interface Reminder {
    _id?: string;
    id?: string;
    problemId: string | Problem;
    userId: string;
    scheduledFor: string;
    createdFrom: 'practice' | 'manual';
    status: ReminderStatus;
    meta?: {
        confidence?: ConfidenceLevel;
        durationSec?: number;
    };
    createdAt?: string;
    updatedAt?: string;
}

export interface TodayReviewItem {
    problem: {
        id: string;
        name: string;
        rating: number;
        notes: string;
        status: ProblemStatus;
        deadline: string;
        lastPracticedAt?: string;
    };
    reminder: {
        id: string;
        scheduledFor: string;
        status: ReminderStatus;
    } | null;
}

export interface ApiResponse<T = any> {
    message: string;
    data: T;
}

export interface PaginatedResponse<T> {
    items: T[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        pages: number;
    };
}

