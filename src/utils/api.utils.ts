import { AxiosError } from 'axios';

import type { AuthUser, TokenPair } from '@/types/auth';
import type { FolderNode } from '@/types/folders';

export function isTokenPair(value: unknown): value is TokenPair {
  return typeof value === 'object' && value !== null && 'accessToken' in value && 'refreshToken' in value;
}

export function isAuthUser(value: unknown): value is AuthUser {
  return typeof value === 'object' && value !== null && 'id' in value && 'email' in value && 'name' in value;
}

export function isFolderNode(value: unknown): value is FolderNode {
  return (
    typeof value === 'object' &&
    value !== null &&
    'id' in value &&
    'name' in value &&
    'children' in value &&
    Array.isArray((value as { children: unknown }).children)
  );
}

export function isFolderNodeArray(value: unknown): value is FolderNode[] {
  return Array.isArray(value) && value.every(isFolderNode);
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
