import GroupIcon from '@mui/icons-material/Group';
import { Box, Stack, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

import { Head } from '@/components/seo';

export const GroupsRoute = () => {
  return (
    <>
      <Head title="Группы" />
      <Box p={3}>
        <Typography variant="h5" mb={3}>
          Группы
        </Typography>
        <Stack alignItems="center" justifyContent="center" py={10} gap={2}>
          <EmptyStateIcon />
          <Typography variant="h6" color="text.secondary" fontWeight={400}>
            Управление группами пользователей
          </Typography>
        </Stack>
      </Box>
    </>
  );
};

const EmptyStateIcon = styled(GroupIcon)(({ theme }) => ({
  fontSize: 72,
  color: theme.palette.primary.light,
}));
