import { useFilesControllerSearch } from '@/api/generated/endpoints/files/files';

export const useSearchFiles = (searchQuery: string) => {
  const result = useFilesControllerSearch({ q: searchQuery }, { query: { enabled: searchQuery.length > 0 } });
  return { ...result, data: result.data ?? [] };
};
