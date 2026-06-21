import { useFilesControllerSearch } from '@/api/generated/endpoints/files/files';
import { useFoldersControllerSearch } from '@/api/generated/endpoints/folders/folders';
import { useNotesControllerSearch } from '@/api/generated/endpoints/notes/notes';

const MIN_QUERY_LENGTH = 2;

export const useGlobalSearch = (query: string) => {
  const isEnabled = query.length >= MIN_QUERY_LENGTH;
  const params = { q: query };
  const queryOptions = { query: { enabled: isEnabled } };

  const { data: files, isFetching: isFilesFetching } = useFilesControllerSearch(params, queryOptions);
  const { data: folders, isFetching: isFoldersFetching } = useFoldersControllerSearch(params, queryOptions);
  const { data: notes, isFetching: isNotesFetching } = useNotesControllerSearch(params, queryOptions);

  return {
    files: files ?? [],
    folders: folders ?? [],
    notes: notes ?? [],
    isLoading: isFilesFetching || isFoldersFetching || isNotesFetching,
    isEnabled,
  };
};
