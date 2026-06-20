import { zodResolver } from '@hookform/resolvers/zod';
import { DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { ContextModalProps } from '@/components/ui/modals';
import { modals } from '@/components/ui/modals/methods';

import { useUpdateFolder } from '../../hooks/use-update-folder';

const renameFolderSchema = z.object({
  name: z.string().min(1, 'Название обязательно').max(255, 'Не более 255 символов'),
});

type RenameFolderFormValues = z.infer<typeof renameFolderSchema>;

export type RenameFolderModalProps = {
  folderId: string;
  currentName: string;
};

export const RenameFolderModal = ({ id, innerProps }: ContextModalProps<RenameFolderModalProps>) => {
  const { folderId, currentName } = innerProps;
  const { mutateAsync, isPending } = useUpdateFolder();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RenameFolderFormValues>({
    resolver: zodResolver(renameFolderSchema),
    defaultValues: { name: currentName },
  });

  const onSubmit = async (values: RenameFolderFormValues) => {
    await mutateAsync({ id: folderId, data: { name: values.name } });
    modals.closeModal(id);
  };

  return (
    <>
      <DialogTitle>Переименовать папку</DialogTitle>
      <DialogContent>
        <FormField
          label={'Новое название'}
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
          Переименовать
        </Button>
      </DialogActions>
    </>
  );
};

const FormField = styled(TextField)(({ theme }) => ({
  marginTop: theme.spacing(1),
}));
