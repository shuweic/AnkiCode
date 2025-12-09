import apiClient from '@/api/client';
import type { ApiResponse, TodayReviewItem, ConfidenceLevel } from '@/types';

export interface MarkDoneData {
    problemId: string;
    confidence: ConfidenceLevel;
    completedAt: string;
    durationSec?: number;
}

export interface MarkDoneResponse {
    problem: {
        id: string;
        name: string;
        status: string;
        lastPracticedAt: string;
        confidenceHistory: Array<{
            date: string;
            level: ConfidenceLevel;
        }>;
    };
    nextReminder: {
        id: string;
        scheduledFor: string;
    };
}

export const dashboardApi = {
    getTodayReview: async (): Promise<ApiResponse<{ items: TodayReviewItem[]; count: number }>> => {
        const response = await apiClient.get('/api/dashboard/today');
        return response.data;
    },

    markDone: async (data: MarkDoneData): Promise<ApiResponse<MarkDoneResponse>> => {
        const response = await apiClient.post('/api/dashboard/mark-done', data);
        return response.data;
    },
};

