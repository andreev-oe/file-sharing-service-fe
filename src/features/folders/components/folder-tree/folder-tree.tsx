import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import { Box, CircularProgress, Divider, IconButton, Menu, MenuItem, Tooltip, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { useState } from 'react';
import { useMatch } from 'react-router-dom';

import { CreatePermissionDtoResourceType } from '@/api/generated/types';
import { modals } from '@/components/ui/modals/methods';
import { paths } from '@/config/paths';
import { EContextModal } from '@/enums/modals.enums';
import type { FolderNode } from '@/types/folders';

import { useDeleteFolder } from '../../hooks/use-delete-folder';
import { useFolderTree } from '../../hooks/use-folder-tree';
import { FolderTreeNode } from '../folder-tree-node';

const MAX_FOLDER_DEPTH = 10;

type ContextMenuState = {
  mouseX: number;
  mouseY: number;
  node: FolderNode;
};

const findAncestorIds = (nodes: FolderNode[], targetId: string, path: string[] = []): string[] => {
  for (const node of nodes) {
    if (node.id === targetId) {
      return path;
    }
    const result = findAncestorIds(node.children, targetId, [...path, node.id]);
    if (result.length > 0) {
      return result;
    }
  }
  return [];
};

export const FolderTree = () => {
  const { data: tree, isLoading } = useFolderTree();
  const { mutate: deleteFolder } = useDeleteFolder();
  const [contextMenu, setContextMenu] = useState<ContextMenuState | null>(null);
  const folderMatch = useMatch(paths.folder.path);
  const activeFolderId = folderMatch?.params?.folderId ?? null;

  const handleContextMenu = (event: React.MouseEvent, node: FolderNode) => {
    setContextMenu({ mouseX: event.clientX, mouseY: event.clientY, node });
  };

  const handleCloseMenu = () => {
    setContextMenu(null);
  };

  const handleCreateRootFolder = () => {
    modals.openContextModal({
      modal: EContextModal.CREATE_FOLDER,
      innerProps: {},
    });
  };

  const handleCreateSubfolder = () => {
    if (!contextMenu) {
      return;
    }
    handleCloseMenu();
    modals.openContextModal({
      modal: EContextModal.CREATE_FOLDER,
      innerProps: { parentId: contextMenu.node.id, parentName: contextMenu.node.name },
    });
  };

  const handleRename = () => {
    if (!contextMenu) {
      return;
    }
    handleCloseMenu();
    modals.openContextModal({
      modal: EContextModal.RENAME_FOLDER,
      innerProps: { folderId: contextMenu.node.id, currentName: contextMenu.node.name },
    });
  };

  const handleMove = () => {
    if (!contextMenu) {
      return;
    }
    handleCloseMenu();
    modals.openContextModal({
      modal: EContextModal.MOVE_FOLDER,
      innerProps: { folderId: contextMenu.node.id, folderName: contextMenu.node.name },
    });
  };

  const handleManageAccess = () => {
    if (!contextMenu) {
      return;
    }
    handleCloseMenu();
    modals.openContextModal({
      modal: EContextModal.MANAGE_ACCESS,
      innerProps: {
        resourceId: contextMenu.node.id,
        resourceType: CreatePermissionDtoResourceType.folder,
        resourceName: contextMenu.node.name,
      },
    });
  };

  const handleDelete = () => {
    if (!contextMenu) {
      return;
    }
    const targetNode = contextMenu.node;
    handleCloseMenu();
    modals.openConfirmModal({
      title: 'Удалить папку',
      children: `Удалить "${targetNode.name}" и все вложенные элементы?`,
      onConfirm: () => {
        deleteFolder({ id: targetNode.id });
      },
      labels: { confirm: 'Удалить', cancel: 'Отмена' },
      confirmProps: { color: 'error' },
    });
  };

  return (
    <FolderTreeRoot>
      <FolderTreeHeader>
        <FolderSectionLabel variant={'caption'} color={'text.secondary'}>
          ПАПКИ
        </FolderSectionLabel>
        <Tooltip title={'Создать папку'}>
          <IconButton size={'small'} onClick={handleCreateRootFolder}>
            <CreateNewFolderIcon fontSize={'small'} />
          </IconButton>
        </Tooltip>
      </FolderTreeHeader>

      {isLoading && (
        <LoadingBox>
          <CircularProgress size={16} />
        </LoadingBox>
      )}

      {!isLoading && tree.length === 0 && (
        <EmptyLabel variant={'caption'} color={'text.disabled'}>
          Нет папок
        </EmptyLabel>
      )}

      {!isLoading && tree.length > 0 && (
        <SimpleTreeView
          selectedItems={activeFolderId}
          defaultExpandedItems={activeFolderId ? findAncestorIds(tree, activeFolderId) : []}
        >
          {tree.map((node) => (
            <FolderTreeNode key={node.id} node={node} onContextMenu={handleContextMenu} />
          ))}
        </SimpleTreeView>
      )}

      <Menu
        open={!!contextMenu}
        onClose={handleCloseMenu}
        anchorReference={'anchorPosition'}
        anchorPosition={contextMenu ? { top: contextMenu.mouseY, left: contextMenu.mouseX } : undefined}
      >
        <MenuItem
          onClick={handleCreateSubfolder}
          disabled={!!contextMenu && contextMenu.node.depth >= MAX_FOLDER_DEPTH}
        >
          Создать папку
        </MenuItem>
        <MenuItem onClick={handleRename}>Переименовать</MenuItem>
        <MenuItem onClick={handleMove}>Переместить</MenuItem>
        <MenuItem onClick={handleManageAccess}>
          <LockOpenIcon fontSize={'small'} />
          Управление доступом
        </MenuItem>
        <Divider />
        <DeleteMenuItem onClick={handleDelete}>Удалить</DeleteMenuItem>
      </Menu>
    </FolderTreeRoot>
  );
};

const FolderTreeRoot = styled(Box)(({ theme }) => ({
  paddingTop: theme.spacing(1),
  paddingBottom: theme.spacing(1),
  paddingLeft: theme.spacing(1),
  paddingRight: theme.spacing(1),
}));

const FolderTreeHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingLeft: theme.spacing(1.5),
  paddingRight: theme.spacing(0.5),
  marginBottom: theme.spacing(0.5),
}));

const FolderSectionLabel = styled(Typography)({
  fontWeight: 600,
  letterSpacing: '0.05em',
});

const LoadingBox = styled(Box)({
  display: 'flex',
  justifyContent: 'center',
  padding: 8,
});

const EmptyLabel = styled(Typography)(({ theme }) => ({
  display: 'block',
  paddingLeft: theme.spacing(1.5),
  fontSize: 12,
}));

const DeleteMenuItem = styled(MenuItem)(({ theme }) => ({
  color: theme.palette.error.main,
}));
