import { zodResolver } from '@hookform/resolvers/zod';
import { DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { ContextModalProps } from '@/components/ui/modals';
import { modals } from '@/components/ui/modals/methods';

import { useUpdateFile } from '../../hooks/use-update-file';

const renameFileSchema = z.object({
  name: z.string().min(1, 'Название обязательно').max(255, 'Не более 255 символов'),
});

type RenameFileFormValues = z.infer<typeof renameFileSchema>;

export type RenameFileModalProps = {
  fileId: string;
  folderId: string;
  currentName: string;
};

export const RenameFileModal = ({ id, innerProps }: ContextModalProps<RenameFileModalProps>) => {
  const { fileId, folderId, currentName } = innerProps;
  const { mutateAsync, isPending } = useUpdateFile(folderId);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RenameFileFormValues>({
    resolver: zodResolver(renameFileSchema),
    defaultValues: { name: currentName },
  });

  const onSubmit = async (values: RenameFileFormValues) => {
    await mutateAsync({ id: fileId, data: { name: values.name } });
    modals.closeModal(id);
  };

  return (
    <>
      <DialogTitle>Переименовать файл</DialogTitle>
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
