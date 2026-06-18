import { CssBaseline, ThemeProvider as MuiThemeProvider } from '@mui/material';
import type { FC, PropsWithChildren } from 'react';

import { theme } from './theme';

export const ThemeProvider: FC<PropsWithChildren> = ({ children }) => (
  <MuiThemeProvider theme={theme}>
    <CssBaseline />
    {children}
  </MuiThemeProvider>
);
