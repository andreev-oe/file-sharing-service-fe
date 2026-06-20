import {
  getFoldersControllerGetTreeQueryKey,
  useFoldersControllerGetTree,
} from '@/api/generated/endpoints/folders/folders';
import type { FolderNode } from '@/types/folders';
import { isFolderNodeArray } from '@/utils/api.utils';

export { getFoldersControllerGetTreeQueryKey as getFolderTreeQueryKey };

export const useFolderTree = () => {
  const query = useFoldersControllerGetTree();
  const rawData: unknown = query.data;
  const tree: FolderNode[] = isFolderNodeArray(rawData) ? rawData : [];
  return { ...query, data: tree };
};
