import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import { Box, Stack, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

import { Head } from '@/components/seo';

export const DriveRoute = () => {
  return (
    <>
      <Head title="Мой диск" />
      <Box p={3}>
        <Typography variant="h5" mb={3}>
          Мой диск
        </Typography>
        <Stack alignItems="center" justifyContent="center" py={10} gap={2}>
          <EmptyStateIcon />
          <Typography variant="h6" color="text.secondary" fontWeight={400}>
            Здесь будут ваши файлы и папки
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Загрузите первый файл или создайте папку
          </Typography>
        </Stack>
      </Box>
    </>
  );
};

const EmptyStateIcon = styled(FolderOpenIcon)(({ theme }) => ({
  fontSize: 72,
  color: theme.palette.primary.light,
}));
