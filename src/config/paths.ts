export interface AppPath {
  // Относительный путь
  path: string;
  // Абсолютный путь (для ссылок, например)
  getHref?: (...args: any[]) => string;
}

export interface AppPaths extends Record<string, AppPath | AppPaths> {}

// Пути приложения
export const paths = {
  home: {
    path: '/',
    getHref: () => '/',
  },
} as const satisfies AppPaths;
