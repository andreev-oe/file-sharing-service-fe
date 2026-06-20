import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { Box, CircularProgress, Divider, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

import { AddMemberDtoRole as MemberRole } from '@/api/generated/types';
import { Button } from '@/components/ui/button';
import { modals } from '@/components/ui/modals/methods';
import { EContextModal } from '@/enums/modals.enums';
import { useAuthStore } from '@/store/auth.store';

import { useGroupMembers } from '../../hooks/use-group-members';
import type { AddMemberModalProps } from '../add-member-modal';
import { MemberList } from '../member-list';

export type GroupDetailPageProps = {
  groupId: string;
};

export const GroupDetailPage = ({ groupId }: GroupDetailPageProps) => {
  const currentUser = useAuthStore((state) => state.user);
  const { data: members, isLoading } = useGroupMembers(groupId);

  const currentMember = members.find((member) => member.userId === currentUser?.id);
  const currentUserRole = currentMember?.role ?? null;
  const canManage = currentUserRole === MemberRole.owner || currentUserRole === MemberRole.admin;
  const isCurrentOwner = currentUserRole === MemberRole.owner;

  const handleAddMember = () => {
    modals.openContextModal({
      modal: EContextModal.ADD_MEMBER,
      innerProps: { groupId } satisfies AddMemberModalProps,
    });
  };

  return (
    <GroupDetailRoot>
      <GroupDetailHeader>
        <Box>
          <Typography variant={'h5'} fontWeight={600}>
            Участники группы
          </Typography>
          <Typography variant={'body2'} color={'text.secondary'}>
            {`ID группы: ${groupId}`}
          </Typography>
        </Box>
        {canManage && (
          <Button variant={'contained'} startIcon={<PersonAddIcon />} onClick={handleAddMember}>
            Добавить участника
          </Button>
        )}
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
  alignItems: 'flex-start',
  justifyContent: 'space-between',
});

const GroupDetailContent = styled(Box)({
  flex: 1,
});

const LoadingBox = styled(Box)({
  display: 'flex',
  justifyContent: 'center',
  paddingTop: 32,
  paddingBottom: 32,
});
