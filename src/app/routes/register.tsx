import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import { Box, Card, CardContent, Divider, Stack, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Navigate, useNavigate } from 'react-router-dom';

import { Head } from '@/components/seo';
import { paths } from '@/config/paths';
import { RegisterForm } from '@/features/auth/components/register-form';
import { useAuthStore } from '@/store/auth.store';

export const RegisterRoute = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();

  if (isAuthenticated) {
    return <Navigate to={paths.drive.getHref()} replace />;
  }

  return (
    <>
      <Head title={'Регистрация'} />
      <AuthPageRoot>
        <Stack alignItems={'center'} gap={3} width={'100%'} maxWidth={420}>
          <Stack alignItems={'center'} gap={1.5}>
            <BrandIconBox>
              <BrandIcon />
            </BrandIconBox>
            <Typography variant={'h5'}>FileShare Pro</Typography>
            <Typography color={'text.secondary'} variant={'body2'}>
              Создайте аккаунт
            </Typography>
          </Stack>

          <FullWidthCard>
            <PaddedCardContent>
              <RegisterForm onSuccess={() => navigate(paths.drive.getHref())} />
            </PaddedCardContent>
          </FullWidthCard>

          <Stack direction={'row'} alignItems={'center'} gap={1}>
            <FlexDivider />
            <Typography variant={'body2'} color={'text.secondary'}>
              Уже есть аккаунт?
            </Typography>
            <FlexDivider />
          </Stack>
          <Typography variant={'body2'}>
            <AuthLink href={paths.login.getHref()}>Войти</AuthLink>
          </Typography>
        </Stack>
      </AuthPageRoot>
    </>
  );
};

const AuthPageRoot = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  backgroundColor: theme.palette.background.default,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(2),
}));

const BrandIconBox = styled(Box)(({ theme }) => ({
  width: 52,
  height: 52,
  backgroundColor: theme.palette.primary.main,
  borderRadius: theme.shape.borderRadius * 2,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxShadow: '0 4px 16px rgba(251,140,0,0.35)',
}));

const BrandIcon = styled(FolderOpenIcon)({
  color: '#fff',
  fontSize: 28,
});

const FullWidthCard = styled(Card)({
  width: '100%',
});

const PaddedCardContent = styled(CardContent)(({ theme }) => ({
  padding: theme.spacing(3),
  '&:last-child': {
    paddingBottom: theme.spacing(3),
  },
}));

const FlexDivider = styled(Divider)({
  flex: 1,
});

const AuthLink = styled('a')(({ theme }) => ({
  color: theme.palette.primary.main,
  fontWeight: 600,
  textDecoration: 'none',
  '&:hover': {
    textDecoration: 'underline',
  },
}));
