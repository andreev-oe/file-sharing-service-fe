import { useFilesControllerSearch } from '@/api/generated/endpoints/files/files';
import type { FileRecord } from '@/types/files';
import { isFileRecordArray } from '@/utils/api.utils';

export const useSearchFiles = (searchQuery: string) => {
  const result = useFilesControllerSearch({ q: searchQuery }, { query: { enabled: searchQuery.length > 0 } });
  const rawData: unknown = result.data;
  const files: FileRecord[] = isFileRecordArray(rawData) ? rawData : [];
  return { ...result, data: files };
};
