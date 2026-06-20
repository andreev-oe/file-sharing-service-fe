import { DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import { useState } from 'react';

import type { FolderTreeNodeDto } from '@/api/generated/types';
import { Button } from '@/components/ui/button';
import { ContextModalProps } from '@/components/ui/modals';
import { modals } from '@/components/ui/modals/methods';
import { useFolderTree } from '@/features/folders/hooks/use-folder-tree';

import { useUpdateFile } from '../../hooks/use-update-file';

export type MoveFileModalProps = {
  fileId: string;
  folderId: string;
  fileName: string;
};

const renderTreeNodes = (nodes: FolderTreeNodeDto[]): React.ReactNode => {
  return nodes.map((node) => (
    <TreeItem key={node.id} itemId={node.id} label={node.name}>
      {renderTreeNodes(node.children)}
    </TreeItem>
  ));
};

export const MoveFileModal = ({ id, innerProps }: ContextModalProps<MoveFileModalProps>) => {
  const { fileId, folderId, fileName } = innerProps;
  const { data: tree, isLoading } = useFolderTree();
  const { mutateAsync, isPending } = useUpdateFile(folderId);
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);

  const handleSelectedItemsChange = (_event: React.SyntheticEvent | null, itemId: string | null) => {
    setSelectedFolderId(itemId);
  };

  const handleMoveToRoot = async () => {
    await mutateAsync({ id: fileId, data: { folderId: null } });
    modals.closeModal(id);
  };

  const handleMove = async () => {
    if (!selectedFolderId) {
      return;
    }
    await mutateAsync({ id: fileId, data: { folderId: selectedFolderId } });
    modals.closeModal(id);
  };

  return (
    <>
      <DialogTitle>{`Переместить "${fileName}"`}</DialogTitle>
      <DialogContent>
        <MoveFileHint variant={'body2'} color={'text.secondary'}>
          Выберите папку назначения:
        </MoveFileHint>
        {isLoading ? (
          <Typography variant={'body2'} color={'text.secondary'}>
            Загрузка...
          </Typography>
        ) : (
          <FolderTreeContainer>
            <SimpleTreeView selectedItems={selectedFolderId} onSelectedItemsChange={handleSelectedItemsChange}>
              {renderTreeNodes(tree)}
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
        <Button variant={'contained'} loading={isPending} disabled={selectedFolderId === null} onClick={handleMove}>
          Переместить
        </Button>
      </DialogActions>
    </>
  );
};

const MoveFileHint = styled(Typography)(({ theme }) => ({
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
