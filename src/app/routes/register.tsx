import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import { Box, Card, CardContent, Skeleton, Stack, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

import { Head } from '@/components/seo';
import { paths } from '@/config/paths';

export const RegisterRoute = () => {
  return (
    <>
      <Head title="Регистрация" />
      <Box
        sx={{
          minHeight: '100vh',
          bgcolor: 'background.default',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 2,
        }}
      >
        <Stack alignItems="center" gap={3} width="100%" maxWidth={420}>
          {/* Brand */}
          <Stack alignItems="center" gap={1.5}>
            <Box
              sx={{
                width: 52,
                height: 52,
                bgcolor: 'primary.main',
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 16px rgba(251,140,0,0.35)',
              }}
            >
              <FolderOpenIcon sx={{ color: '#fff', fontSize: 28 }} />
            </Box>
            <Typography variant="h5">FileShare Pro</Typography>
            <Typography color="text.secondary" variant="body2">
              Создайте аккаунт
            </Typography>
          </Stack>

          {/* Card */}
          <Card sx={{ width: '100%', p: 0.5 }}>
            <CardContent>
              <Stack gap={2}>
                <Skeleton variant="rounded" height={40} animation={false} sx={{ borderRadius: 2 }} />
                <Skeleton variant="rounded" height={40} animation={false} sx={{ borderRadius: 2 }} />
                <Skeleton variant="rounded" height={40} animation={false} sx={{ borderRadius: 2 }} />
                <Skeleton variant="rounded" height={40} animation={false} sx={{ borderRadius: 2 }} />
                <Skeleton
                  variant="rounded"
                  height={42}
                  animation={false}
                  sx={{ borderRadius: 2, bgcolor: 'primary.light' }}
                />
              </Stack>
            </CardContent>
          </Card>

          {/* Footer link */}
          <Typography variant="body2" color="text.secondary">
            Уже есть аккаунт?{' '}
            <Link to={paths.login.getHref()} style={{ color: '#FB8C00', fontWeight: 600, textDecoration: 'none' }}>
              Войти
            </Link>
          </Typography>
        </Stack>
      </Box>
    </>
  );
};
