import { Navigate } from 'react-router-dom';

import { paths } from '@/config/paths';

export const LandingRoute = () => {
  return <Navigate to={paths.drive.getHref()} replace />;
};
