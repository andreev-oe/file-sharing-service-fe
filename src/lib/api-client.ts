import Axios, { AxiosError, InternalAxiosRequestConfig, isCancel } from 'axios';

import { notifications } from '@/components/ui/notifications';
import { env } from '@/config/env';
import { getRefreshToken, useAuthStore } from '@/store/auth.store';
import { TokenPair } from '@/types/auth';
import { getApiErrorMessage } from '@/utils/api.utils';

const REFRESH_URL = '/auth/refresh';

let isRefreshing = false;
let failedQueue: Array<{ resolve: (token: string) => void; reject: (error: unknown) => void }> = [];

function processQueue(error: unknown, token: string | null): void {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token!);
    }
  });
  failedQueue = [];
}

export const api = Axios.create({
  baseURL: env.API_URL,
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const { accessToken } = useAuthStore.getState();
  if (config.headers) {
    config.headers.Accept = 'application/json';
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
    const status = error.response?.status;

    if (isCancel(error)) {
      // отмененные запросы не считаются ошибкой
      return;
    }

    const { accessToken } = useAuthStore.getState();
    if (status === 401 && !originalRequest._retry && originalRequest.url !== REFRESH_URL && accessToken) {
      if (isRefreshing) {
        return new Promise<string>((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = getRefreshToken();

      if (!refreshToken) {
        useAuthStore.getState().clearAuth();
        processQueue(error, null);
        isRefreshing = false;
        return Promise.reject(error);
      }

      try {
        const response = await api.post<TokenPair>(REFRESH_URL, { refreshToken });
        const { accessToken: newAccessToken, refreshToken: newRefreshToken } = response.data;
        useAuthStore.getState().setTokens(newAccessToken, newRefreshToken);
        processQueue(null, newAccessToken);
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        useAuthStore.getState().clearAuth();
        processQueue(refreshError, null);
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    if (status !== 401) {
      notifications.add({ variant: 'error', message: getApiErrorMessage(error) });
    }

    return Promise.reject(error);
  },
);
