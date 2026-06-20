import { zodResolver } from '@hookform/resolvers/zod';
import { Alert, Stack, TextField, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { notifications } from '@/components/ui/notifications';
import { useAuthStore } from '@/store/auth.store';
import { getApiErrorMessage } from '@/utils/api.utils';

import { useUpdateProfile } from '../../hooks/use-update-profile';

const profileSchema = z.object({
  name: z.string().min(1, 'Введите имя').max(100, 'Максимум 100 символов'),
  bio: z.string().max(500, 'Максимум 500 символов'),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export const ProfileForm = () => {
  const { user } = useAuthStore();
  const updateMutation = useUpdateProfile();

  const { control, handleSubmit, reset } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: user?.name ?? '', bio: user?.bio ?? '' },
  });

  useEffect(() => {
    if (user) {
      reset({ name: user.name, bio: user.bio ?? '' });
    }
  }, [user, reset]);

  const onSubmit = (data: ProfileFormData) => {
    updateMutation.mutate(
      { data: { name: data.name, bio: data.bio || undefined } },
      {
        onSuccess: () => {
          notifications.add({ variant: 'success', message: 'Профиль обновлён' });
        },
      },
    );
  };

  return (
    <Stack gap={2.5} component={'form'} onSubmit={handleSubmit(onSubmit)}>
      <Typography variant={'subtitle1'}>Редактирование профиля</Typography>

      <Controller
        name={'name'}
        control={control}
        render={({ field, fieldState }) => (
          <TextField
            {...field}
            label={'Имя'}
            fullWidth
            size={'medium'}
            error={!!fieldState.error}
            helperText={fieldState.error?.message}
          />
        )}
      />

      <Controller
        name={'bio'}
        control={control}
        render={({ field, fieldState }) => (
          <TextField
            {...field}
            label={'О себе'}
            fullWidth
            size={'medium'}
            multiline
            rows={3}
            error={!!fieldState.error}
            helperText={fieldState.error?.message ?? 'Расскажите немного о себе'}
          />
        )}
      />

      {updateMutation.error && (
        <RoundedAlert severity={'error'}>{getApiErrorMessage(updateMutation.error)}</RoundedAlert>
      )}

      <Stack direction={'row'} justifyContent={'flex-end'}>
        <Button type={'submit'} variant={'contained'} loading={updateMutation.isPending}>
          Сохранить
        </Button>
      </Stack>
    </Stack>
  );
};

const RoundedAlert = styled(Alert)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius * 2,
}));
