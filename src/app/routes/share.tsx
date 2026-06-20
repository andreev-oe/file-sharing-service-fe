import LinkIcon from '@mui/icons-material/Link';
import { Box, CircularProgress, Stack, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useParams } from 'react-router-dom';

import { Head } from '@/components/seo';

export const ShareRoute = () => {
  const { token } = useParams<{ token: string }>();

  return (
    <>
      <Head title={'Публичная ссылка'} />
      <SharePageRoot>
        <Stack alignItems={'center'} gap={2}>
          <ShareLinkIcon />
          <Typography variant={'h6'}>Загрузка файла...</Typography>
          <CircularProgress size={24} />
          <Typography variant={'caption'} color={'text.secondary'}>
            Токен: {token}
          </Typography>
        </Stack>
      </SharePageRoot>
    </>
  );
};

const SharePageRoot = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  backgroundColor: theme.palette.background.default,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const ShareLinkIcon = styled(LinkIcon)(({ theme }) => ({
  fontSize: 64,
  color: theme.palette.primary.main,
}));
