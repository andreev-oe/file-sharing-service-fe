import { Box, Button, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Link } from 'react-router-dom';

import { Head } from '@/components/seo';
import { paths } from '@/config/paths';

export const NotFoundRoute = () => {
  return (
    <>
      <Head title={'404 — Страница не найдена'} />
      <NotFoundRoot>
        <ErrorCodeText variant={'h1'} fontWeight={800} color={'primary.main'}>
          404
        </ErrorCodeText>
        <Typography variant={'h5'} fontWeight={600} textAlign={'center'}>
          Страница не найдена
        </Typography>
        <Typography color={'text.secondary'} textAlign={'center'}>
          Запрашиваемая страница не существует или была удалена
        </Typography>
        <HomeButton component={Link} to={paths.home.getHref()} variant={'contained'} size={'large'}>
          На главную
        </HomeButton>
      </NotFoundRoot>
    </>
  );
};

const NotFoundRoot = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  backgroundColor: theme.palette.background.default,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.spacing(2),
  padding: theme.spacing(3),
}));

const ErrorCodeText = styled(Typography)(({ theme }) => ({
  fontSize: 80,
  lineHeight: 1,
  [theme.breakpoints.up('sm')]: {
    fontSize: 120,
  },
}));

const HomeButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(1),
})) as typeof Button;
