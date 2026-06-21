import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { Box, CircularProgress, Divider, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

import { AddMemberDtoRole as MemberRole } from '@/api/generated/types';
import { Button } from '@/components/ui/button';
import { modals } from '@/components/ui/modals/methods';
import { paths } from '@/config/paths';
import { EContextModal } from '@/enums/modals.enums';
import { useAuthStore } from '@/store/auth.store';

import { useDeleteGroup } from '../../hooks/use-delete-group';
import { useGroupMembers } from '../../hooks/use-group-members';
import type { AddMemberModalProps } from '../add-member-modal';
import { MemberList } from '../member-list';

export type GroupDetailPageProps = {
  groupId: string;
};

export const GroupDetailPage = ({ groupId }: GroupDetailPageProps) => {
  const navigate = useNavigate();
  const currentUser = useAuthStore((state) => state.user);
  const { data: members, isLoading } = useGroupMembers(groupId);
  const { mutate: deleteGroup, isPending: isDeleting } = useDeleteGroup();

  const currentMember = members.find((member) => member.userId === currentUser?.id);
  const currentUserRole = currentMember?.role ?? null;
  const canManage = currentUserRole === MemberRole.owner || currentUserRole === MemberRole.admin;
  const isCurrentOwner = currentUserRole === MemberRole.owner;

  const handleBack = () => {
    navigate(paths.groups.getHref());
  };

  const handleAddMember = () => {
    modals.openContextModal({
      modal: EContextModal.ADD_MEMBER,
      innerProps: { groupId } satisfies AddMemberModalProps,
    });
  };

  const handleDelete = () => {
    modals.openConfirmModal({
      title: 'Удалить группу',
      children: 'Группа и все связанные права доступа будут удалены. Это действие необратимо.',
      onConfirm: () => {
        deleteGroup({ id: groupId });
      },
      labels: { confirm: 'Удалить', cancel: 'Отмена' },
      confirmProps: { color: 'error' },
    });
  };

  return (
    <GroupDetailRoot>
      <GroupDetailHeader>
        <HeaderLeft>
          <Button startIcon={<ArrowBackIcon />} onClick={handleBack}>
            Все группы
          </Button>
          <Typography variant={'h5'} fontWeight={600}>
            Участники группы
          </Typography>
        </HeaderLeft>
        <HeaderActions>
          {canManage && (
            <Button variant={'contained'} startIcon={<PersonAddIcon />} onClick={handleAddMember}>
              Добавить участника
            </Button>
          )}
          {isCurrentOwner && (
            <Button
              variant={'outlined'}
              color={'error'}
              startIcon={<DeleteIcon />}
              loading={isDeleting}
              onClick={handleDelete}
            >
              Удалить группу
            </Button>
          )}
        </HeaderActions>
      </GroupDetailHeader>

      <Divider />

      <GroupDetailContent>
        {isLoading && (
          <LoadingBox>
            <CircularProgress />
          </LoadingBox>
        )}
        {!isLoading && members.length === 0 && (
          <Typography variant={'body2'} color={'text.secondary'} textAlign={'center'} py={4}>
            Нет участников
          </Typography>
        )}
        {!isLoading && members.length > 0 && (
          <MemberList groupId={groupId} members={members} canManage={canManage} isCurrentOwner={isCurrentOwner} />
        )}
      </GroupDetailContent>
    </GroupDetailRoot>
  );
};

const GroupDetailRoot = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(3),
}));

const GroupDetailHeader = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
});

const HeaderLeft = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
}));

const HeaderActions = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1),
  flexShrink: 0,
}));

const GroupDetailContent = styled(Box)({
  flex: 1,
});

const LoadingBox = styled(Box)({
  display: 'flex',
  justifyContent: 'center',
  paddingTop: 32,
  paddingBottom: 32,
});
