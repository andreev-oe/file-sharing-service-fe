import AssessmentIcon from '@mui/icons-material/Assessment';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import GroupIcon from '@mui/icons-material/Group';
import { Box, List, ListItemButton, ListItemIcon, ListItemText, Stack, Typography } from '@mui/material';
import { PropsWithChildren, ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';

import { paths } from '@/config/paths';
import { UserMenu } from '@/features/auth/components/user-menu';

const SIDEBAR_WIDTH = 240;
const HEADER_HEIGHT = 64;

type NavItem = {
  icon: ReactNode;
  label: string;
  to: string;
};

const NAV_ITEMS: NavItem[] = [
  { icon: <FolderOpenIcon fontSize="small" />, label: 'Мой диск', to: paths.drive.getHref() },
  { icon: <GroupIcon fontSize="small" />, label: 'Группы', to: paths.groups.getHref() },
  { icon: <AssessmentIcon fontSize="small" />, label: 'Отчёты', to: paths.reports.getHref() },
];

const SidebarNavItem = ({ icon, label, to }: NavItem) => {
  const { pathname } = useLocation();
  const isActive = pathname === to || (to !== '/' && pathname.startsWith(`${to}/`));

  return (
    <ListItemButton component={Link} to={to} selected={isActive} sx={{ px: 1.5, py: 0.875 }}>
      <ListItemIcon sx={{ minWidth: 36 }}>{icon}</ListItemIcon>
      <ListItemText primary={label} primaryTypographyProps={{ fontSize: 14, fontWeight: isActive ? 600 : 400 }} />
    </ListItemButton>
  );
};

export const DashboardLayout = ({ children }: PropsWithChildren) => {
  return (
    <Stack direction="row" sx={{ minHeight: '100vh' }}>
      {/* Sidebar */}
      <Box
        component="nav"
        sx={{
          width: SIDEBAR_WIDTH,
          flexShrink: 0,
          bgcolor: 'background.paper',
          borderRight: '1px solid',
          borderColor: 'divider',
          display: 'flex',
          flexDirection: 'column',
          position: 'fixed',
          top: 0,
          left: 0,
          height: '100vh',
          zIndex: 100,
          overflowY: 'auto',
        }}
      >
        {/* Brand */}
        <Stack
          direction="row"
          alignItems="center"
          gap={1.5}
          sx={{
            height: HEADER_HEIGHT,
            px: 2.5,
            flexShrink: 0,
            borderBottom: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Box
            sx={{
              width: 34,
              height: 34,
              bgcolor: 'primary.main',
              borderRadius: 1.5,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <FolderOpenIcon sx={{ color: '#fff', fontSize: 18 }} />
          </Box>
          <Box>
            <Typography variant="subtitle1" fontWeight={700} lineHeight={1.2}>
              FileShare
            </Typography>
            <Typography variant="caption" color="text.secondary" lineHeight={1}>
              Pro
            </Typography>
          </Box>
        </Stack>

        {/* Navigation */}
        <Box sx={{ flex: 1, py: 1.5, px: 1 }}>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ px: 1.5, mb: 0.5, display: 'block', fontWeight: 600, letterSpacing: '0.05em' }}
          >
            НАВИГАЦИЯ
          </Typography>
          <List disablePadding>
            {NAV_ITEMS.map((item) => (
              <SidebarNavItem key={item.to} {...item} />
            ))}
          </List>
        </Box>

        {/* Footer */}
        <Box
          sx={{
            px: 2,
            py: 1.5,
            borderTop: '1px solid',
            borderColor: 'divider',
            flexShrink: 0,
          }}
        >
          <Typography variant="caption" color="text.secondary">
            © 2025 FileShare Pro
          </Typography>
        </Box>
      </Box>

      {/* Main area */}
      <Stack
        sx={{
          ml: `${SIDEBAR_WIDTH}px`,
          flex: 1,
          minHeight: '100vh',
          bgcolor: 'background.default',
        }}
      >
        {/* Header */}
        <Box
          component="header"
          sx={{
            height: HEADER_HEIGHT,
            bgcolor: 'background.paper',
            borderBottom: '1px solid',
            borderColor: 'divider',
            display: 'flex',
            alignItems: 'center',
            px: 3,
            gap: 2,
            position: 'sticky',
            top: 0,
            zIndex: 99,
            flexShrink: 0,
          }}
        >
          <Box sx={{ flex: 1 }} />
          <UserMenu />
        </Box>

        {/* Page content */}
        <Box component="main" sx={{ flex: 1, overflow: 'auto' }}>
          {children}
        </Box>
      </Stack>
    </Stack>
  );
};
