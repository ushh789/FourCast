'use client';

import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { authService } from '../../lib/api';
import { useAuth } from '../useAuth';
import type { LoginRequest, RegisterRequest, AuthResponse } from '../../types';
import type { AxiosError } from 'axios';
import type { ApiErrorResponse } from '../../types';


export function useLoginMutation() {
  const router = useRouter();
  const authContext = useAuth();
  const { setUser, setTokens } = authContext;

  return useMutation({
    mutationFn: async (data: LoginRequest): Promise<AuthResponse> => {
      return authService.login(data);
    },
    onSuccess: (data) => {
      setUser(data.user);
      setTokens(data.accessToken, data.refreshToken);
      router.push('/dashboard');
    },
    onError: (error: AxiosError<ApiErrorResponse>) => {
      const message = error.response?.data?.message || 'Login failed. Please try again.';
      console.error('[Login Error]', message);
    },
  });
}

export function useRegisterMutation() {
  const router = useRouter();
  const authContext = useAuth();
  const { setUser, setTokens } = authContext;

  return useMutation({
    mutationFn: async (data: RegisterRequest): Promise<AuthResponse> => {
      return authService.register(data);
    },
    onSuccess: (data) => {
      // Update auth context
      setUser(data.user);
      setTokens(data.accessToken, data.refreshToken);
      // Redirect to dashboard
      router.push('/dashboard');
    },
    onError: (error: AxiosError<ApiErrorResponse>) => {
      const message = error.response?.data?.message || 'Registration failed. Please try again.';
      console.error('[Register Error]', message);
    },
  });
}

export function useLogoutMutation() {
  const router = useRouter();
  const authContext = useAuth();
  const { logout } = authContext;

  return useMutation({
    mutationFn: async () => {
      await logout();
    },
    onSuccess: () => {
      // Redirect to login
      router.push('/auth/login');
    },
    onError: (error: AxiosError<ApiErrorResponse>) => {
      const message = error.response?.data?.message || 'Logout failed.';
      console.error('[Logout Error]', message);
    },
  });
}

export const useLogin = useLoginMutation;
export const useRegister = useRegisterMutation;
export const useLogout = useLogoutMutation;
