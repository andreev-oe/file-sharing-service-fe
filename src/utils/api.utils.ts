import { AxiosError } from 'axios';

import type { AuthUser, TokenPair } from '@/types/auth';

export function isTokenPair(value: unknown): value is TokenPair {
  return typeof value === 'object' && value !== null && 'accessToken' in value && 'refreshToken' in value;
}

export function isAuthUser(value: unknown): value is AuthUser {
  return typeof value === 'object' && value !== null && 'id' in value && 'email' in value && 'name' in value;
}

export const getApiErrorMessage = (error: unknown, fallback = 'Что-то пошло не так'): string => {
  if (error instanceof AxiosError) {
    const data = error.response?.data;
    if (data !== null && typeof data === 'object' && 'message' in data) {
      const msg = (data as { message: unknown }).message;
      if (Array.isArray(msg)) {
        return msg.join(', ');
      }
      if (typeof msg === 'string') {
        return msg;
      }
    }
    return error.message || fallback;
  }
  return fallback;
};
