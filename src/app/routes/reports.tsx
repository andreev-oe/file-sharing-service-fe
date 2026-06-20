import AssessmentIcon from '@mui/icons-material/Assessment';
import { Box, Stack, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

import { Head } from '@/components/seo';

export const ReportsRoute = () => {
  return (
    <>
      <Head title={'Отчёты'} />
      <Box p={3}>
        <Typography variant={'h5'} mb={3}>
          Отчёты
        </Typography>
        <Stack alignItems={'center'} justifyContent={'center'} py={10} gap={2}>
          <EmptyStateIcon />
          <Typography variant={'h6'} color={'text.secondary'} fontWeight={400}>
            Генерация и загрузка отчётов
          </Typography>
        </Stack>
      </Box>
    </>
  );
};

const EmptyStateIcon = styled(AssessmentIcon)(({ theme }) => ({
  fontSize: 72,
  color: theme.palette.primary.light,
}));
