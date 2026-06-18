import { ThemeOptions } from '@mui/material';

export const componentOverrides: ThemeOptions['components'] = {
  MuiCssBaseline: {
    styleOverrides: `
      html {
        height: 100%;
      }
      
      html, body, #root {
        display: flex;
        flex-direction: column;
      }
      
      body, #root {
        flex: 1;
      }
    `,
  },
};
