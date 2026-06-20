import { zodResolver } from '@hookform/resolvers/zod';
import { DialogActions, DialogContent, DialogTitle, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

import { AddMemberDtoRole as MemberRole } from '@/api/generated/types';
import { Button } from '@/components/ui/button';
import { ContextModalProps } from '@/components/ui/modals';
import { modals } from '@/components/ui/modals/methods';
import type { GroupMember } from '@/types/groups';

import { useTransferOwnership } from '../../hooks/use-transfer-ownership';

const transferOwnershipSchema = z.object({
  newOwnerId: z.string().min(1, 'Выберите участника'),
});

type TransferOwnershipFormValues = z.infer<typeof transferOwnershipSchema>;

export type TransferOwnershipModalProps = {
  groupId: string;
  members: GroupMember[];
};

export const TransferOwnershipModal = ({ id, innerProps }: ContextModalProps<TransferOwnershipModalProps>) => {
  const { groupId, members } = innerProps;
  const { mutateAsync, isPending } = useTransferOwnership(groupId);

  const candidates = members.filter((member) => member.role !== MemberRole.owner);

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<TransferOwnershipFormValues>({
    resolver: zodResolver(transferOwnershipSchema),
    defaultValues: { newOwnerId: candidates[0]?.userId ?? '' },
  });

  const onSubmit = async (values: TransferOwnershipFormValues) => {
    await mutateAsync({ id: groupId, data: { newOwnerId: values.newOwnerId } });
    modals.closeModal(id);
  };

  return (
    <>
      <DialogTitle>Передать права владельца</DialogTitle>
      <DialogContent>
        <FormControl fullWidth>
          <InputLabel id={'new-owner-label'}>Новый владелец</InputLabel>
          <Controller
            name={'newOwnerId'}
            control={control}
            render={({ field }) => (
              <Select labelId={'new-owner-label'} label={'Новый владелец'} {...field} error={!!errors.newOwnerId}>
                {candidates.map((member) => (
                  <MenuItem key={member.userId} value={member.userId}>
                    {member.user.name} (@{member.user.username})
                  </MenuItem>
                ))}
              </Select>
            )}
          />
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            modals.closeModal(id);
          }}
        >
          Отмена
        </Button>
        <Button variant={'contained'} color={'warning'} loading={isPending} onClick={handleSubmit(onSubmit)}>
          Передать
        </Button>
      </DialogActions>
    </>
  );
};
