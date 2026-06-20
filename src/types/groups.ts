import type { AddMemberDtoRole } from '@/api/generated/types';

export type Group = {
  id: string;
  name: string;
  description?: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
};

export type GroupMember = {
  userId: string;
  role: AddMemberDtoRole;
  user: {
    id: string;
    name: string;
    username: string;
    avatarUrl: string | null;
    bio: string | null;
  };
};
