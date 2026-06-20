import { Head } from '@/components/seo';
import { GroupList } from '@/features/groups/components/group-list';

export const GroupsRoute = () => {
  return (
    <>
      <Head title={'Группы'} />
      <GroupList />
    </>
  );
};
