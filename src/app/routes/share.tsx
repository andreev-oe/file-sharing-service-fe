import LinkIcon from '@mui/icons-material/Link';
import { Box, CircularProgress, Stack, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';

import { Head } from '@/components/seo';

export const ShareRoute = () => {
  const { token } = useParams<{ token: string }>();

  return (
    <>
      <Head title="Публичная ссылка" />
      <Box
        sx={{
          minHeight: '100vh',
          bgcolor: 'background.default',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Stack alignItems="center" gap={2}>
          <LinkIcon sx={{ fontSize: 64, color: 'primary.main' }} />
          <Typography variant="h6">Загрузка файла...</Typography>
          <CircularProgress size={24} />
          <Typography variant="caption" color="text.secondary">
            Токен: {token}
          </Typography>
        </Stack>
      </Box>
    </>
  );
};
