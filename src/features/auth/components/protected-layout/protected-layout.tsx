import { Navigate, Outlet, useLocation } from 'react-router-dom';

import { paths } from '@/config/paths';
import { useAuthStore } from '@/store/auth.store';

export const ProtectedLayout = () => {
  const { isAuthenticated } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to={paths.login.getHref()} state={{ from: location }} replace />;
  }

  return <Outlet />;
};
