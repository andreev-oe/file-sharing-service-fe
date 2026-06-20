import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import Logout from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import { Avatar, Box, Divider, ListItemIcon, Menu, MenuItem, Stack, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { MouseEvent, useState } from 'react';
import { Link } from 'react-router-dom';

import { paths } from '@/config/paths';
import { useAuthStore } from '@/store/auth.store';

import { useLogout } from '../../hooks/use-logout';

export const UserMenu = () => {
  const { user } = useAuthStore();
  const { mutate: logout } = useLogout();
  const [anchorElement, setAnchorElement] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorElement);

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorElement(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorElement(null);
  };

  const handleSignOut = () => {
    logout();
    handleClose();
  };

  return (
    <>
      <UserMenuTrigger direction={'row'} alignItems={'center'} gap={1} onClick={handleClick}>
        <MenuAvatar src={user?.avatarUrl ?? undefined}>{user?.name?.[0]?.toUpperCase()}</MenuAvatar>
        <ResponsiveUserName variant={'body2'} fontWeight={500} color={'text.primary'}>
          {user?.name ?? 'Пользователь'}
        </ResponsiveUserName>
        {open ? <ArrowDropUpIcon fontSize={'small'} /> : <ArrowDropDownIcon fontSize={'small'} />}
      </UserMenuTrigger>

      <StyledUserMenu
        anchorEl={anchorElement}
        open={open}
        onClose={handleClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        {user && (
          <UserMenuHeader>
            <Typography variant={'body2'} fontWeight={600} noWrap>
              {user.name}
            </Typography>
            <Typography variant={'caption'} color={'text.secondary'} noWrap>
              {user.email}
            </Typography>
          </UserMenuHeader>
        )}
        {user && <Divider />}
        <MenuItem component={Link} to={paths.profile.getHref()} onClick={handleClose}>
          <ListItemIcon>
            <PersonIcon fontSize={'small'} />
          </ListItemIcon>
          Профиль
        </MenuItem>
        <Divider />
        <DangerMenuItem onClick={handleSignOut}>
          <ListItemIcon>
            <Logout fontSize={'small'} />
          </ListItemIcon>
          Выйти
        </DangerMenuItem>
      </StyledUserMenu>
    </>
  );
};

const UserMenuTrigger = styled(Stack)(({ theme }) => ({
  cursor: 'pointer',
  userSelect: 'none',
  paddingLeft: theme.spacing(1),
  paddingRight: theme.spacing(1),
  paddingTop: theme.spacing(0.5),
  paddingBottom: theme.spacing(0.5),
  borderRadius: theme.shape.borderRadius * 2,
  transition: 'background 0.15s',
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));

const MenuAvatar = styled(Avatar)(({ theme }) => ({
  width: 32,
  height: 32,
  backgroundColor: theme.palette.primary.main,
  fontSize: 13,
  fontWeight: 700,
}));

const ResponsiveUserName = styled(Typography)(({ theme }) => ({
  display: 'none',
  [theme.breakpoints.up('sm')]: {
    display: 'block',
  },
}));

const StyledUserMenu = styled(Menu)(({ theme }) => ({
  '& .MuiPaper-root': {
    marginTop: theme.spacing(1),
    minWidth: 180,
  },
}));

const UserMenuHeader = styled(Box)(({ theme }) => ({
  paddingLeft: theme.spacing(2),
  paddingRight: theme.spacing(2),
  paddingTop: theme.spacing(1.5),
  paddingBottom: theme.spacing(1.5),
}));

const DangerMenuItem = styled(MenuItem)(({ theme }) => ({
  color: theme.palette.error.main,
  '& .MuiListItemIcon-root': {
    color: theme.palette.error.main,
  },
}));
