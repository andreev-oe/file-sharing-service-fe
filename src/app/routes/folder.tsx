import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import { Box, Stack, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';

import { Head } from '@/components/seo';

export const FolderRoute = () => {
  const { folderId } = useParams<{ folderId: string }>();

  return (
    <>
      <Head title="Папка" />
      <Box p={3}>
        <Typography variant="h5" mb={3}>
          Папка
        </Typography>
        <Stack alignItems="center" justifyContent="center" py={10} gap={2}>
          <FolderOpenIcon sx={{ fontSize: 72, color: 'primary.light' }} />
          <Typography variant="body2" color="text.secondary">
            ID: {folderId}
          </Typography>
        </Stack>
      </Box>
    </>
  );
};
