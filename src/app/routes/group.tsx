import { useParams } from 'react-router-dom';

import { Head } from '@/components/seo';
import { GroupDetailPage } from '@/features/groups/components/group-detail-page';

export const GroupRoute = () => {
  const { groupId } = useParams<{ groupId: string }>();

  if (!groupId) {
    return null;
  }

  return (
    <>
      <Head title={'Группа'} />
      <GroupDetailPage groupId={groupId} />
    </>
  );
};
