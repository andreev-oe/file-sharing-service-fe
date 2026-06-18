import { closeSnackbar, enqueueSnackbar } from 'notistack';

export type Notifications = typeof notifications;

export const notifications = {
  get add() {
    return enqueueSnackbar;
  },
  get close() {
    return closeSnackbar;
  },
} as const;

export const useNotifications = () => notifications;
