import { useShareLinksControllerFindByToken } from '@/api/generated/endpoints/share-links/share-links';

export const useShareLink = (token: string, password: string) => {
  return useShareLinksControllerFindByToken(
    token,
    { password },
    {
      query: { retry: false },
    },
  );
};
