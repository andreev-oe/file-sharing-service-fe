import DeleteIcon from '@mui/icons-material/Delete';
import DownloadIcon from '@mui/icons-material/Download';
import DriveFileMoveIcon from '@mui/icons-material/DriveFileMove';
import EditIcon from '@mui/icons-material/Edit';
import HistoryIcon from '@mui/icons-material/History';
import { Divider, ListItemIcon, ListItemText, Menu, MenuItem } from '@mui/material';
import { styled } from '@mui/material/styles';

import { modals } from '@/components/ui/modals/methods';
import { EContextModal } from '@/enums/modals.enums';
import type { FileRecord } from '@/types/files';

import { useDeleteFile } from '../../hooks/use-delete-file';
import { useDownloadFile } from '../../hooks/use-download-file';

export type FileActionsMenuProps = {
  file: FileRecord | null;
  folderId: string;
  anchorPosition: { top: number; left: number } | null;
  onClose: () => void;
  onVersionsOpen: (file: FileRecord) => void;
};

export const FileActionsMenu = ({ file, folderId, anchorPosition, onClose, onVersionsOpen }: FileActionsMenuProps) => {
  const { mutate: deleteFile } = useDeleteFile(folderId);
  const { download, isLoading: isDownloading } = useDownloadFile();

  const handleDownload = async () => {
    if (!file) {
      return;
    }
    onClose();
    await download(file.id);
  };

  const handleRename = () => {
    if (!file) {
      return;
    }
    onClose();
    modals.openContextModal({
      modal: EContextModal.RENAME_FILE,
      innerProps: { fileId: file.id, folderId, currentName: file.name },
    });
  };

  const handleMove = () => {
    if (!file) {
      return;
    }
    onClose();
    modals.openContextModal({
      modal: EContextModal.MOVE_FILE,
      innerProps: { fileId: file.id, folderId, fileName: file.name },
    });
  };

  const handleVersions = () => {
    if (!file) {
      return;
    }
    onClose();
    onVersionsOpen(file);
  };

  const handleDelete = () => {
    if (!file) {
      return;
    }
    onClose();
    modals.openConfirmModal({
      title: 'Удалить файл',
      children: `Удалить "${file.name}"?`,
      onConfirm: () => {
        deleteFile({ id: file.id });
      },
      labels: { confirm: 'Удалить', cancel: 'Отмена' },
      confirmProps: { color: 'error' },
    });
  };

  return (
    <Menu
      open={!!anchorPosition && !!file}
      onClose={onClose}
      anchorReference={'anchorPosition'}
      anchorPosition={anchorPosition ?? undefined}
    >
      <MenuItem onClick={handleDownload} disabled={isDownloading}>
        <ListItemIcon>
          <DownloadIcon fontSize={'small'} />
        </ListItemIcon>
        <ListItemText>Скачать</ListItemText>
      </MenuItem>
      <Divider />
      <MenuItem onClick={handleRename}>
        <ListItemIcon>
          <EditIcon fontSize={'small'} />
        </ListItemIcon>
        <ListItemText>Переименовать</ListItemText>
      </MenuItem>
      <MenuItem onClick={handleMove}>
        <ListItemIcon>
          <DriveFileMoveIcon fontSize={'small'} />
        </ListItemIcon>
        <ListItemText>Переместить</ListItemText>
      </MenuItem>
      <MenuItem onClick={handleVersions}>
        <ListItemIcon>
          <HistoryIcon fontSize={'small'} />
        </ListItemIcon>
        <ListItemText>Версии</ListItemText>
      </MenuItem>
      <Divider />
      <DeleteMenuItem onClick={handleDelete}>
        <ListItemIcon>
          <DeleteIcon fontSize={'small'} color={'error'} />
        </ListItemIcon>
        <ListItemText>Удалить</ListItemText>
      </DeleteMenuItem>
    </Menu>
  );
};

const DeleteMenuItem = styled(MenuItem)(({ theme }) => ({
  color: theme.palette.error.main,
}));
