import { CircularProgress, Stack } from '@mui/material';

export const PageLoader = () => {
  return (
    <Stack flexGrow={1} spacing={4} alignItems={'center'} justifyContent={'center'}>
      <CircularProgress />
    </Stack>
  );
};
