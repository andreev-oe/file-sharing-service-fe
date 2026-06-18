import { Stack } from '@mui/material';
import { PropsWithChildren } from 'react';

import { UserMenu } from '@/features/auth/components/user-menu';

export const DashboardLayout = ({ children }: PropsWithChildren) => {
  return (
    <Stack flex={1}>
      <Stack
        component={'header'}
        direction={'row'}
        alignItems={'center'}
        justifyContent={'space-between'}
        p={1}
        gap={1}
        bgcolor={'primary.light'}
      >
        <Stack direction={'row'} alignItems={'center'} gap={1} />
        <UserMenu />
      </Stack>
      <Stack flex={'1 1 0'} overflow="auto">
        {children}
      </Stack>
    </Stack>
  );
};
