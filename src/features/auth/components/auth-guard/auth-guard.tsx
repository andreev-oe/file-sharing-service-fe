import { ReactNode } from 'react';

import { PageLoader } from 'src/components/ui/page-loader';

import { useAuth } from '../../hooks/use-auth';

export type AuthGuardProps = {
  children: ReactNode;
};

export const AuthGuard = ({ children }: AuthGuardProps) => {
  const { isLoading } = useAuth();

  if (isLoading) {
    return <PageLoader />;
  }

  return children;
};
