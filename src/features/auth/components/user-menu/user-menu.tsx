import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import Logout from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import { Avatar, Box, Divider, ListItemIcon, Menu, MenuItem, Stack, Typography } from '@mui/material';
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
      <Stack
        direction="row"
        alignItems="center"
        gap={1}
        onClick={handleClick}
        sx={{
          cursor: 'pointer',
          userSelect: 'none',
          px: 1,
          py: 0.5,
          borderRadius: 2,
          transition: 'background 0.15s',
          '&:hover': { bgcolor: 'action.hover' },
        }}
      >
        <Avatar
          src={user?.avatarUrl ?? undefined}
          sx={{
            width: 32,
            height: 32,
            bgcolor: 'primary.main',
            fontSize: 13,
            fontWeight: 700,
          }}
        >
          {user?.name?.[0]?.toUpperCase()}
        </Avatar>
        <Typography variant="body2" fontWeight={500} color="text.primary" sx={{ display: { xs: 'none', sm: 'block' } }}>
          {user?.name ?? 'Пользователь'}
        </Typography>
        {open ? (
          <ArrowDropUpIcon fontSize="small" sx={{ color: 'text.secondary' }} />
        ) : (
          <ArrowDropDownIcon fontSize="small" sx={{ color: 'text.secondary' }} />
        )}
      </Stack>

      <Menu
        anchorEl={anchorElement}
        open={open}
        onClose={handleClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        slotProps={{ paper: { sx: { mt: 1, minWidth: 180 } } }}
      >
        {user && (
          <Box sx={{ px: 2, py: 1.5 }}>
            <Typography variant="body2" fontWeight={600} noWrap>
              {user.name}
            </Typography>
            <Typography variant="caption" color="text.secondary" noWrap>
              {user.email}
            </Typography>
          </Box>
        )}
        {user && <Divider />}
        <MenuItem component={Link} to={paths.profile.getHref()} onClick={handleClose}>
          <ListItemIcon>
            <PersonIcon fontSize="small" />
          </ListItemIcon>
          Профиль
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleSignOut} sx={{ color: 'error.main' }}>
          <ListItemIcon>
            <Logout fontSize="small" sx={{ color: 'error.main' }} />
          </ListItemIcon>
          Выйти
        </MenuItem>
      </Menu>
    </>
  );
};
