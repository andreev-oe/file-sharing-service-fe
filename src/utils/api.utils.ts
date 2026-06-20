import { AxiosError } from 'axios';

const SHARE_LINK_NOT_FOUND_MESSAGE = 'No active share link for this file';

export const isShareLinkNotFoundError = (error: unknown): boolean => {
  if (!(error instanceof AxiosError)) {
    return false;
  }
  const data = error.response?.data;
  return (
    error.response?.status === 404 &&
    data !== null &&
    typeof data === 'object' &&
    'message' in data &&
    data.message === SHARE_LINK_NOT_FOUND_MESSAGE
  );
};

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
