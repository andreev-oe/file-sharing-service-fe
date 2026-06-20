import { zodResolver } from '@hookform/resolvers/zod';
import { DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { ContextModalProps } from '@/components/ui/modals';
import { modals } from '@/components/ui/modals/methods';

import { useCreateGroup } from '../../hooks/use-create-group';

const createGroupSchema = z.object({
  name: z.string().min(1, 'Название обязательно').max(100, 'Не более 100 символов'),
  description: z.string().max(500, 'Не более 500 символов').optional(),
});

type CreateGroupFormValues = z.infer<typeof createGroupSchema>;

export type CreateGroupModalProps = Record<string, never>;

export const CreateGroupModal = ({ id }: ContextModalProps<CreateGroupModalProps>) => {
  const { mutateAsync, isPending } = useCreateGroup();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateGroupFormValues>({
    resolver: zodResolver(createGroupSchema),
    defaultValues: { name: '', description: '' },
  });

  const onSubmit = async (values: CreateGroupFormValues) => {
    await mutateAsync({
      data: {
        name: values.name,
        ...(values.description && values.description.length > 0 ? { description: values.description } : {}),
      },
    });
    modals.closeModal(id);
  };

  return (
    <>
      <DialogTitle>Создать группу</DialogTitle>
      <DialogContent>
        <FormField
          label={'Название'}
          {...register('name')}
          error={!!errors.name}
          helperText={errors.name?.message}
          autoFocus
          fullWidth
        />
        <FormField
          label={'Описание'}
          {...register('description')}
          error={!!errors.description}
          helperText={errors.description?.message}
          fullWidth
          multiline
          rows={3}
        />
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
          Создать
        </Button>
      </DialogActions>
    </>
  );
};

const FormField = styled(TextField)(({ theme }) => ({
  marginTop: theme.spacing(1),
}));
