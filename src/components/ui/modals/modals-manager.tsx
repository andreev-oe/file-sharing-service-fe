import { Dialog, DialogTitle } from '@mui/material';
import React from 'react';

import { ConfirmModal } from './confirm-modal';
import { modals as modalMethods } from './methods';
import { useModals } from './store';
import { ConfirmLabels, ContextModalProps, ModalSettings, OpenConfirmModal } from './types';

export interface ModalsRendererProps {
  /** Predefined modals */
  modals?: Record<string, React.FC<ContextModalProps<any>>>;

  /** Shared Modal component props, applied for every modal */
  modalProps?: Omit<ModalSettings, 'title'>;

  /** Confirm modal labels */
  labels?: ConfirmLabels;
}

export function ModalsManager({ modalProps, labels, modals }: ModalsRendererProps) {
  const state = useModals();
  const getCurrentModal = () => {
    const currentModal = state.current;
    switch (currentModal?.type) {
      case 'context': {
        const { innerProps, ...rest } = currentModal.props;
        const ContextModal = modals![currentModal.ctx];

        return {
          modalProps: rest,
          content: <ContextModal innerProps={innerProps} id={currentModal.id} />,
        };
      }
      case 'confirm': {
        const { modalProps: separatedModalProps, confirmProps: separatedConfirmProps } = separateConfirmModalProps(
          currentModal.props,
        );

        return {
          modalProps: separatedModalProps,
          content: (
            <ConfirmModal
              {...separatedConfirmProps}
              id={currentModal.id}
              labels={currentModal.props.labels || labels}
            />
          ),
        };
      }
      case 'content': {
        const { children: currentModalChildren, ...rest } = currentModal.props;

        return {
          modalProps: rest,
          content: currentModalChildren,
        };
      }
      default: {
        return {
          modalProps: {},
          content: null,
        };
      }
    }
  };

  const { modalProps: currentModalProps, content } = getCurrentModal();
  const { title, ...dialogProps } = currentModalProps as ModalSettings;

  return (
    <Dialog
      fullWidth
      {...modalProps}
      {...dialogProps}
      open={state.modals.length > 0}
      onClose={() => modalMethods.closeModal(state.current?.id as any)}
    >
      {title && <DialogTitle>{title}</DialogTitle>}
      {content}
    </Dialog>
  );
}

function separateConfirmModalProps(props: OpenConfirmModal) {
  if (!props) {
    return { confirmProps: {}, modalProps: {} };
  }

  const {
    id,
    children,
    onCancel,
    onConfirm,
    closeOnConfirm,
    closeOnCancel,
    cancelProps,
    confirmProps,
    groupProps,
    labels,
    ...others
  } = props;

  return {
    confirmProps: {
      id,
      children,
      onCancel,
      onConfirm,
      closeOnConfirm,
      closeOnCancel,
      cancelProps,
      confirmProps,
      groupProps,
      labels,
    },
    modalProps: {
      id,
      ...others,
    },
  };
}
