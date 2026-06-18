import { Box, Button, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

import { Head } from '@/components/seo';
import { paths } from '@/config/paths';

export const NotFoundRoute = () => {
  return (
    <>
      <Head title="404 — Страница не найдена" />
      <Box
        sx={{
          minHeight: '100vh',
          bgcolor: 'background.default',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 2,
          p: 3,
        }}
      >
        <Typography
          variant="h1"
          fontWeight={800}
          color="primary.main"
          sx={{ fontSize: { xs: 80, sm: 120 }, lineHeight: 1 }}
        >
          404
        </Typography>
        <Typography variant="h5" fontWeight={600} textAlign="center">
          Страница не найдена
        </Typography>
        <Typography color="text.secondary" textAlign="center">
          Запрашиваемая страница не существует или была удалена
        </Typography>
        <Button component={Link} to={paths.home.getHref()} variant="contained" size="large" sx={{ mt: 1 }}>
          На главную
        </Button>
      </Box>
    </>
  );
};
