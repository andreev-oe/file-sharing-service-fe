import CloseIcon from '@mui/icons-material/Close';
import DownloadIcon from '@mui/icons-material/Download';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import { Box, Chip, Divider, IconButton, Stack, Tooltip, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

import type { FileDto } from '@/api/generated/types';
import { Button } from '@/components/ui/button';
import { FileNotes } from '@/features/notes/components/file-notes';
import { formatDate, formatFileSize } from '@/utils/format.utils';

import { useDownloadFile } from '../../hooks/use-download-file';

export type FileDetailPanelProps = {
  file: FileDto;
  onClose: () => void;
};

export const FileDetailPanel = ({ file, onClose }: FileDetailPanelProps) => {
  const { download, isLoading: isDownloading } = useDownloadFile();

  const handleDownload = () => {
    download(file.id);
  };

  return (
    <PanelRoot>
      <PanelHeader>
        <Typography variant={'subtitle2'} fontWeight={600}>
          Свойства
        </Typography>
        <IconButton size={'small'} onClick={onClose}>
          <CloseIcon fontSize={'small'} />
        </IconButton>
      </PanelHeader>

      <Divider />

      <PanelContent>
        <PanelIconWrapper>
          <LargeFileIcon />
        </PanelIconWrapper>

        <Tooltip title={file.name}>
          <PanelFileName variant={'subtitle2'} align={'center'} noWrap>
            {file.name}
          </PanelFileName>
        </Tooltip>

        <VersionChip label={`v${file.version}`} size={'small'} color={'primary'} variant={'outlined'} />

        <Divider sx={{ width: '100%' }} />

        <MetaList>
          <MetaRow>
            <MetaLabel variant={'caption'} color={'text.secondary'}>
              Тип
            </MetaLabel>
            <MetaValue variant={'caption'} noWrap>
              {file.mimeType}
            </MetaValue>
          </MetaRow>
          <MetaRow>
            <MetaLabel variant={'caption'} color={'text.secondary'}>
              Размер
            </MetaLabel>
            <MetaValue variant={'caption'}>{formatFileSize(file.size)}</MetaValue>
          </MetaRow>
          <MetaRow>
            <MetaLabel variant={'caption'} color={'text.secondary'}>
              Загружен
            </MetaLabel>
            <MetaValue variant={'caption'} noWrap>
              {formatDate(new Date(file.createdAt).getTime())}
            </MetaValue>
          </MetaRow>
        </MetaList>

        <Stack direction={'row'} gap={1} width={'100%'}>
          <Button
            variant={'contained'}
            fullWidth
            startIcon={<DownloadIcon />}
            loading={isDownloading}
            onClick={handleDownload}
          >
            Скачать
          </Button>
        </Stack>

        <Divider sx={{ width: '100%' }} />

        <FileNotes fileId={file.id} />
      </PanelContent>
    </PanelRoot>
  );
};

const PanelRoot = styled(Box)(({ theme }) => ({
  width: 280,
  flexShrink: 0,
  borderLeft: `1px solid ${theme.palette.divider}`,
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  overflowY: 'auto',
}));

const PanelHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: theme.spacing(1.5, 2),
}));

const PanelContent = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: theme.spacing(1.5),
  padding: theme.spacing(2),
}));

const PanelIconWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 72,
  height: 72,
  borderRadius: '50%',
  backgroundColor: theme.palette.action.hover,
}));

const LargeFileIcon = styled(InsertDriveFileIcon)(({ theme }) => ({
  fontSize: 40,
  color: theme.palette.primary.main,
}));

const PanelFileName = styled(Typography)({
  width: '100%',
  maxWidth: 240,
});

const VersionChip = styled(Chip)({
  alignSelf: 'center',
});

const MetaList = styled(Box)({
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
});

const MetaRow = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  gap: 8,
});

const MetaLabel = styled(Typography)({
  flexShrink: 0,
});

const MetaValue = styled(Typography)({
  textAlign: 'right',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
});
