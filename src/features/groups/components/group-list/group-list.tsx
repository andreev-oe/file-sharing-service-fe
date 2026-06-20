import GroupIcon from '@mui/icons-material/Group';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import { Box, CircularProgress, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { styled } from '@mui/material/styles';

import { Button } from '@/components/ui/button';
import { modals } from '@/components/ui/modals/methods';
import { EContextModal } from '@/enums/modals.enums';

import { useGroups } from '../../hooks/use-groups';
import { GroupCard } from '../group-card';

export const GroupList = () => {
  const { data: groups, isLoading } = useGroups();

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
        <Button variant={'contained'} startIcon={<GroupAddIcon />} onClick={handleCreateGroup}>
          Создать группу
        </Button>
      </GroupListHeader>

      {isLoading && (
        <LoadingBox>
          <CircularProgress />
        </LoadingBox>
      )}

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

      {!isLoading && groups.length > 0 && (
        <Grid container spacing={2}>
          {groups.map((group) => (
            <Grid key={group.id} size={{ xs: 12, sm: 6, md: 4 }}>
              <GroupCard
                groupId={group.id}
                name={group.name}
                description={group.description ?? undefined}
                createdAt={group.createdAt}
              />
            </Grid>
          ))}
        </Grid>
      )}
    </GroupListRoot>
  );
};

const GroupListRoot = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
}));

const GroupListHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: theme.spacing(3),
}));

const LoadingBox = styled(Box)({
  display: 'flex',
  justifyContent: 'center',
  paddingTop: 64,
  paddingBottom: 64,
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
