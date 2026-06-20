import { DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { ContextModalProps } from '@/components/ui/modals';
import { modals } from '@/components/ui/modals/methods';
import type { FolderNode } from '@/types/folders';

import { useFolderTree } from '../../hooks/use-folder-tree';
import { useUpdateFolder } from '../../hooks/use-update-folder';

export type MoveFolderModalProps = {
  folderId: string;
  folderName: string;
};

const renderTreeNodes = (nodes: FolderNode[], excludeId: string): React.ReactNode => {
  return nodes
    .filter((node) => node.id !== excludeId)
    .map((node) => (
      <TreeItem key={node.id} itemId={node.id} label={node.name}>
        {renderTreeNodes(node.children, excludeId)}
      </TreeItem>
    ));
};

export const MoveFolderModal = ({ id, innerProps }: ContextModalProps<MoveFolderModalProps>) => {
  const { folderId, folderName } = innerProps;
  const { data: tree, isLoading } = useFolderTree();
  const { mutateAsync, isPending } = useUpdateFolder();
  const [selectedParentId, setSelectedParentId] = useState<string | null>(null);

  const handleSelectedItemsChange = (_event: React.SyntheticEvent | null, itemId: string | null) => {
    setSelectedParentId(itemId);
  };

  const handleMoveToRoot = async () => {
    await mutateAsync({ id: folderId, data: { parentId: null } });
    modals.closeModal(id);
  };

  const handleMove = async () => {
    if (!selectedParentId) {
      return;
    }
    await mutateAsync({ id: folderId, data: { parentId: selectedParentId } });
    modals.closeModal(id);
  };

  return (
    <>
      <DialogTitle>{`Переместить "${folderName}"`}</DialogTitle>
      <DialogContent>
        <MoveFolderHint variant={'body2'} color={'text.secondary'}>
          Выберите папку назначения:
        </MoveFolderHint>
        {isLoading ? (
          <Typography variant={'body2'} color={'text.secondary'}>
            Загрузка...
          </Typography>
        ) : (
          <FolderTreeContainer>
            <SimpleTreeView selectedItems={selectedParentId} onSelectedItemsChange={handleSelectedItemsChange}>
              {renderTreeNodes(tree, folderId)}
            </SimpleTreeView>
          </FolderTreeContainer>
        )}
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            modals.closeModal(id);
          }}
        >
          Отмена
        </Button>
        <Button loading={isPending} onClick={handleMoveToRoot}>
          В корень
        </Button>
        <Button variant={'contained'} loading={isPending} disabled={selectedParentId === null} onClick={handleMove}>
          Переместить
        </Button>
      </DialogActions>
    </>
  );
};

const MoveFolderHint = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(1),
}));

const FolderTreeContainer = styled('div')(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
  minHeight: 200,
  maxHeight: 360,
  overflowY: 'auto',
  padding: theme.spacing(1),
}));
