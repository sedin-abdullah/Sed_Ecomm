import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { API_URL } from '@/constants/config';
import type { ApiResponse, AuthResponse } from '@/types';

// In-memory access token (persisted to SecureStore by the auth store). Kept
// here so the interceptors can read it without importing the store (avoids a
// circular dependency).
let accessToken: string | null = null;
let onAuthFailure: (() => void) | null = null;

export function setAccessToken(token: string | null) {
  accessToken = token;
}
export function registerAuthFailureHandler(cb: () => void) {
  onAuthFailure = cb;
}

export const api = axios.create({
  baseURL: API_URL,
  // React Native's native networking persists the refresh cookie per-host, so
  // the /auth/refresh-token flow works the same as on web.
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
  timeout: 20000,
});

api.interceptors.request.use((config) => {
  if (accessToken) config.headers.set('Authorization', `Bearer ${accessToken}`);
  // Let the platform set the multipart boundary for file uploads.
  if (config.data instanceof FormData) config.headers.delete('Content-Type');
  return config;
});

type Retriable = InternalAxiosRequestConfig & { _retry?: boolean };
let refreshPromise: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
  if (!refreshPromise) {
    refreshPromise = axios
      .post<ApiResponse<AuthResponse>>(`${API_URL}/auth/refresh-token`, {}, { withCredentials: true })
      .then((res) => res.data.data?.accessToken ?? null)
      .catch(() => null)
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
}

api.interceptors.response.use(
  (res) => res,
  async (error: AxiosError<ApiResponse>) => {
    const original = error.config as Retriable | undefined;
    const isAuthCall = original?.url?.includes('/auth/');
    if (error.response?.status === 401 && original && !original._retry && !isAuthCall) {
      original._retry = true;
      const token = await refreshAccessToken();
      if (token) {
        setAccessToken(token);
        original.headers.set('Authorization', `Bearer ${token}`);
        return api(original);
      }
      onAuthFailure?.();
    }
    return Promise.reject(error);
  },
);

/** Human-readable message from a failed API call (first field error → message → fallback). */
export function getApiErrorMessage(error: unknown, fallback = 'Something went wrong'): string {
  if (error instanceof AxiosError) {
    const data = error.response?.data as ApiResponse | undefined;
    if (data?.errors?.length) return data.errors[0].message;
    if (data?.message) return data.message;
  }
  return fallback;
}
