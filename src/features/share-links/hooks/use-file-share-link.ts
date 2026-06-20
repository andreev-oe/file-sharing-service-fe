import { useShareLinksControllerFindByFile } from '@/api/generated/endpoints/share-links/share-links';

export const useFileShareLink = (fileId: string) => {
  return useShareLinksControllerFindByFile(fileId, {
    query: { retry: false },
  });
};
