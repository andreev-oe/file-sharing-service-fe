import { zodResolver } from '@hookform/resolvers/zod';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { Alert, IconButton, InputAdornment, Stack, TextField } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { getApiErrorMessage } from '@/utils/api.utils';

import { useRegister } from '../../hooks/use-register';

const registerSchema = z.object({
  name: z.string().min(1, 'Введите имя').max(100, 'Максимум 100 символов'),
  username: z
    .string()
    .min(3, 'Минимум 3 символа')
    .max(32, 'Максимум 32 символа')
    .regex(/^[a-z0-9_]+$/, 'Только строчные латинские буквы, цифры и _'),
  email: z.string().email('Введите корректный email'),
  password: z.string().min(8, 'Минимум 8 символов'),
});

type RegisterFormData = z.infer<typeof registerSchema>;

type RegisterFormProps = {
  onSuccess: () => void;
};

export const RegisterForm = ({ onSuccess }: RegisterFormProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const registerMutation = useRegister();

  const { control, handleSubmit } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: '', username: '', email: '', password: '' },
  });

  const onSubmit = (data: RegisterFormData) => {
    registerMutation.mutate({ data }, { onSuccess });
  };

  return (
    <Stack component="form" gap={2.5} onSubmit={handleSubmit(onSubmit)}>
      <Controller
        name="name"
        control={control}
        render={({ field, fieldState }) => (
          <TextField
            {...field}
            label="Имя"
            fullWidth
            size="medium"
            autoComplete="name"
            autoFocus
            error={!!fieldState.error}
            helperText={fieldState.error?.message}
          />
        )}
      />

      <Controller
        name="username"
        control={control}
        render={({ field, fieldState }) => (
          <TextField
            {...field}
            label="Имя пользователя"
            fullWidth
            size="medium"
            autoComplete="username"
            error={!!fieldState.error}
            helperText={fieldState.error?.message ?? 'Только латиница, цифры и _ (3–32 символа)'}
            InputProps={{
              startAdornment: <InputAdornment position="start">@</InputAdornment>,
            }}
          />
        )}
      />

      <Controller
        name="email"
        control={control}
        render={({ field, fieldState }) => (
          <TextField
            {...field}
            label="Email"
            type="email"
            fullWidth
            size="medium"
            autoComplete="email"
            error={!!fieldState.error}
            helperText={fieldState.error?.message}
          />
        )}
      />

      <Controller
        name="password"
        control={control}
        render={({ field, fieldState }) => (
          <TextField
            {...field}
            label="Пароль"
            type={showPassword ? 'text' : 'password'}
            fullWidth
            size="medium"
            autoComplete="new-password"
            error={!!fieldState.error}
            helperText={fieldState.error?.message ?? 'Минимум 8 символов'}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword((prev) => !prev)} edge="end" size="small" tabIndex={-1}>
                    {showPassword ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        )}
      />

      {registerMutation.error && (
        <RoundedAlert severity="error">{getApiErrorMessage(registerMutation.error, 'Ошибка регистрации')}</RoundedAlert>
      )}

      <Button type="submit" variant="contained" fullWidth size="large" loading={registerMutation.isPending}>
        Создать аккаунт
      </Button>
    </Stack>
  );
};

const RoundedAlert = styled(Alert)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius * 2,
}));
