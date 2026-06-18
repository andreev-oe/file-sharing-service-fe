import { useMemo } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import { paths } from '@/config/paths';
import { ProtectedLayout } from '@/features/auth/components/protected-layout';

import { RootLayout } from './layout';

const createAppRouter = () =>
  createBrowserRouter(
    [
      // Public routes
      {
        path: paths.login.path,
        lazy: async () => {
          const { LoginRoute } = await import('./routes/login');
          return { Component: LoginRoute };
        },
      },
      {
        path: paths.register.path,
        lazy: async () => {
          const { RegisterRoute } = await import('./routes/register');
          return { Component: RegisterRoute };
        },
      },
      {
        path: paths.share.path,
        lazy: async () => {
          const { ShareRoute } = await import('./routes/share');
          return { Component: ShareRoute };
        },
      },
      // Protected routes
      {
        element: <ProtectedLayout />,
        children: [
          {
            element: <RootLayout />,
            children: [
              {
                path: paths.home.path,
                lazy: async () => {
                  const { LandingRoute } = await import('./routes/landing');
                  return { Component: LandingRoute };
                },
              },
              {
                path: paths.drive.path,
                lazy: async () => {
                  const { DriveRoute } = await import('./routes/drive');
                  return { Component: DriveRoute };
                },
              },
              {
                path: paths.folder.path,
                lazy: async () => {
                  const { FolderRoute } = await import('./routes/folder');
                  return { Component: FolderRoute };
                },
              },
              {
                path: paths.profile.path,
                lazy: async () => {
                  const { ProfileRoute } = await import('./routes/profile');
                  return { Component: ProfileRoute };
                },
              },
              {
                path: paths.groups.path,
                lazy: async () => {
                  const { GroupsRoute } = await import('./routes/groups');
                  return { Component: GroupsRoute };
                },
              },
              {
                path: paths.group.path,
                lazy: async () => {
                  const { GroupRoute } = await import('./routes/group');
                  return { Component: GroupRoute };
                },
              },
              {
                path: paths.reports.path,
                lazy: async () => {
                  const { ReportsRoute } = await import('./routes/reports');
                  return { Component: ReportsRoute };
                },
              },
            ],
          },
        ],
      },
      // 404
      {
        path: '*',
        lazy: async () => {
          const { NotFoundRoute } = await import('./routes/not-found');
          return { Component: NotFoundRoute };
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
  const router = useMemo(() => createAppRouter(), []);
  return <RouterProvider future={{ v7_startTransition: true }} router={router} />;
};
