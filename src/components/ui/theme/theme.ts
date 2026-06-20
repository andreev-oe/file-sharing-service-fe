import { orange } from '@mui/material/colors';
import { ruRU as coreRU } from '@mui/material/locale';
import { alpha, createTheme } from '@mui/material/styles';

import { componentOverrides } from '@/components/ui/theme/overrides/component.overrides';

export const theme = createTheme(
  {
    palette: {
      primary: {
        main: orange[600],
        light: orange[200],
        dark: orange[800],
        contrastText: '#ffffff',
      },
      background: {
        default: '#F8F9FA',
        paper: '#FFFFFF',
      },
      text: {
        primary: '#111827',
        secondary: '#6B7280',
      },
      divider: 'rgba(0, 0, 0, 0.08)',
    },
    shape: {
      borderRadius: 10,
    },
    typography: {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      h4: { fontWeight: 700 },
      h5: { fontWeight: 700 },
      h6: { fontWeight: 600 },
      subtitle1: { fontWeight: 500 },
      button: {
        textTransform: 'none',
        fontWeight: 600,
      },
    },
    components: componentOverrides,
  },
  coreRU,
);

Object.assign(theme, { alpha });
