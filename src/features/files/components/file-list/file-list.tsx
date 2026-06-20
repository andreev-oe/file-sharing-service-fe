import GridViewIcon from '@mui/icons-material/GridView';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import ViewListIcon from '@mui/icons-material/ViewList';
import {
  Box,
  CircularProgress,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import { styled } from '@mui/material/styles';
import { useState } from 'react';

import type { FileDto } from '@/api/generated/types';

import { useFiles } from '../../hooks/use-files';
import { useUploadFile } from '../../hooks/use-upload-file';
import { FileActionsMenu } from '../file-actions-menu';
import { FileDetailPanel } from '../file-detail-panel';
import { FileListItem } from '../file-list-item';
import { FileUploadProgress } from '../file-upload-progress';
import { FileUploadZone } from '../file-upload-zone';
import { FileVersionsDrawer } from '../file-versions-drawer';

type ViewMode = 'list' | 'grid';

type ActionsMenuState = {
  anchorPosition: { top: number; left: number };
  file: FileDto;
};

export type FileListProps = {
  folderId: string;
};

export const FileList = ({ folderId }: FileListProps) => {
  const { data: files, isLoading } = useFiles(folderId);
  const { upload, isUploading, uploadProgress } = useUploadFile();
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedFile, setSelectedFile] = useState<FileDto | null>(null);
  const [actionsMenu, setActionsMenu] = useState<ActionsMenuState | null>(null);
  const [versionsFile, setVersionsFile] = useState<FileDto | null>(null);
  const [uploadingFileName, setUploadingFileName] = useState('');

  const handleFilesSelected = async (files: File[]) => {
    for (const file of files) {
      setUploadingFileName(file.name);
      await upload({ folderId, file });
    }
    setUploadingFileName('');
  };

  const handleFileSelect = (file: FileDto) => {
    setSelectedFile((previous) => (previous?.id === file.id ? null : file));
  };

  const handleMenuOpen = (event: React.MouseEvent, file: FileDto) => {
    setActionsMenu({ anchorPosition: { top: event.clientY, left: event.clientX }, file });
  };

  const handleMenuClose = () => {
    setActionsMenu(null);
  };

  const handleVersionsOpen = (file: FileDto) => {
    setVersionsFile(file);
  };

  const handleVersionsClose = () => {
    setVersionsFile(null);
  };

  const handleDetailPanelClose = () => {
    setSelectedFile(null);
  };

  return (
    <FileListRoot>
      <MainArea>
        <FileListHeader>
          <Typography variant={'h6'}>Файлы</Typography>
          <ViewToggleGroup>
            <Tooltip title={'Список'}>
              <IconButton
                size={'small'}
                color={viewMode === 'list' ? 'primary' : 'default'}
                onClick={() => {
                  setViewMode('list');
                }}
              >
                <ViewListIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title={'Сетка'}>
              <IconButton
                size={'small'}
                color={viewMode === 'grid' ? 'primary' : 'default'}
                onClick={() => {
                  setViewMode('grid');
                }}
              >
                <GridViewIcon />
              </IconButton>
            </Tooltip>
          </ViewToggleGroup>
        </FileListHeader>

        <UploadSection>
          <FileUploadZone onFilesSelected={handleFilesSelected} isUploading={isUploading} />
          {isUploading && uploadingFileName && (
            <FileUploadProgress fileName={uploadingFileName} progress={uploadProgress} />
          )}
        </UploadSection>

        {isLoading && (
          <Stack alignItems={'center'} py={6}>
            <CircularProgress />
          </Stack>
        )}

        {!isLoading && files.length === 0 && (
          <EmptyState>
            <EmptyStateIcon />
            <Typography variant={'body1'} color={'text.secondary'}>
              Нет файлов
            </Typography>
            <Typography variant={'body2'} color={'text.disabled'}>
              Загрузите первый файл с помощью формы выше
            </Typography>
          </EmptyState>
        )}

        {!isLoading && files.length > 0 && viewMode === 'list' && (
          <Table size={'small'}>
            <TableHead>
              <TableRow>
                <TableCell width={40} />
                <TableCell>Название</TableCell>
                <TableCell width={80}>Размер</TableCell>
                <TableCell width={60}>Версия</TableCell>
                <TableCell width={160}>Автор</TableCell>
                <TableCell width={160}>Изменён</TableCell>
                <TableCell width={48} padding={'none'} />
              </TableRow>
            </TableHead>
            <TableBody>
              {files.map((file) => (
                <FileListItem
                  key={file.id}
                  file={file}
                  viewMode={'list'}
                  isSelected={selectedFile?.id === file.id}
                  onSelect={handleFileSelect}
                  onMenuOpen={handleMenuOpen}
                />
              ))}
            </TableBody>
          </Table>
        )}

        {!isLoading && files.length > 0 && viewMode === 'grid' && (
          <GridContainer>
            <Grid container spacing={1.5}>
              {files.map((file) => (
                <Grid key={file.id} size={{ xs: 6, sm: 4, md: 3, lg: 2 }}>
                  <FileListItem
                    file={file}
                    viewMode={'grid'}
                    isSelected={selectedFile?.id === file.id}
                    onSelect={handleFileSelect}
                    onMenuOpen={handleMenuOpen}
                  />
                </Grid>
              ))}
            </Grid>
          </GridContainer>
        )}

        <FileActionsMenu
          file={actionsMenu?.file ?? null}
          folderId={folderId}
          anchorPosition={actionsMenu?.anchorPosition ?? null}
          onClose={handleMenuClose}
          onVersionsOpen={handleVersionsOpen}
        />

        <FileVersionsDrawer file={versionsFile} onClose={handleVersionsClose} />
      </MainArea>

      {selectedFile && <FileDetailPanel file={selectedFile} onClose={handleDetailPanelClose} />}
    </FileListRoot>
  );
};

const FileListRoot = styled(Box)({
  display: 'flex',
  height: '100%',
  overflow: 'hidden',
});

const MainArea = styled(Box)({
  flex: 1,
  overflowY: 'auto',
  display: 'flex',
  flexDirection: 'column',
});

const FileListHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: theme.spacing(2, 3, 1, 3),
}));

const ViewToggleGroup = styled(Box)({
  display: 'flex',
  gap: 4,
});

const UploadSection = styled(Box)(({ theme }) => ({
  padding: theme.spacing(0, 3, 2, 3),
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1),
}));

const EmptyState = styled(Stack)(({ theme }) => ({
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.spacing(1),
  padding: theme.spacing(8, 3),
}));

const EmptyStateIcon = styled(InsertDriveFileIcon)(({ theme }) => ({
  fontSize: 72,
  color: theme.palette.primary.light,
}));

const GridContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(0, 3, 3, 3),
}));
