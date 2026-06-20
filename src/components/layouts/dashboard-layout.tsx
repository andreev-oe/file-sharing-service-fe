import AssessmentIcon from '@mui/icons-material/Assessment';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import GroupIcon from '@mui/icons-material/Group';
import { Box, List, ListItemButton, ListItemIcon, ListItemText, Stack, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { PropsWithChildren, ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';

import { paths } from '@/config/paths';
import { UserMenu } from '@/features/auth/components/user-menu';
import { FolderTree } from '@/features/folders/components/folder-tree';

const SIDEBAR_WIDTH = 240;
const HEADER_HEIGHT = 64;
const SIDEBAR_Z_INDEX = 100;
const HEADER_Z_INDEX = 99;

type NavItem = {
  icon: ReactNode;
  label: string;
  to: string;
};

const NAV_ITEMS: NavItem[] = [
  { icon: <FolderOpenIcon fontSize={'small'} />, label: 'Мой диск', to: paths.drive.getHref() },
  { icon: <GroupIcon fontSize={'small'} />, label: 'Группы', to: paths.groups.getHref() },
  { icon: <AssessmentIcon fontSize={'small'} />, label: 'Отчёты', to: paths.reports.getHref() },
];

const SidebarNavItem = ({ icon, label, to }: NavItem) => {
  const { pathname } = useLocation();
  const isActive = pathname === to || (to !== '/' && pathname.startsWith(`${to}/`));

  return (
    <NavListItemButton component={Link} to={to} selected={isActive}>
      <CompactListItemIcon>{icon}</CompactListItemIcon>
      <ListItemText primary={label} primaryTypographyProps={{ fontSize: 14, fontWeight: isActive ? 600 : 400 }} />
    </NavListItemButton>
  );
};

export const DashboardLayout = ({ children }: PropsWithChildren) => {
  return (
    <RootLayout direction={'row'}>
      <Sidebar component={'nav'}>
        <SidebarBrandRow direction={'row'} alignItems={'center'} gap={1.5}>
          <LogoIconBox>
            <LogoIcon />
          </LogoIconBox>
          <Box>
            <Typography variant={'subtitle1'} fontWeight={700} lineHeight={1.2}>
              FileShare
            </Typography>
            <Typography variant={'caption'} color={'text.secondary'} lineHeight={1}>
              Pro
            </Typography>
          </Box>
        </SidebarBrandRow>

        <NavigationArea>
          <NavSectionLabel variant={'caption'} color={'text.secondary'}>
            НАВИГАЦИЯ
          </NavSectionLabel>
          <List disablePadding>
            {NAV_ITEMS.map((item) => (
              <SidebarNavItem key={item.to} {...item} />
            ))}
          </List>

          <SidebarDivider />

          <FolderTree />
        </NavigationArea>

        <SidebarFooter>
          <Typography variant={'caption'} color={'text.secondary'}>
            © 2026 FileShare Pro
          </Typography>
        </SidebarFooter>
      </Sidebar>

      <MainArea>
        <AppHeader component={'header'}>
          <FlexSpacer />
          <UserMenu />
        </AppHeader>

        <MainContent component={'main'}>{children}</MainContent>
      </MainArea>
    </RootLayout>
  );
};

const RootLayout = styled(Stack)({
  height: '100vh',
  overflow: 'hidden',
});

const Sidebar = styled(Box)(({ theme }) => ({
  width: SIDEBAR_WIDTH,
  flexShrink: 0,
  backgroundColor: theme.palette.background.paper,
  borderRight: `1px solid ${theme.palette.divider}`,
  display: 'flex',
  flexDirection: 'column',
  position: 'fixed',
  top: 0,
  left: 0,
  height: '100vh',
  zIndex: SIDEBAR_Z_INDEX,
  overflowY: 'auto',
})) as typeof Box;

const SidebarBrandRow = styled(Stack)(({ theme }) => ({
  height: HEADER_HEIGHT,
  paddingLeft: theme.spacing(2.5),
  paddingRight: theme.spacing(2.5),
  flexShrink: 0,
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

const LogoIconBox = styled(Box)(({ theme }) => ({
  width: 34,
  height: 34,
  backgroundColor: theme.palette.primary.main,
  borderRadius: theme.shape.borderRadius * 1.5,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
}));

const LogoIcon = styled(FolderOpenIcon)({
  color: '#fff',
  fontSize: 18,
});

const NavigationArea = styled(Box)(({ theme }) => ({
  flex: 1,
  paddingTop: theme.spacing(1.5),
  paddingBottom: theme.spacing(1.5),
  paddingLeft: theme.spacing(1),
  paddingRight: theme.spacing(1),
}));

const NavSectionLabel = styled(Typography)(({ theme }) => ({
  paddingLeft: theme.spacing(1.5),
  paddingRight: theme.spacing(1.5),
  marginBottom: theme.spacing(0.5),
  display: 'block',
  fontWeight: 600,
  letterSpacing: '0.05em',
}));

const NavListItemButton = styled(ListItemButton)(({ theme }) => ({
  paddingLeft: theme.spacing(1.5),
  paddingRight: theme.spacing(1.5),
  paddingTop: theme.spacing(0.875),
  paddingBottom: theme.spacing(0.875),
})) as typeof ListItemButton;

const CompactListItemIcon = styled(ListItemIcon)({
  minWidth: 36,
});

const SidebarDivider = styled(Box)(({ theme }) => ({
  borderTop: `1px solid ${theme.palette.divider}`,
  marginTop: theme.spacing(1),
  marginBottom: theme.spacing(0.5),
}));

const SidebarFooter = styled(Box)(({ theme }) => ({
  paddingLeft: theme.spacing(2),
  paddingRight: theme.spacing(2),
  paddingTop: theme.spacing(1.5),
  paddingBottom: theme.spacing(1.5),
  borderTop: `1px solid ${theme.palette.divider}`,
  flexShrink: 0,
}));

const MainArea = styled(Stack)(({ theme }) => ({
  marginLeft: SIDEBAR_WIDTH,
  flex: 1,
  minHeight: 0,
  overflow: 'hidden',
  backgroundColor: theme.palette.background.default,
}));

const AppHeader = styled(Box)(({ theme }) => ({
  height: HEADER_HEIGHT,
  backgroundColor: theme.palette.background.paper,
  borderBottom: `1px solid ${theme.palette.divider}`,
  display: 'flex',
  alignItems: 'center',
  paddingLeft: theme.spacing(3),
  paddingRight: theme.spacing(3),
  gap: theme.spacing(2),
  position: 'sticky',
  top: 0,
  zIndex: HEADER_Z_INDEX,
  flexShrink: 0,
})) as typeof Box;

const FlexSpacer = styled(Box)({
  flex: 1,
});

const MainContent = styled(Box)({
  flex: 1,
  minHeight: 0,
  overflowY: 'auto',
  display: 'flex',
  flexDirection: 'column',
}) as typeof Box;
