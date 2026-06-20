import EmailIcon from '@mui/icons-material/Email';
import PersonIcon from '@mui/icons-material/Person';
import { Box, Card, CardContent, Chip, Divider, Stack, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

import { Head } from '@/components/seo';
import { AvatarUpload } from '@/features/users/components/avatar-upload';
import { ProfileForm } from '@/features/users/components/profile-form';
import { useAuthStore } from '@/store/auth.store';

export const ProfileRoute = () => {
  const { user } = useAuthStore();

  return (
    <>
      <Head title={'Профиль'} />
      <Box p={3} maxWidth={720} mx={'auto'}>
        <Typography variant={'h5'} mb={3}>
          Профиль
        </Typography>

        <Stack gap={2.5}>
          <Card>
            <PaddedCardContent>
              <Stack direction={{ xs: 'column', sm: 'row' }} gap={3} alignItems={{ sm: 'flex-start' }}>
                <AvatarUpload />

                <Stack gap={1} flex={1}>
                  <Stack direction={'row'} alignItems={'center'} gap={1} flexWrap={'wrap'}>
                    <Typography variant={'h6'}>{user?.name}</Typography>
                    {user?.role === 'admin' && <AdminChip label={'Admin'} size={'small'} color={'primary'} />}
                  </Stack>

                  <Stack direction={'row'} alignItems={'center'} gap={0.75}>
                    <MetaPersonIcon />
                    <Typography variant={'body2'} color={'text.secondary'}>
                      @{user?.username}
                    </Typography>
                  </Stack>

                  <Stack direction={'row'} alignItems={'center'} gap={0.75}>
                    <MetaEmailIcon />
                    <Typography variant={'body2'} color={'text.secondary'}>
                      {user?.email}
                    </Typography>
                  </Stack>

                  {user?.bio && (
                    <>
                      <BioSectionDivider />
                      <BioText variant={'body2'} color={'text.secondary'}>
                        {user.bio}
                      </BioText>
                    </>
                  )}
                </Stack>
              </Stack>
            </PaddedCardContent>
          </Card>

          <Card>
            <PaddedCardContent>
              <ProfileForm />
            </PaddedCardContent>
          </Card>
        </Stack>
      </Box>
    </>
  );
};

const PaddedCardContent = styled(CardContent)(({ theme }) => ({
  padding: theme.spacing(3),
  '&:last-child': {
    paddingBottom: theme.spacing(3),
  },
}));

const AdminChip = styled(Chip)({
  height: 20,
  fontSize: 11,
});

const MetaPersonIcon = styled(PersonIcon)(({ theme }) => ({
  fontSize: 15,
  color: theme.palette.text.secondary,
}));

const MetaEmailIcon = styled(EmailIcon)(({ theme }) => ({
  fontSize: 15,
  color: theme.palette.text.secondary,
}));

const BioSectionDivider = styled(Divider)(({ theme }) => ({
  marginTop: theme.spacing(0.5),
  marginBottom: theme.spacing(0.5),
}));

const BioText = styled(Typography)({
  whiteSpace: 'pre-wrap',
});
