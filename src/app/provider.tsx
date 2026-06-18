import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ReactNode, Suspense, useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { HelmetProvider } from 'react-helmet-async';

import { MainErrorFallback } from '@/components/errors/main';
import { NotificationsProvider } from '@/components/ui/notifications';
import { ThemeProvider } from '@/components/ui/theme';
import { AuthProvider } from '@/features/auth/components/auth-provider';
import { queryConfig } from '@/lib/react-query';

import { ModalsProvider } from './modals-provider';

type AppProviderProps = {
  children: ReactNode;
};

export const AppProvider = ({ children }: AppProviderProps) => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: queryConfig,
      }),
  );

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ErrorBoundary FallbackComponent={MainErrorFallback}>
        <ThemeProvider>
          <HelmetProvider>
            <QueryClientProvider client={queryClient}>
              <NotificationsProvider>
                <AuthProvider>
                  <ModalsProvider />
                  {import.meta.env.DEV && <ReactQueryDevtools />}
                  {children}
                </AuthProvider>
              </NotificationsProvider>
            </QueryClientProvider>
          </HelmetProvider>
        </ThemeProvider>
      </ErrorBoundary>
    </Suspense>
  );
};
