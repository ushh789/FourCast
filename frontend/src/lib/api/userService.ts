import { apiClient } from './client';
import type { User, GlobalResponse } from '../../types';

export const userService = {
  getProfile: async (id: string): Promise<User> => {
    const response = await apiClient.get<GlobalResponse<User>>(
      `/user/${id}`,
    );
    
    if (!response.data.data) {
      throw new Error('No user data in response');
    }
    
    return response.data.data;
  },

  updateProfile: async (data: Partial<User>): Promise<User> => {
    const response = await apiClient.put<GlobalResponse<User>>(
      '/user/update',
      data,
    );
    
    if (!response.data.data) {
      throw new Error('No user data in response');
    }
    
    return response.data.data;
  },

  deleteAccount: async (id: string): Promise<void> => {
    await apiClient.delete(`/user/${id}`);
  },
};
