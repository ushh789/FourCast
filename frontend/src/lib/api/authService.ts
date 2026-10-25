import { apiClient } from './client';
import type {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  User,
  GlobalResponse,
} from '../../types';

export const authService = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await apiClient.post<GlobalResponse<AuthResponse>>(
      '/auth/login',
      data,
    );
    
    if (!response.data.data) {
      throw new Error('No auth data in response');
    }
    
    return response.data.data;
  },

  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await apiClient.post<GlobalResponse<AuthResponse>>(
      '/auth/register',
      data,
    );
    
    if (!response.data.data) {
      throw new Error('No auth data in response');
    }
    
    return response.data.data;
  },

  refreshToken: async (refreshToken: string): Promise<{ accessToken: string }> => {
    const response = await apiClient.post<GlobalResponse<{ accessToken: string }>>(
      '/auth/refresh',
      { refreshToken },
    );
    
    if (!response.data.data) {
      throw new Error('No token in refresh response');
    }
    
    return response.data.data;
  },

  getMe: async (): Promise<User> => {
    const response = await apiClient.get<GlobalResponse<User>>('/user/me');
    
    if (!response.data.data) {
      throw new Error('No user data in response');
    }
    
    return response.data.data;
  },

  logout: async (): Promise<void> => {
    try {
      await apiClient.post('/auth/logout');
    } catch (error) {
      console.warn('[Auth] Logout error:', error);
    }
  },
};
