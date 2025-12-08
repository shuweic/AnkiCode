import apiClient from './client';
import { ApiResponse, Reminder } from '../types';

export interface RemindersQueryParams {
  status?: string;
  before?: string;
  after?: string;
  page?: number;
  limit?: number;
}

export interface RemindersResponse {
  reminders: Reminder[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

export const remindersApi = {
  getReminders: async (params?: RemindersQueryParams): Promise<ApiResponse<RemindersResponse>> => {
    const response = await apiClient.get('/api/reminders', { params });
    return response.data;
  },
};

