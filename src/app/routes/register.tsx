import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import { Box, Card, CardContent, Divider, Stack, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import { Head } from '@/components/seo';
import { paths } from '@/config/paths';
import { RegisterForm } from '@/features/auth/components/register-form';

export const RegisterRoute = () => {
  const navigate = useNavigate();

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

          {/* Form card */}
          <Card sx={{ width: '100%' }}>
            <CardContent sx={{ p: 3, '&:last-child': { pb: 3 } }}>
              <RegisterForm onSuccess={() => navigate(paths.drive.getHref())} />
            </CardContent>
          </Card>

          {/* Footer */}
          <Stack direction="row" alignItems="center" gap={1}>
            <Divider sx={{ flex: 1 }} />
            <Typography variant="body2" color="text.secondary">
              Уже есть аккаунт?
            </Typography>
            <Divider sx={{ flex: 1 }} />
          </Stack>
          <Typography variant="body2">
            <Box
              component="a"
              href={paths.login.getHref()}
              sx={{
                color: 'primary.main',
                fontWeight: 600,
                textDecoration: 'none',
                '&:hover': { textDecoration: 'underline' },
              }}
            >
              Войти
            </Box>
          </Typography>
        </Stack>
      </Box>
    </>
  );
};
