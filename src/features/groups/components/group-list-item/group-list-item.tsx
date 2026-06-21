import GroupIcon from '@mui/icons-material/Group';
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';
import { Avatar, Box, Card, CardActionArea, CardContent, Chip, TableCell, TableRow, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

import type { GroupDto } from '@/api/generated/types';
import { paths } from '@/config/paths';
import { formatDate } from '@/utils/format.utils';

export type GroupListItemProps = {
  group: GroupDto;
  viewMode: 'list' | 'grid';
};

export const GroupListItem = ({ group, viewMode }: GroupListItemProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(paths.group.getHref(group.id));
  };

  if (viewMode === 'grid') {
    return (
      <GroupGridCard>
        <CardActionArea onClick={handleClick}>
          <CardContent>
            <GridCardHeader>
              <GridGroupIcon />
              <Typography variant={'subtitle1'} fontWeight={600} noWrap>
                {group.name}
              </Typography>
            </GridCardHeader>
            {group.description && (
              <GridDescription variant={'body2'} color={'text.secondary'}>
                {group.description}
              </GridDescription>
            )}
            <GridCardFooter>
              {group.owner && (
                <GridOwnerInfo>
                  <OwnerAvatar src={group.owner.avatarUrl ?? undefined} alt={group.owner.name}>
                    {group.owner.name.charAt(0).toUpperCase()}
                  </OwnerAvatar>
                  <Typography variant={'caption'} color={'text.secondary'} noWrap>
                    {group.owner.name}
                  </Typography>
                </GridOwnerInfo>
              )}
              <MemberCountChip
                icon={<PeopleOutlineIcon />}
                label={group.memberCount}
                size={'small'}
                variant={'outlined'}
              />
            </GridCardFooter>
          </CardContent>
        </CardActionArea>
      </GroupGridCard>
    );
  }

  return (
    <GroupTableRow onClick={handleClick}>
      <TableCell width={40}>
        <TableGroupIcon />
      </TableCell>
      <TableCell>
        <NameCell>
          <Typography variant={'body2'} fontWeight={500} noWrap>
            {group.name}
          </Typography>
          {group.description && (
            <Typography variant={'caption'} color={'text.secondary'} noWrap display={'block'}>
              {group.description}
            </Typography>
          )}
        </NameCell>
      </TableCell>
      <TableCell width={200}>
        {group.owner && (
          <OwnerCell>
            <RowOwnerAvatar src={group.owner.avatarUrl ?? undefined} alt={group.owner.name}>
              {group.owner.name.charAt(0).toUpperCase()}
            </RowOwnerAvatar>
            <Typography variant={'body2'} color={'text.secondary'} noWrap>
              {group.owner.name}
            </Typography>
          </OwnerCell>
        )}
      </TableCell>
      <TableCell width={100} align={'center'}>
        <MemberCountChip icon={<PeopleOutlineIcon />} label={group.memberCount} size={'small'} variant={'outlined'} />
      </TableCell>
      <TableCell width={200}>
        <Typography variant={'body2'} color={'text.secondary'} noWrap>
          {formatDate(new Date(group.createdAt).getTime())}
        </Typography>
      </TableCell>
    </GroupTableRow>
  );
};

const GroupGridCard = styled(Card)(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  height: '100%',
}));

const GridCardHeader = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  marginBottom: 6,
});

const GridGroupIcon = styled(GroupIcon)(({ theme }) => ({
  color: theme.palette.primary.main,
  fontSize: 20,
  flexShrink: 0,
}));

const GridDescription = styled(Typography)({
  overflow: 'hidden',
  display: '-webkit-box',
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical',
  marginBottom: 8,
});

const GridCardFooter = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 8,
  marginTop: 8,
});

const GridOwnerInfo = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: 6,
  minWidth: 0,
});

const OwnerAvatar = styled(Avatar)({
  width: 20,
  height: 20,
  fontSize: 11,
  flexShrink: 0,
});

const MemberCountChip = styled(Chip)({
  fontSize: 11,
  height: 22,
  flexShrink: 0,
  '& .MuiChip-icon': {
    fontSize: 14,
  },
});

const GroupTableRow = styled(TableRow)(({ theme }) => ({
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));

const TableGroupIcon = styled(GroupIcon)(({ theme }) => ({
  fontSize: 20,
  color: theme.palette.primary.main,
  display: 'block',
}));

const NameCell = styled(Box)({
  overflow: 'hidden',
});

const OwnerCell = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  overflow: 'hidden',
});

const RowOwnerAvatar = styled(Avatar)({
  width: 24,
  height: 24,
  fontSize: 12,
  flexShrink: 0,
});
