import {
  getPermissionsControllerListQueryKey,
  usePermissionsControllerList,
} from '@/api/generated/endpoints/permissions/permissions';
import type { PermissionsControllerListParams } from '@/api/generated/types';

export { getPermissionsControllerListQueryKey as getPermissionsQueryKey };

export const usePermissions = (params: PermissionsControllerListParams, enabled: boolean) => {
  const query = usePermissionsControllerList(params, { query: { enabled } });
  return { ...query, data: query.data ?? [] };
};
