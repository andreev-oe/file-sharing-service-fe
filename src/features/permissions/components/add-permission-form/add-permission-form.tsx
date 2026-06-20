import { zodResolver } from '@hookform/resolvers/zod';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { Alert, Box, TextField, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

import {
  CreatePermissionDtoPermission as PermissionLevel,
  CreatePermissionDtoResourceType,
  CreatePermissionDtoSubjectType as SubjectType,
} from '@/api/generated/types';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/auth.store';

import { useGrantPermission } from '../../hooks/use-grant-permission';
import { PermissionLevelSelect } from '../permission-level-select';

const addPermissionSchema = z
  .object({
    subjectType: z.nativeEnum(SubjectType),
    subjectId: z.string(),
    permission: z.nativeEnum(PermissionLevel),
  })
  .superRefine((values, context) => {
    if (values.subjectType !== SubjectType.everyone && values.subjectId.trim().length === 0) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Обязательное поле',
        path: ['subjectId'],
      });
    }
  });

type AddPermissionFormValues = z.infer<typeof addPermissionSchema>;

export type AddPermissionFormProps = {
  resourceId: string;
  resourceType: CreatePermissionDtoResourceType;
  onSuccess?: () => void;
};

export const AddPermissionForm = ({ resourceId, resourceType, onSuccess }: AddPermissionFormProps) => {
  const user = useAuthStore((state) => state.user);
  const isAdmin = user?.role === 'admin';

  const { mutateAsync, isPending } = useGrantPermission();

  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    formState: { errors },
  } = useForm<AddPermissionFormValues>({
    resolver: zodResolver(addPermissionSchema),
    defaultValues: {
      subjectType: SubjectType.user,
      subjectId: '',
      permission: PermissionLevel.VIEW,
    },
  });

  const subjectType = watch('subjectType');
  const showSubjectIdField = subjectType !== SubjectType.everyone;

  const onSubmit = async (values: AddPermissionFormValues) => {
    await mutateAsync({
      data: {
        resourceId,
        resourceType,
        subjectType: values.subjectType,
        subjectId: values.subjectType !== SubjectType.everyone ? values.subjectId.trim() : undefined,
        permission: values.permission,
      },
    });
    reset();
    onSuccess?.();
  };

  return (
    <FormRoot>
      <FormSection>
        <SectionLabel variant={'caption'} color={'text.secondary'}>
          Кому предоставить доступ
        </SectionLabel>
        <Controller
          name={'subjectType'}
          control={control}
          render={({ field }) => (
            <ToggleButtonGroup
              value={field.value}
              exclusive
              onChange={(_event, newValue) => {
                if (newValue !== null) {
                  field.onChange(newValue);
                }
              }}
              size={'small'}
              fullWidth
            >
              <ToggleButton value={SubjectType.user}>Пользователь</ToggleButton>
              <ToggleButton value={SubjectType.group}>Группа</ToggleButton>
              {isAdmin && <ToggleButton value={SubjectType.everyone}>Все</ToggleButton>}
            </ToggleButtonGroup>
          )}
        />
      </FormSection>

      {showSubjectIdField && (
        <TextField
          label={subjectType === SubjectType.user ? 'ID пользователя' : 'ID группы'}
          fullWidth
          {...register('subjectId')}
          error={!!errors.subjectId}
          helperText={errors.subjectId?.message}
          size={'small'}
        />
      )}

      <Controller
        name={'permission'}
        control={control}
        render={({ field }) => (
          <PermissionLevelSelect value={field.value} onChange={field.onChange} disabled={isPending} />
        )}
      />

      {resourceType === CreatePermissionDtoResourceType.folder && (
        <Alert icon={<InfoOutlinedIcon fontSize={'small'} />} severity={'info'} variant={'outlined'}>
          Права будут применены ко всем вложенным папкам и файлам
        </Alert>
      )}

      <SubmitButton variant={'contained'} loading={isPending} onClick={handleSubmit(onSubmit)} fullWidth>
        Предоставить доступ
      </SubmitButton>
    </FormRoot>
  );
};

const FormRoot = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
}));

const FormSection = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(0.75),
}));

const SectionLabel = styled(Typography)({
  fontWeight: 500,
});

const SubmitButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(0.5),
}));
