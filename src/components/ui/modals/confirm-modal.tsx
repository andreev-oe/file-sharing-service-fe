import { DialogActions, DialogActionsProps, DialogContent } from '@mui/material';
import React, { useState } from 'react';

import { isPromise } from '@/utils/async.utils';

import { Button, ButtonProps } from '../button';

import { modals } from './methods';
import { ConfirmLabels } from './types';

export interface ConfirmModalProps {
  id?: string;
  children?: React.ReactNode;
  onCancel?: () => void;
  onConfirm?: () => unknown;
  closeOnConfirm?: boolean;
  closeOnCancel?: boolean;
  cancelProps?: ButtonProps;
  confirmProps?: ButtonProps;
  groupProps?: DialogActionsProps;
  labels?: ConfirmLabels;
}

export function ConfirmModal({
  id,
  cancelProps,
  confirmProps,
  labels = { cancel: '', confirm: '' },
  closeOnConfirm = true,
  closeOnCancel = true,
  groupProps,
  onCancel,
  onConfirm,
  children,
}: ConfirmModalProps) {
  const { cancel: cancelLabel, confirm: confirmLabel } = labels;
  const [loading, setLoading] = useState(false);

  const handleCancel = (event: React.MouseEvent<HTMLButtonElement>) => {
    typeof cancelProps?.onClick === 'function' && cancelProps?.onClick(event);
    typeof onCancel === 'function' && onCancel();
    closeOnCancel && modals.closeModal(id!);
  };

  const handleConfirm = (event: React.MouseEvent<HTMLButtonElement>) => {
    const handleClose = () => {
      closeOnConfirm && modals.closeModal(id!);
    };

    typeof confirmProps?.onClick === 'function' && confirmProps?.onClick(event);
    const result = typeof onConfirm === 'function' && onConfirm();

    if (isPromise(result)) {
      setLoading(true);
      result.then(handleClose).finally(() => setLoading(false));
    } else {
      handleClose();
    }
  };

  return (
    <>
      {children && <DialogContent>{children}</DialogContent>}

      <DialogActions {...groupProps}>
        <Button {...cancelProps} onClick={handleCancel}>
          {cancelProps?.children || cancelLabel}
        </Button>

        <Button loading={loading} variant={'contained'} {...confirmProps} onClick={handleConfirm}>
          {confirmProps?.children || confirmLabel}
        </Button>
      </DialogActions>
    </>
  );
}
