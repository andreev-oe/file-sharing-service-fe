import { AuthGuard } from '@/features/auth/components/auth-guard';

import { AppProvider } from './provider';
import { AppRouter } from './router';

export const App = () => {
  return (
    <AppProvider>
      <AuthGuard>
        <AppRouter />
      </AuthGuard>
    </AppProvider>
  );
};
