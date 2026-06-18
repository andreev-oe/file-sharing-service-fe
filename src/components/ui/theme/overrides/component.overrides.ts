import { ThemeOptions } from '@mui/material';

export const componentOverrides: ThemeOptions['components'] = {
  MuiCssBaseline: {
    styleOverrides: `
      html { height: 100%; }
      html, body, #root { display: flex; flex-direction: column; }
      body, #root { flex: 1; }
      * { box-sizing: border-box; }
      ::-webkit-scrollbar { width: 6px; height: 6px; }
      ::-webkit-scrollbar-track { background: transparent; }
      ::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.15); border-radius: 3px; }
      ::-webkit-scrollbar-thumb:hover { background: rgba(0,0,0,0.25); }
    `,
  },
  MuiButton: {
    defaultProps: {
      disableElevation: true,
    },
    styleOverrides: {
      root: {
        borderRadius: 8,
        padding: '8px 20px',
        '&:hover': {
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
        },
      },
      sizeSmall: {
        padding: '5px 14px',
      },
    },
  },
  MuiCard: {
    styleOverrides: {
      root: {
        borderRadius: 12,
        boxShadow: '0px 1px 3px rgba(0,0,0,0.06), 0px 2px 8px rgba(0,0,0,0.04)',
        border: '1px solid rgba(0,0,0,0.06)',
      },
    },
  },
  MuiPaper: {
    styleOverrides: {
      root: {
        backgroundImage: 'none',
      },
      rounded: {
        borderRadius: 12,
      },
      elevation1: {
        boxShadow: '0px 1px 3px rgba(0,0,0,0.06), 0px 2px 8px rgba(0,0,0,0.04)',
      },
      elevation2: {
        boxShadow: '0px 2px 6px rgba(0,0,0,0.08), 0px 4px 16px rgba(0,0,0,0.06)',
      },
    },
  },
  MuiOutlinedInput: {
    styleOverrides: {
      root: {
        borderRadius: 8,
      },
    },
  },
  MuiTextField: {
    defaultProps: {
      size: 'small',
    },
  },
  MuiChip: {
    styleOverrides: {
      root: {
        borderRadius: 6,
        fontWeight: 500,
      },
    },
  },
  MuiListItemButton: {
    styleOverrides: {
      root: {
        borderRadius: 8,
        marginBottom: 2,
        '&.Mui-selected': {
          backgroundColor: 'rgba(251, 140, 0, 0.1)',
          color: '#EF6C00',
          '&:hover': {
            backgroundColor: 'rgba(251, 140, 0, 0.15)',
          },
          '& .MuiListItemIcon-root': {
            color: '#EF6C00',
          },
        },
        '&:hover': {
          backgroundColor: 'rgba(0, 0, 0, 0.04)',
        },
      },
    },
  },
  MuiTooltip: {
    defaultProps: {
      arrow: true,
    },
    styleOverrides: {
      tooltip: {
        borderRadius: 6,
        fontSize: 12,
      },
    },
  },
  MuiDivider: {
    styleOverrides: {
      root: {
        borderColor: 'rgba(0,0,0,0.08)',
      },
    },
  },
  MuiDialogTitle: {
    styleOverrides: {
      root: {
        fontWeight: 700,
        fontSize: '1.1rem',
      },
    },
  },
  MuiTableCell: {
    styleOverrides: {
      head: {
        fontWeight: 600,
        color: '#6B7280',
        fontSize: 12,
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        backgroundColor: '#F8F9FA',
      },
    },
  },
};
