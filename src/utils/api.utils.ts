import { AxiosError } from 'axios';

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
