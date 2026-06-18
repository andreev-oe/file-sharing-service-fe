import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import Logout from '@mui/icons-material/Logout';
import { Avatar, ListItemIcon, Menu, MenuItem, Stack, Typography } from '@mui/material';
import { useState } from 'react';
import type { MouseEvent } from 'react';

import { Button } from '@/components/ui/button';

import { useAuth } from '../../hooks/use-auth';

export const UserMenu = () => {
  const { user, setUser } = useAuth();
  const [anchorElement, setAnchorElement] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorElement);

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorElement(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorElement(null);
  };

  const handleSignOut = () => {
    setUser(null);
    handleClose();
  };

  return (
    <>
      <Button onClick={handleClick}>
        <Stack direction={'row'} gap={0.5} justifyContent={'center'} alignItems={'center'}>
          <Avatar sx={{ mr: 1 }} />
          <Typography color={'secondary'}>{user?.name ?? 'Гость'}</Typography>
          {open ? <ArrowDropUpIcon color={'secondary'} /> : <ArrowDropDownIcon color={'secondary'} />}
        </Stack>
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorElement}
        open={open}
        onClose={handleClose}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={handleSignOut}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Выйти
        </MenuItem>
      </Menu>
    </>
  );
};
