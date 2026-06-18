import { QueryClient, useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import { RootLayout } from '@/app/layout';
import { paths } from '@/config/paths';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const createAppRouter = (queryClient: QueryClient) =>
  createBrowserRouter(
    [
      {
        path: paths.home.path,
        element: <RootLayout />,
        children: [
          {
            index: true,
            lazy: async () => {
              const { LandingRoute } = await import('./routes/landing');
              return { Component: LandingRoute };
            },
          },
        ],
      },
      {
        path: '*',
        lazy: async () => {
          const { NotFoundRoute } = await import('./routes/not-found');
          return {
            Component: NotFoundRoute,
          };
        },
      },
    ],
    {
      future: {
        v7_relativeSplatPath: true,
        v7_fetcherPersist: true,
        v7_normalizeFormMethod: true,
        v7_skipActionErrorRevalidation: true,
      },
    },
  );

export const AppRouter = () => {
  const queryClient = useQueryClient();

  const router = useMemo(() => createAppRouter(queryClient), [queryClient]);

  return <RouterProvider future={{ v7_startTransition: true }} router={router} />;
};
