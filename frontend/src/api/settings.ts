import apiClient from './client';
import { ApiResponse, UserSettings } from '../types';

export const settingsApi = {
  getSettings: async (): Promise<ApiResponse<UserSettings>> => {
    const response = await apiClient.get('/api/settings');
    return response.data;
  },

  updateNotifications: async (optIn: boolean): Promise<ApiResponse<UserSettings>> => {
    const response = await apiClient.put('/api/settings/notifications', { optIn });
    return response.data;
  },
};

