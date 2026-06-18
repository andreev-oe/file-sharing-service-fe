import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

import { ModalSettings, OpenConfirmModal, OpenContextModal } from './types';

export type ModalState =
  | { id: string; props: ModalSettings; type: 'content' }
  | { id: string; props: OpenConfirmModal; type: 'confirm' }
  | { id: string; props: OpenContextModal; type: 'context'; ctx: string };

interface ModalsState {
  modals: ModalState[];

  /**
   * Modal that is currently open or was the last open one.
   * Keeping the last one is necessary for providing a clean exit transition.
   */
  current: ModalState | null;
}

interface ModalsSetters {
  openModal: (modal: ModalState) => void;
  closeModal: (modalId: string, canceled?: boolean) => void;
  closeAllModals: (canceled?: boolean) => void;
  updateModal: (modalId: string, newProps: Partial<ModalSettings>) => void;
}

function handleCloseModal(modal: ModalState, canceled?: boolean) {
  if (canceled && modal.type === 'confirm') {
    modal.props.onCancel?.();
  }

  modal.props.onClose?.({}, 'backdropClick');
}

export const useModals = create<ModalsState>()(
  devtools<ModalsState>(() => ({
    modals: [],
    current: null,
  })),
);

const set = useModals.setState;

export const setters: ModalsSetters = {
  openModal: (modal) =>
    set(
      (state) => ({
        current: modal,
        modals: [...state.modals, modal],
      }),
      undefined,
      'modals/open',
    ),
  closeModal: (modalId, canceled) =>
    set(
      (state) => {
        const modal = state.modals.find((m) => m.id === modalId);
        if (!modal) {
          return state;
        }

        handleCloseModal(modal, canceled);

        const remainingModals = state.modals.filter((m) => m.id !== modalId);

        return {
          current: remainingModals[remainingModals.length - 1] || state.current,
          modals: remainingModals,
        };
      },
      undefined,
      'modals/close',
    ),
  closeAllModals: (canceled) =>
    set(
      (state) => {
        if (!state.modals.length) {
          return state;
        }

        // Resolve modal stack from top to bottom
        state.modals
          .concat()
          .reverse()
          .forEach((modal) => {
            handleCloseModal(modal, canceled);
          });

        return {
          current: state.current,
          modals: [],
        };
      },
      undefined,
      'modals/closeAll',
    ),
  updateModal: (modalId, newProps) =>
    set(
      (state) => {
        const updatedModals = state.modals.map((modal) => {
          if (modal.id !== modalId) {
            return modal;
          }

          if (modal.type === 'content' || modal.type === 'confirm') {
            return {
              ...modal,
              props: {
                ...modal.props,
                ...newProps,
              },
            };
          }

          if (modal.type === 'context') {
            return {
              ...modal,
              props: {
                ...modal.props,
                ...newProps,
                innerProps: {
                  ...modal.props.innerProps,
                  ...(newProps as Partial<OpenContextModal<any>>).innerProps,
                },
              },
            };
          }

          return modal;
        });

        const currentModal =
          state.current?.id === modalId
            ? updatedModals.find((modal) => modal.id === modalId) || state.current
            : state.current;

        return {
          ...state,
          modals: updatedModals,
          current: currentModal,
        };
      },
      undefined,
      'modals/update',
    ),
};
