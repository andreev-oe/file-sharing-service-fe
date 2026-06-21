import { Head } from '@/components/seo';
import { PermissionsPage } from '@/features/permissions/components/permissions-page';

export const PermissionsRoute = () => {
  return (
    <>
      <Head title={'Управление доступом'} />
      <PermissionsPage />
    </>
  );
};
