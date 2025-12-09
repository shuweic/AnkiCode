import apiClient from '@/api/client';
import { type ApiResponse, type User } from '@/types';

export interface RegisterData {
    name: string;
    email: string;
    password: string;
}

export interface LoginData {
    email: string;
    password: string;
}

export interface AuthResponse {
    token: string;
    user: User;
}

export const authApi = {
    register: async (data: RegisterData): Promise<ApiResponse<AuthResponse>> => {
        const response = await apiClient.post('/api/auth/register', data);
        return response.data;
    },

    login: async (data: LoginData): Promise<ApiResponse<AuthResponse>> => {
        const response = await apiClient.post('/api/auth/login', data);
        return response.data;
    },

    logout: async (): Promise<void> => {
        await apiClient.post('/api/auth/logout');
    },

    getCurrentUser: async (): Promise<ApiResponse<User>> => {
        const response = await apiClient.get('/api/auth/me');
        return response.data;
    },
};

