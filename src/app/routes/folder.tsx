import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useParams } from 'react-router-dom';

import { Head } from '@/components/seo';
import { FileList } from '@/features/files/components/file-list';

export const FolderRoute = () => {
  const { folderId } = useParams<{ folderId: string }>();

  if (!folderId) {
    return null;
  }

  return (
    <>
      <Head title={'Папка'} />
      <FolderRouteRoot>
        <FileList folderId={folderId} />
      </FolderRouteRoot>
    </>
  );
};

const FolderRouteRoot = styled(Box)({
  flex: 1,
  minHeight: 0,
  display: 'flex',
  flexDirection: 'column',
});
