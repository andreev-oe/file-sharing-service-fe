import { ContextModalProps, ModalsManager } from '@/components/ui/modals';
import { EContextModal } from '@/enums/modals.enums';
import { MoveFileModal } from '@/features/files/components/move-file-modal';
import type { MoveFileModalProps } from '@/features/files/components/move-file-modal';
import { RenameFileModal } from '@/features/files/components/rename-file-modal';
import type { RenameFileModalProps } from '@/features/files/components/rename-file-modal';
import { CreateFolderModal } from '@/features/folders/components/create-folder-modal';
import type { CreateFolderModalProps } from '@/features/folders/components/create-folder-modal';
import { MoveFolderModal } from '@/features/folders/components/move-folder-modal';
import type { MoveFolderModalProps } from '@/features/folders/components/move-folder-modal';
import { RenameFolderModal } from '@/features/folders/components/rename-folder-modal';
import type { RenameFolderModalProps } from '@/features/folders/components/rename-folder-modal';
import { PermissionsModal } from '@/features/permissions/components/permissions-modal';
import type { PermissionsModalProps } from '@/features/permissions/components/permissions-modal';

const modals = {
  [EContextModal.EXAMPLE]: (props: ContextModalProps<{ example: string }>) => <div>{props.innerProps.example}</div>,
  [EContextModal.CREATE_FOLDER]: (props: ContextModalProps<CreateFolderModalProps>) => <CreateFolderModal {...props} />,
  [EContextModal.RENAME_FOLDER]: (props: ContextModalProps<RenameFolderModalProps>) => <RenameFolderModal {...props} />,
  [EContextModal.MOVE_FOLDER]: (props: ContextModalProps<MoveFolderModalProps>) => <MoveFolderModal {...props} />,
  [EContextModal.RENAME_FILE]: (props: ContextModalProps<RenameFileModalProps>) => <RenameFileModal {...props} />,
  [EContextModal.MOVE_FILE]: (props: ContextModalProps<MoveFileModalProps>) => <MoveFileModal {...props} />,
  [EContextModal.MANAGE_ACCESS]: (props: ContextModalProps<PermissionsModalProps>) => <PermissionsModal {...props} />,
} as const;

declare module '@/components/ui/modals/types' {
  export interface ModalsOverride {
    modals: typeof modals;
  }
}

export const ModalsProvider = () => {
  return <ModalsManager modals={modals} labels={{ cancel: 'Отменить', confirm: 'Подтвердить' }} />;
};
