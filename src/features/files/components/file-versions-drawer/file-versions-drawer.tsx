import CloseIcon from '@mui/icons-material/Close';
import HistoryIcon from '@mui/icons-material/History';
import { Box, CircularProgress, Divider, Drawer, IconButton, Stack, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

import type { FileRecord } from '@/types/files';
import { formatDate, formatFileSize } from '@/utils/format.utils';

import { useFileVersions } from '../../hooks/use-file-versions';

const VERSIONS_DRAWER_WIDTH = 320;

export type FileVersionsDrawerProps = {
  file: FileRecord | null;
  onClose: () => void;
};

export const FileVersionsDrawer = ({ file, onClose }: FileVersionsDrawerProps) => {
  const { data: versions, isLoading } = useFileVersions(file?.id ?? '');

  return (
    <Drawer open={!!file} anchor={'right'} onClose={onClose} PaperProps={{ sx: { width: VERSIONS_DRAWER_WIDTH } }}>
      <DrawerHeader>
        <Stack direction={'row'} alignItems={'center'} gap={1}>
          <HistoryIcon fontSize={'small'} color={'primary'} />
          <Typography variant={'subtitle1'} fontWeight={600}>
            Версии файла
          </Typography>
        </Stack>
        <IconButton size={'small'} onClick={onClose}>
          <CloseIcon fontSize={'small'} />
        </IconButton>
      </DrawerHeader>
      {file && (
        <DrawerFileName variant={'body2'} color={'text.secondary'} noWrap>
          {file.name}
        </DrawerFileName>
      )}
      <Divider />
      <VersionsList>
        {isLoading && (
          <Stack alignItems={'center'} py={4}>
            <CircularProgress size={24} />
          </Stack>
        )}
        {!isLoading && versions.length === 0 && (
          <Typography variant={'body2'} color={'text.secondary'} align={'center'} py={4}>
            Нет версий
          </Typography>
        )}
        {!isLoading &&
          versions.map((version, index) => (
            <VersionItem key={version.version}>
              <Stack direction={'row'} justifyContent={'space-between'} alignItems={'flex-start'}>
                <Box>
                  <Typography variant={'body2'} fontWeight={index === 0 ? 600 : 400}>
                    Версия {version.version}
                    {index === 0 ? ' (текущая)' : ''}
                  </Typography>
                  <Typography variant={'caption'} color={'text.secondary'}>
                    {formatFileSize(version.size)}
                  </Typography>
                </Box>
                <Typography variant={'caption'} color={'text.secondary'} noWrap>
                  {formatDate(new Date(version.uploadedAt).getTime())}
                </Typography>
              </Stack>
              {index < versions.length - 1 && <Divider sx={{ mt: 1.5 }} />}
            </VersionItem>
          ))}
      </VersionsList>
    </Drawer>
  );
};

const DrawerHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: theme.spacing(2, 2, 1, 2),
}));

const DrawerFileName = styled(Typography)(({ theme }) => ({
  paddingLeft: theme.spacing(2),
  paddingRight: theme.spacing(2),
  paddingBottom: theme.spacing(1),
}));

const VersionsList = styled(Box)(({ theme }) => ({
  overflowY: 'auto',
  flex: 1,
  padding: theme.spacing(1, 0),
}));

const VersionItem = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1.5, 2),
}));
