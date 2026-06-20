import { useShareLinksControllerFindAllByUser } from '@/api/generated/endpoints/share-links/share-links';

export const useSharedFileIds = () => {
  const query = useShareLinksControllerFindAllByUser();
  const data = new Set((query.data ?? []).map((link) => link.fileId));
  return { ...query, data };
};
