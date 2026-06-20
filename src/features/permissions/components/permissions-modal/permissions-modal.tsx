import { DialogContent, DialogTitle } from '@mui/material';

import type { CreatePermissionDtoResourceType } from '@/api/generated/types';
import { ContextModalProps } from '@/components/ui/modals';

import { AddPermissionForm } from '../add-permission-form';

export type PermissionsModalProps = {
  resourceId: string;
  resourceType: CreatePermissionDtoResourceType;
  resourceName: string;
};

export const PermissionsModal = ({ innerProps }: ContextModalProps<PermissionsModalProps>) => {
  const { resourceId, resourceType, resourceName } = innerProps;

  return (
    <>
      <DialogTitle>{`Управление доступом — ${resourceName}`}</DialogTitle>
      <DialogContent>
        <AddPermissionForm resourceId={resourceId} resourceType={resourceType} />
      </DialogContent>
    </>
  );
};
