import EmailIcon from '@mui/icons-material/Email';
import PersonIcon from '@mui/icons-material/Person';
import { Box, Card, CardContent, Chip, Divider, Stack, Typography } from '@mui/material';

import { Head } from '@/components/seo';
import { AvatarUpload } from '@/features/users/components/avatar-upload';
import { ProfileForm } from '@/features/users/components/profile-form';
import { useAuthStore } from '@/store/auth.store';

export const ProfileRoute = () => {
  const { user } = useAuthStore();

  return (
    <>
      <Head title="Профиль" />
      <Box p={3} maxWidth={720} mx="auto">
        <Typography variant="h5" mb={3}>
          Профиль
        </Typography>

        <Stack gap={2.5}>
          {/* Info card */}
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Stack direction={{ xs: 'column', sm: 'row' }} gap={3} alignItems={{ sm: 'flex-start' }}>
                <AvatarUpload />

                <Stack gap={1} flex={1}>
                  <Stack direction="row" alignItems="center" gap={1} flexWrap="wrap">
                    <Typography variant="h6">{user?.name}</Typography>
                    {user?.role === 'admin' && (
                      <Chip label="Admin" size="small" color="primary" sx={{ height: 20, fontSize: 11 }} />
                    )}
                  </Stack>

                  <Stack direction="row" alignItems="center" gap={0.75}>
                    <PersonIcon sx={{ fontSize: 15, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                      @{user?.username}
                    </Typography>
                  </Stack>

                  <Stack direction="row" alignItems="center" gap={0.75}>
                    <EmailIcon sx={{ fontSize: 15, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                      {user?.email}
                    </Typography>
                  </Stack>

                  {user?.bio && (
                    <>
                      <Divider sx={{ my: 0.5 }} />
                      <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'pre-wrap' }}>
                        {user.bio}
                      </Typography>
                    </>
                  )}
                </Stack>
              </Stack>
            </CardContent>
          </Card>

          {/* Edit form card */}
          <Card>
            <CardContent sx={{ p: 3 }}>
              <ProfileForm />
            </CardContent>
          </Card>
        </Stack>
      </Box>
    </>
  );
};
