import { zodResolver } from '@hookform/resolvers/zod';
import { DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { ContextModalProps } from '@/components/ui/modals';
import { modals } from '@/components/ui/modals/methods';

import { useCreateFolder } from '../../hooks/use-create-folder';

const createFolderSchema = z.object({
  name: z.string().min(1, 'Название обязательно').max(255, 'Не более 255 символов'),
});

type CreateFolderFormValues = z.infer<typeof createFolderSchema>;

export type CreateFolderModalProps = {
  parentId?: string;
  parentName?: string;
};

export const CreateFolderModal = ({ id, innerProps }: ContextModalProps<CreateFolderModalProps>) => {
  const { parentId, parentName } = innerProps;
  const { mutateAsync, isPending } = useCreateFolder();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateFolderFormValues>({
    resolver: zodResolver(createFolderSchema),
    defaultValues: { name: '' },
  });

  const onSubmit = async (values: CreateFolderFormValues) => {
    await mutateAsync({ data: { name: values.name, ...(parentId !== undefined ? { parentId } : {}) } });
    modals.closeModal(id);
  };

  return (
    <>
      <DialogTitle>{parentName ? `Создать папку в "${parentName}"` : 'Создать папку'}</DialogTitle>
      <DialogContent>
        <FormField
          label={'Название'}
          {...register('name')}
          error={!!errors.name}
          helperText={errors.name?.message}
          autoFocus
          fullWidth
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
