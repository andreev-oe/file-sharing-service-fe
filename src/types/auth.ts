export type TokenPair = {
  accessToken: string;
  refreshToken: string;
};

export type AuthUser = {
  id: string;
  email: string;
  name: string;
  username: string;
  avatarUrl: string | null;
  bio: string | null;
  role: 'user' | 'admin';
  createdAt: string;
  updatedAt: string;
};
