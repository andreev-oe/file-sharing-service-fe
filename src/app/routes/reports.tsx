import AssessmentIcon from '@mui/icons-material/Assessment';
import { Box, Stack, Typography } from '@mui/material';

import { Head } from '@/components/seo';

export const ReportsRoute = () => {
  return (
    <>
      <Head title="Отчёты" />
      <Box p={3}>
        <Typography variant="h5" mb={3}>
          Отчёты
        </Typography>
        <Stack alignItems="center" justifyContent="center" py={10} gap={2}>
          <AssessmentIcon sx={{ fontSize: 72, color: 'primary.light' }} />
          <Typography variant="h6" color="text.secondary" fontWeight={400}>
            Генерация и загрузка отчётов
          </Typography>
        </Stack>
      </Box>
    </>
  );
};
