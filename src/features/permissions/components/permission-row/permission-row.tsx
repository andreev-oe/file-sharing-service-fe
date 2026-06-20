import DeleteIcon from '@mui/icons-material/Delete';
import GroupIcon from '@mui/icons-material/Group';
import PersonIcon from '@mui/icons-material/Person';
import PublicIcon from '@mui/icons-material/Public';
import { Box, Chip, IconButton, Tooltip, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

import type { CreatePermissionDtoPermission, CreatePermissionDtoSubjectType } from '@/api/generated/types';
import {
  CreatePermissionDtoPermission as PermissionLevel,
  CreatePermissionDtoSubjectType as SubjectType,
} from '@/api/generated/types';

import { useRevokePermission } from '../../hooks/use-revoke-permission';

const SUBJECT_TYPE_ICON: Record<CreatePermissionDtoSubjectType, React.ReactNode> = {
  [SubjectType.user]: <PersonIcon fontSize={'small'} />,
  [SubjectType.group]: <GroupIcon fontSize={'small'} />,
  [SubjectType.everyone]: <PublicIcon fontSize={'small'} />,
};

const LEVEL_LABEL: Record<CreatePermissionDtoPermission, string> = {
  [PermissionLevel.VIEW]: 'Просмотр',
  [PermissionLevel.COMMENT]: 'Комментирование',
  [PermissionLevel.EDIT]: 'Редактирование',
  [PermissionLevel.MANAGE]: 'Управление',
};

export type PermissionRowProps = {
  permissionId: string;
  subjectType: CreatePermissionDtoSubjectType;
  subjectLabel: string;
  permissionLevel: CreatePermissionDtoPermission;
};

export const PermissionRow = ({ permissionId, subjectType, subjectLabel, permissionLevel }: PermissionRowProps) => {
  const { mutate: revokePermission, isPending } = useRevokePermission();

  const handleRevoke = () => {
    revokePermission({ id: permissionId });
  };

  return (
    <PermissionRowRoot>
      <SubjectInfo>
        <SubjectIconWrapper>{SUBJECT_TYPE_ICON[subjectType]}</SubjectIconWrapper>
        <SubjectLabel variant={'body2'}>{subjectLabel}</SubjectLabel>
      </SubjectInfo>
      <RowActions>
        <Chip label={LEVEL_LABEL[permissionLevel]} size={'small'} variant={'outlined'} />
        <Tooltip title={'Отозвать доступ'}>
          <span>
            <IconButton size={'small'} onClick={handleRevoke} disabled={isPending} color={'error'}>
              <DeleteIcon fontSize={'small'} />
            </IconButton>
          </span>
        </Tooltip>
      </RowActions>
    </PermissionRowRoot>
  );
};

const PermissionRowRoot = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: theme.spacing(1, 0),
  borderBottom: `1px solid ${theme.palette.divider}`,
  '&:last-child': {
    borderBottom: 'none',
  },
}));

const SubjectInfo = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  minWidth: 0,
});

const SubjectIconWrapper = styled(Box)(({ theme }) => ({
  color: theme.palette.text.secondary,
  display: 'flex',
  flexShrink: 0,
}));

const SubjectLabel = styled(Typography)({
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

const RowActions = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  flexShrink: 0,
});
