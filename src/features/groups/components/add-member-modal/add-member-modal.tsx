import { zodResolver } from '@hookform/resolvers/zod';
import {
  Autocomplete,
  Avatar,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  ListItem,
  ListItemAvatar,
  ListItemText,
  MenuItem,
  Select,
  TextField,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

import { useUsersControllerFindAll } from '@/api/generated/endpoints/users/users';
import { AddMemberDtoRole as MemberRole } from '@/api/generated/types';
import type { UserPublicDto } from '@/api/generated/types';
import { Button } from '@/components/ui/button';
import { ContextModalProps } from '@/components/ui/modals';
import { modals } from '@/components/ui/modals/methods';

import { useAddMember } from '../../hooks/use-add-member';

const ROLE_LABEL: Record<(typeof MemberRole)[keyof typeof MemberRole], string> = {
  [MemberRole.owner]: 'Владелец',
  [MemberRole.admin]: 'Администратор',
  [MemberRole.member]: 'Участник',
  [MemberRole.viewer]: 'Наблюдатель',
};

const addMemberSchema = z.object({
  userId: z.string().min(1, 'Выберите пользователя'),
  role: z.nativeEnum(MemberRole),
});

type AddMemberFormValues = z.infer<typeof addMemberSchema>;

export type AddMemberModalProps = {
  groupId: string;
};

export const AddMemberModal = ({ id, innerProps }: ContextModalProps<AddMemberModalProps>) => {
  const { groupId } = innerProps;
  const { mutateAsync, isPending } = useAddMember(groupId);
  const { data: users = [], isLoading: isUsersLoading } = useUsersControllerFindAll();

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<AddMemberFormValues>({
    resolver: zodResolver(addMemberSchema),
    defaultValues: { userId: '', role: MemberRole.member },
  });

  const onSubmit = async (values: AddMemberFormValues) => {
    await mutateAsync({ id: groupId, data: { userId: values.userId, role: values.role } });
    modals.closeModal(id);
  };

  return (
    <>
      <DialogTitle>Добавить участника</DialogTitle>
      <DialogContent>
        <Controller
          name={'userId'}
          control={control}
          render={({ field }) => (
            <UserAutocomplete
              options={users}
              loading={isUsersLoading}
              getOptionLabel={(user) => `${user.name} (@${user.username})`}
              filterOptions={(options, state) => {
                const query = state.inputValue.toLowerCase();
                return options.filter(
                  (user) => user.name.toLowerCase().includes(query) || user.username.toLowerCase().includes(query),
                );
              }}
              onChange={(_event, user) => {
                field.onChange(user?.id ?? '');
              }}
              renderOption={(props, user) => (
                <ListItem {...props} key={user.id}>
                  <ListItemAvatar>
                    <Avatar src={typeof user.avatarUrl === 'string' ? user.avatarUrl : undefined} alt={user.name}>
                      {user.name.charAt(0).toUpperCase()}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText primary={user.name} secondary={`@${user.username}`} />
                </ListItem>
              )}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={'Пользователь'}
                  autoFocus
                  error={!!errors.userId}
                  helperText={errors.userId?.message}
                />
              )}
              noOptionsText={'Пользователи не найдены'}
              loadingText={'Загрузка...'}
              isOptionEqualToValue={(option, value) => option.id === value.id}
            />
          )}
        />
        <RoleFormControl fullWidth>
          <InputLabel id={'add-member-role-label'}>Роль</InputLabel>
          <Controller
            name={'role'}
            control={control}
            render={({ field }) => (
              <Select labelId={'add-member-role-label'} label={'Роль'} {...field}>
                {Object.values(MemberRole).map((role) => (
                  <MenuItem key={role} value={role}>
                    {ROLE_LABEL[role]}
                  </MenuItem>
                ))}
              </Select>
            )}
          />
        </RoleFormControl>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            modals.closeModal(id);
          }}
        >
          Отмена
        </Button>
        <Button variant={'contained'} loading={isPending} onClick={handleSubmit(onSubmit)}>
          Добавить
        </Button>
      </DialogActions>
    </>
  );
};

const UserAutocomplete = styled(Autocomplete<UserPublicDto>)(({ theme }) => ({
  marginTop: theme.spacing(1),
}));

const RoleFormControl = styled(FormControl)(({ theme }) => ({
  marginTop: theme.spacing(2),
}));
