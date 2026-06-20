import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import { Box, CircularProgress, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { Head } from '@/components/seo';
import { paths } from '@/config/paths';
import { useFolderTree } from '@/features/folders/hooks/use-folder-tree';

export const DriveRoute = () => {
  const navigate = useNavigate();
  const { data: tree, isLoading } = useFolderTree();

  useEffect(() => {
    if (!isLoading && tree.length > 0) {
      navigate(paths.folder.getHref(tree[0].id), { replace: true });
    }
  }, [isLoading, tree, navigate]);

  if (isLoading) {
    return (
      <CenteredBox>
        <CircularProgress />
      </CenteredBox>
    );
  }

  return (
    <>
      <Head title={'Мой диск'} />
      <CenteredBox>
        <EmptyStateIcon />
        <Typography variant={'h6'} color={'text.secondary'} fontWeight={400}>
          Нет папок
        </Typography>
        <Typography variant={'body2'} color={'text.secondary'}>
          Создайте первую папку в боковой панели
        </Typography>
      </CenteredBox>
    </>
  );
};

const CenteredBox = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100%',
  gap: 16,
});

const EmptyStateIcon = styled(FolderOpenIcon)(({ theme }) => ({
  fontSize: 72,
  color: theme.palette.primary.light,
}));
