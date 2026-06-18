import { ReactNode } from 'react';

import { PageLoader } from '@/components/ui/page-loader';

import { useAuth } from '../../hooks/use-auth';

export const AuthGuard = ({ children }: { children: ReactNode }) => {
  const { isLoading } = useAuth();

  if (isLoading) {
    return <PageLoader />;
  }

  return <>{children}</>;
};
