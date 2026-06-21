export interface AppPath {
  path: string;
  getHref?: (...args: any[]) => string;
}

export interface AppPaths extends Record<string, AppPath | AppPaths> {}

export const paths = {
  home: { path: '/', getHref: () => '/' },
  login: { path: '/login', getHref: () => '/login' },
  register: { path: '/register', getHref: () => '/register' },
  drive: { path: '/drive', getHref: () => '/drive' },
  folder: {
    path: '/drive/folder/:folderId',
    getHref: (folderId: string) => `/drive/folder/${folderId}`,
  },
  profile: { path: '/profile', getHref: () => '/profile' },
  groups: { path: '/groups', getHref: () => '/groups' },
  group: {
    path: '/groups/:groupId',
    getHref: (groupId: string) => `/groups/${groupId}`,
  },
  reports: { path: '/reports', getHref: () => '/reports' },
  permissions: { path: '/permissions', getHref: () => '/permissions' },
  share: {
    path: '/share/:token',
    getHref: (token: string) => `/share/${token}`,
  },
} as const satisfies AppPaths;
