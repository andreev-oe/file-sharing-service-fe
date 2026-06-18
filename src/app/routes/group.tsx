import GroupIcon from '@mui/icons-material/Group';
import { Box, Stack, Typography } from '@mui/material';
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
          <GroupIcon sx={{ fontSize: 72, color: 'primary.light' }} />
          <Typography variant="body2" color="text.secondary">
            ID: {groupId}
          </Typography>
        </Stack>
      </Box>
    </>
  );
};
