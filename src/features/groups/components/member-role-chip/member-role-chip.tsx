import { Chip } from '@mui/material';
import type { ChipProps } from '@mui/material';

import type { AddMemberDtoRole } from '@/api/generated/types';
import { AddMemberDtoRole as MemberRole } from '@/api/generated/types';

const ROLE_LABEL: Record<AddMemberDtoRole, string> = {
  [MemberRole.owner]: 'Владелец',
  [MemberRole.admin]: 'Администратор',
  [MemberRole.member]: 'Участник',
  [MemberRole.viewer]: 'Наблюдатель',
};

const ROLE_COLOR: Record<AddMemberDtoRole, ChipProps['color']> = {
  [MemberRole.owner]: 'primary',
  [MemberRole.admin]: 'warning',
  [MemberRole.member]: 'default',
  [MemberRole.viewer]: 'default',
};

export type MemberRoleChipProps = {
  role: AddMemberDtoRole;
};

export const MemberRoleChip = ({ role }: MemberRoleChipProps) => {
  return (
    <Chip
      label={ROLE_LABEL[role]}
      color={ROLE_COLOR[role]}
      size={'small'}
      variant={role === MemberRole.viewer ? 'outlined' : 'filled'}
    />
  );
};
