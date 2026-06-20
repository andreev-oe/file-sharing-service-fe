import { useParams } from 'react-router-dom';

import { Head } from '@/components/seo';
import { PublicSharePage } from '@/features/share-links/components/public-share-page';

export const ShareRoute = () => {
  const { token } = useParams<{ token: string }>();

  if (!token) {
    return null;
  }

  return (
    <>
      <Head title={'Публичная ссылка'} />
      <PublicSharePage token={token} />
    </>
  );
};
