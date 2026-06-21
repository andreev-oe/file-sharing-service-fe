import GridViewIcon from '@mui/icons-material/GridView';
import GroupIcon from '@mui/icons-material/Group';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import ViewListIcon from '@mui/icons-material/ViewList';
import {
  Box,
  IconButton,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import { styled } from '@mui/material/styles';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { modals } from '@/components/ui/modals/methods';
import { EContextModal } from '@/enums/modals.enums';

import { useGroups } from '../../hooks/use-groups';
import { GroupListItem } from '../group-list-item';

const SKELETON_COUNT = 6;

type ViewMode = 'list' | 'grid';

export const GroupList = () => {
  const { data: groups, isLoading } = useGroups();
  const [viewMode, setViewMode] = useState<ViewMode>('list');

  const handleCreateGroup = () => {
    modals.openContextModal({
      modal: EContextModal.CREATE_GROUP,
      innerProps: {},
    });
  };

  return (
    <GroupListRoot>
      <GroupListHeader>
        <Typography variant={'h5'} fontWeight={600}>
          Группы
        </Typography>
        <HeaderRight>
          <ViewToggleGroup>
            <Tooltip title={'Таблица'}>
              <IconButton
                size={'small'}
                color={viewMode === 'list' ? 'primary' : 'default'}
                onClick={() => {
                  setViewMode('list');
                }}
              >
                <ViewListIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title={'Карточки'}>
              <IconButton
                size={'small'}
                color={viewMode === 'grid' ? 'primary' : 'default'}
                onClick={() => {
                  setViewMode('grid');
                }}
              >
                <GridViewIcon />
              </IconButton>
            </Tooltip>
          </ViewToggleGroup>
          <Button variant={'contained'} startIcon={<GroupAddIcon />} onClick={handleCreateGroup}>
            Создать группу
          </Button>
        </HeaderRight>
      </GroupListHeader>

      {!isLoading && groups.length === 0 && (
        <EmptyState>
          <EmptyStateIcon />
          <Typography variant={'h6'} color={'text.secondary'} fontWeight={400}>
            Нет групп
          </Typography>
          <Typography variant={'body2'} color={'text.secondary'}>
            Создайте группу, чтобы управлять совместным доступом к файлам
          </Typography>
        </EmptyState>
      )}

      {viewMode === 'grid' && (
        <Grid container spacing={2}>
          {isLoading
            ? Array.from({ length: SKELETON_COUNT }).map((_, index) => (
                <Grid key={index} size={{ xs: 12, sm: 6, md: 4 }}>
                  <Skeleton variant={'rounded'} height={120} />
                </Grid>
              ))
            : groups.map((group) => (
                <Grid key={group.id} size={{ xs: 12, sm: 6, md: 4 }}>
                  <GroupListItem group={group} viewMode={'grid'} />
                </Grid>
              ))}
        </Grid>
      )}

      {viewMode === 'list' && (isLoading || groups.length > 0) && (
        <Table size={'small'}>
          <TableHead>
            <TableRow>
              <TableCell width={40} />
              <TableCell>Название</TableCell>
              <TableCell width={200}>Владелец</TableCell>
              <TableCell width={100} align={'center'}>
                Участники
              </TableCell>
              <TableCell width={200}>Создана</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading
              ? Array.from({ length: SKELETON_COUNT }).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Skeleton variant={'circular'} width={20} height={20} />
                    </TableCell>
                    <TableCell>
                      <Skeleton width={'60%'} />
                    </TableCell>
                    <TableCell>
                      <Skeleton width={'80%'} />
                    </TableCell>
                    <TableCell>
                      <Skeleton width={40} />
                    </TableCell>
                    <TableCell>
                      <Skeleton width={'70%'} />
                    </TableCell>
                  </TableRow>
                ))
              : groups.map((group) => <GroupListItem key={group.id} group={group} viewMode={'list'} />)}
          </TableBody>
        </Table>
      )}
    </GroupListRoot>
  );
};

const GroupListRoot = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
}));

const GroupListHeader = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
});

const HeaderRight = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: 8,
});

const ViewToggleGroup = styled(Box)({
  display: 'flex',
  gap: 2,
});

const EmptyState = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  paddingTop: theme.spacing(10),
  paddingBottom: theme.spacing(10),
  gap: theme.spacing(1),
}));

const EmptyStateIcon = styled(GroupIcon)(({ theme }) => ({
  fontSize: 72,
  color: theme.palette.primary.light,
}));
