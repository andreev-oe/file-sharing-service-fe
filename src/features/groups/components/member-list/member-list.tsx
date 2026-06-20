import DeleteIcon from '@mui/icons-material/Delete';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import {
  Avatar,
  Box,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';

import type { GroupMemberDto } from '@/api/generated/types';
import { GroupMemberDtoRole as MemberRole } from '@/api/generated/types';
import { modals } from '@/components/ui/modals/methods';
import { EContextModal } from '@/enums/modals.enums';

import { useRemoveMember } from '../../hooks/use-remove-member';
import { MemberRoleChip } from '../member-role-chip';
import type { TransferOwnershipModalProps } from '../transfer-ownership-modal';

const OWNER_REMOVE_WARNING = 'Нельзя удалить владельца. Сначала передайте права другому участнику.';

type MemberRowProps = {
  member: GroupMemberDto;
  groupId: string;
  canManage: boolean;
  isCurrentOwner: boolean;
};

const MemberRow = ({ member, groupId, canManage, isCurrentOwner }: MemberRowProps) => {
  const { mutate: removeMember, isPending } = useRemoveMember(groupId);
  const isOwner = member.role === MemberRole.owner;
  const memberName = member.user?.name ?? '';
  const memberAvatarUrl = member.user?.avatarUrl ?? undefined;

  const handleRemove = () => {
    modals.openConfirmModal({
      title: 'Удалить участника',
      children: `Удалить ${memberName} из группы?`,
      onConfirm: () => {
        removeMember({ id: groupId, userId: member.userId });
      },
      labels: { confirm: 'Удалить', cancel: 'Отмена' },
      confirmProps: { color: 'error' },
    });
  };

  return (
    <TableRow>
      <TableCell>
        <MemberIdentity>
          <Avatar src={memberAvatarUrl} alt={memberName}>
            {memberName.charAt(0).toUpperCase()}
          </Avatar>
          <MemberNames>
            <Typography variant={'body2'} fontWeight={500}>
              {memberName}
            </Typography>
            <Typography variant={'caption'} color={'text.secondary'}>
              @{member.user?.username}
            </Typography>
          </MemberNames>
        </MemberIdentity>
      </TableCell>
      <TableCell>
        <MemberRoleChip role={member.role} />
      </TableCell>
      <TableCell align={'right'}>
        {canManage && (
          <Tooltip title={isOwner ? OWNER_REMOVE_WARNING : 'Удалить участника'}>
            <span>
              <IconButton size={'small'} color={'error'} onClick={handleRemove} disabled={isOwner || isPending}>
                <DeleteIcon fontSize={'small'} />
              </IconButton>
            </span>
          </Tooltip>
        )}
        {isCurrentOwner && !isOwner && (
          <Tooltip title={'Передать права владельца'}>
            <IconButton
              size={'small'}
              onClick={() => {
                /* opened from parent via context */
              }}
            >
              <SwapHorizIcon fontSize={'small'} />
            </IconButton>
          </Tooltip>
        )}
      </TableCell>
    </TableRow>
  );
};

export type MemberListProps = {
  groupId: string;
  members: GroupMemberDto[];
  canManage: boolean;
  isCurrentOwner: boolean;
};

export const MemberList = ({ groupId, members, canManage, isCurrentOwner }: MemberListProps) => {
  const handleTransferOwnership = () => {
    modals.openContextModal({
      modal: EContextModal.TRANSFER_OWNERSHIP,
      innerProps: { groupId, members } satisfies TransferOwnershipModalProps,
    });
  };

  return (
    <MemberListRoot>
      <Table size={'small'}>
        <TableHead>
          <TableRow>
            <HeaderCell>Участник</HeaderCell>
            <HeaderCell>Роль</HeaderCell>
            <HeaderCell align={'right'}>
              {isCurrentOwner && members.some((member) => member.role !== MemberRole.owner) && (
                <Tooltip title={'Передать права владельца'}>
                  <IconButton size={'small'} onClick={handleTransferOwnership}>
                    <SwapHorizIcon fontSize={'small'} />
                  </IconButton>
                </Tooltip>
              )}
            </HeaderCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {members.map((member) => (
            <MemberRow
              key={member.userId}
              member={member}
              groupId={groupId}
              canManage={canManage}
              isCurrentOwner={isCurrentOwner}
            />
          ))}
        </TableBody>
      </Table>
    </MemberListRoot>
  );
};

const MemberListRoot = styled(Box)(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
  overflow: 'hidden',
}));

const MemberIdentity = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: 12,
});

const MemberNames = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
});

const HeaderCell = styled(TableCell)(({ theme }) => ({
  fontWeight: 600,
  color: theme.palette.text.secondary,
  fontSize: 12,
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
}));
