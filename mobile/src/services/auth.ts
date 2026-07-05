import { api } from './api';
import type { ApiResponse, AuthResponse, User } from '@/types';

export async function login(email: string, password: string) {
  const res = await api.post<ApiResponse<AuthResponse>>('/auth/login', { email, password });
  return res.data.data!;
}

export async function register(name: string, email: string, password: string) {
  const res = await api.post<ApiResponse<AuthResponse>>('/auth/register', { name, email, password });
  return res.data.data!;
}

export async function logout() {
  await api.post('/auth/logout');
}

export async function forgotPassword(email: string) {
  const res = await api.post<ApiResponse>('/auth/forgot-password', { email });
  return res.data;
}

export async function resetPassword(token: string, password: string) {
  const res = await api.post<ApiResponse>(`/auth/reset-password/${token}`, { password });
  return res.data;
}

export async function refreshSession() {
  const res = await api.post<ApiResponse<{ accessToken: string; user?: User }>>('/auth/refresh-token');
  return res.data.data ?? null;
}

export async function updateProfile(patch: { name?: string; phone?: string; avatar?: string }) {
  const res = await api.patch<ApiResponse<{ user: User }>>('/users/me', patch);
  return res.data.data!.user;
}
