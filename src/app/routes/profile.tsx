import PersonIcon from '@mui/icons-material/Person';
import { Box, Stack, Typography } from '@mui/material';

import { Head } from '@/components/seo';

export const ProfileRoute = () => {
  return (
    <>
      <Head title="Профиль" />
      <Box p={3}>
        <Typography variant="h5" mb={3}>
          Профиль
        </Typography>
        <Stack alignItems="center" justifyContent="center" py={10} gap={2}>
          <PersonIcon sx={{ fontSize: 72, color: 'primary.light' }} />
          <Typography variant="h6" color="text.secondary" fontWeight={400}>
            Управление профилем
          </Typography>
        </Stack>
      </Box>
    </>
  );
};
