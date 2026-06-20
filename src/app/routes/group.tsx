import GroupIcon from '@mui/icons-material/Group';
import { Box, Stack, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useParams } from 'react-router-dom';

import { Head } from '@/components/seo';

export const GroupRoute = () => {
  const { groupId } = useParams<{ groupId: string }>();

  return (
    <>
      <Head title="Группа" />
      <Box p={3}>
        <Typography variant="h5" mb={3}>
          Группа
        </Typography>
        <Stack alignItems="center" justifyContent="center" py={10} gap={2}>
          <EmptyStateIcon />
          <Typography variant="body2" color="text.secondary">
            ID: {groupId}
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
