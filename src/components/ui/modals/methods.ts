import { nanoid } from 'nanoid';

import { setters } from './store';
import { Modal, Modals, ModalSettings, OpenConfirmModal, OpenContextModal } from './types';

export interface ModalsMethods {
  openModal: (props: ModalSettings) => string;
  openConfirmModal: (modal: OpenConfirmModal) => string;
  openContextModal: <TKey extends Modal>(
    payload: OpenContextModal<Parameters<Modals[TKey]>[0]['innerProps']> & { modal: TKey },
  ) => string;
  closeModal: (id: string, canceled?: boolean) => void;
  closeAll: () => void;
  closeContextModal: <TKey extends Modal>(id: TKey) => void;
  updateModal: (payload: { modalId: string } & Partial<ModalSettings>) => void;
  updateContextModal: (payload: { modalId: string } & Partial<OpenContextModal<any>>) => void;
}

export const modals: ModalsMethods = {
  openModal: ({ modalId, ...props }) => {
    const id = modalId || nanoid();
    setters.openModal({ id, type: 'content', props });
    return id;
  },
  openConfirmModal: ({ modalId, ...props }) => {
    const id = modalId || nanoid();
    setters.openModal({ id, props, type: 'confirm' });
    return id;
  },
  openContextModal: ({ modalId, modal, ...props }) => {
    const id = modalId || nanoid();
    setters.openModal({ id, type: 'context', props, ctx: modal });
    return id;
  },
  closeModal: setters.closeModal,
  closeContextModal: setters.closeModal,
  closeAll: setters.closeAllModals,
  updateModal: ({ modalId, ...newProps }) => setters.updateModal(modalId, newProps),
  updateContextModal: ({ modalId, ...newProps }) => setters.updateModal(modalId, newProps),
};

export const useModals = () => modals;
