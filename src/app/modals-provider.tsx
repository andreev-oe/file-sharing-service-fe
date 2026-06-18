import { ContextModalProps, ModalsManager } from '@/components/ui/modals';
import { EContextModal } from '@/enums/modals.enums';

const modals = {
  [EContextModal.EXAMPLE]: (props: ContextModalProps<{ example: string }>) => <div>{props.innerProps.example}</div>,
} as const;

declare module '@/components/ui/modals/types' {
  export interface ModalsOverride {
    modals: typeof modals;
  }
}

export const ModalsProvider = () => {
  return <ModalsManager modals={modals} labels={{ cancel: 'Отменить', confirm: 'Подтвердить' }} />;
};
