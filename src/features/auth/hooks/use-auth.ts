import { useAuthStore } from '@/store/auth.store';

import { useAuthContext } from '../components/auth-provider';

export const useAuth = () => {
  const { isLoading } = useAuthContext();
  const { user, isAuthenticated, clearAuth } = useAuthStore();

  return { user, isAuthenticated, isLoading, clearAuth };
};
