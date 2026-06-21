import { zodResolver } from '@hookform/resolvers/zod';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import {
  Alert,
  Autocomplete,
  Avatar,
  Box,
  ListItem,
  ListItemAvatar,
  ListItemText,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

import { useGroupsControllerFindAll } from '@/api/generated/endpoints/groups/groups';
import { useUsersControllerFindAll } from '@/api/generated/endpoints/users/users';
import {
  CreatePermissionDtoPermission as PermissionLevel,
  CreatePermissionDtoResourceType,
  CreatePermissionDtoSubjectType as SubjectType,
} from '@/api/generated/types';
import type { GroupDto, UserPublicDto } from '@/api/generated/types';
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
  const { data: users = [], isLoading: isUsersLoading } = useUsersControllerFindAll();
  const { data: groups = [], isLoading: isGroupsLoading } = useGroupsControllerFindAll();

  const {
    handleSubmit,
    control,
    watch,
    reset,
    setValue,
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
  const showSubjectField = subjectType !== SubjectType.everyone;

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
                  setValue('subjectId', '');
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

      {showSubjectField && subjectType === SubjectType.user && (
        <Controller
          name={'subjectId'}
          control={control}
          render={({ field }) => (
            <Autocomplete<UserPublicDto>
              options={users}
              loading={isUsersLoading}
              getOptionLabel={(option) => `${option.name} (@${option.username})`}
              filterOptions={(options, state) => {
                const query = state.inputValue.toLowerCase();
                return options.filter(
                  (option) =>
                    option.name.toLowerCase().includes(query) || option.username.toLowerCase().includes(query),
                );
              }}
              onChange={(_event, selected) => {
                field.onChange(selected?.id ?? '');
              }}
              renderOption={(props, option) => (
                <ListItem {...props} key={option.id}>
                  <ListItemAvatar>
                    <Avatar src={option.avatarUrl ?? undefined} alt={option.name}>
                      {option.name.charAt(0).toUpperCase()}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText primary={option.name} secondary={`@${option.username}`} />
                </ListItem>
              )}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={'Пользователь'}
                  size={'small'}
                  error={!!errors.subjectId}
                  helperText={errors.subjectId?.message}
                />
              )}
              noOptionsText={'Пользователи не найдены'}
              loadingText={'Загрузка...'}
              isOptionEqualToValue={(option, value) => option.id === value.id}
            />
          )}
        />
      )}

      {showSubjectField && subjectType === SubjectType.group && (
        <Controller
          name={'subjectId'}
          control={control}
          render={({ field }) => (
            <Autocomplete<GroupDto>
              options={groups}
              loading={isGroupsLoading}
              getOptionLabel={(option) => option.name}
              filterOptions={(options, state) => {
                const query = state.inputValue.toLowerCase();
                return options.filter((option) => option.name.toLowerCase().includes(query));
              }}
              onChange={(_event, selected) => {
                field.onChange(selected?.id ?? '');
              }}
              renderOption={(props, option) => (
                <ListItem {...props} key={option.id}>
                  <ListItemText primary={option.name} secondary={option.description ?? undefined} />
                </ListItem>
              )}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={'Группа'}
                  size={'small'}
                  error={!!errors.subjectId}
                  helperText={errors.subjectId?.message}
                />
              )}
              noOptionsText={'Группы не найдены'}
              loadingText={'Загрузка...'}
              isOptionEqualToValue={(option, value) => option.id === value.id}
            />
          )}
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
