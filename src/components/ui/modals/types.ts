import { DialogProps } from '@mui/material';
import React, { ReactNode } from 'react';

import type { ConfirmModalProps } from './confirm-modal';

export type ModalSettings = Partial<Omit<DialogProps, 'open' | 'title'>> & { modalId?: string; title?: ReactNode };

export type ConfirmLabels = Record<'confirm' | 'cancel', ReactNode>;

export interface OpenConfirmModal extends ModalSettings, ConfirmModalProps {}
export interface OpenContextModal<CustomProps extends Record<string, any> = object> extends ModalSettings {
  innerProps: CustomProps;
}

export interface ContextModalProps<T extends Record<string, any> = object> {
  innerProps: T;
  id: string;
}

export interface ModalsOverride {}

export type ModalsOverwritten = ModalsOverride extends {
  modals: Record<string, React.FC<ContextModalProps<any>>>;
}
  ? ModalsOverride
  : {
      modals: Record<string, React.FC<ContextModalProps<any>>>;
    };

export type Modals = ModalsOverwritten['modals'];

export type Modal = keyof Modals;
