import { SnackbarProvider, SnackbarProviderProps } from 'notistack';

import { CloseNotification } from './close-notification';

export const NotificationsProvider = (props: SnackbarProviderProps) => {
  return (
    <SnackbarProvider
      preventDuplicate
      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      action={(key) => <CloseNotification notificationKey={key} />}
      {...props}
    />
  );
};
