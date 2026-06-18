import Close from '@mui/icons-material/Close';
import { IconButton, IconButtonProps } from '@mui/material';
import { SnackbarKey } from 'notistack';
import { forwardRef } from 'react';

import { useNotifications } from '../use-notifications';

export const CloseNotification = forwardRef<HTMLButtonElement, IconButtonProps & { notificationKey: SnackbarKey }>(
  function CloseButton({ notificationKey, ...props }, ref) {
    const { close } = useNotifications();

    const handleClick = () => {
      close(notificationKey);
    };

    return (
      <IconButton size="small" aria-label="close" color="inherit" ref={ref} onClick={handleClick} {...props}>
        <Close fontSize="small" />
      </IconButton>
    );
  },
);
