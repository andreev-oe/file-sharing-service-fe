import {
  getFoldersControllerGetTreeQueryKey,
  useFoldersControllerGetTree,
} from '@/api/generated/endpoints/folders/folders';

export { getFoldersControllerGetTreeQueryKey as getFolderTreeQueryKey };

export const useFolderTree = () => {
  const query = useFoldersControllerGetTree();
  return { ...query, data: query.data ?? [] };
};
