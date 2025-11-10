import apiClient from './client';
import { ApiResponse, Problem } from '../types';

export interface ProblemsQueryParams {
  q?: string;
  status?: string;
  minRating?: number;
  maxRating?: number;
  deadlineBefore?: string;
  deadlineAfter?: string;
  sort?: string;
  page?: number;
  limit?: number;
}

export interface ProblemsResponse {
  problems: Problem[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

export interface CreateProblemData {
  leetcodeId: number;
  deadline: string;
  notes?: string;
}

export const problemsApi = {
  getProblems: async (params?: ProblemsQueryParams): Promise<ApiResponse<ProblemsResponse>> => {
    const response = await apiClient.get('/api/problems', { params });
    return response.data;
  },

  getProblemById: async (id: string): Promise<ApiResponse<Problem>> => {
    const response = await apiClient.get(`/api/problems/${id}`);
    return response.data;
  },

  createProblem: async (data: CreateProblemData): Promise<ApiResponse<Problem>> => {
    const response = await apiClient.post('/api/problems', data);
    return response.data;
  },

  updateProblem: async (id: string, data: Partial<Problem>): Promise<ApiResponse<Problem>> => {
    const response = await apiClient.put(`/api/problems/${id}`, data);
    return response.data;
  },

  deleteProblem: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/problems/${id}`);
  },

  searchLeetCode: async (questionId: number): Promise<ApiResponse<any>> => {
    const response = await apiClient.get('/api/leetcode/search', {
      params: { questionId: questionId.toString() },
    });
    return response.data;
  },
};

