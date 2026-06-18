import { Outlet } from 'react-router-dom';

import { DashboardLayout } from '@/components/layouts';

export const RootLayout = () => {
  return (
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  );
};
