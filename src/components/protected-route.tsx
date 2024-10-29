import { Navigate } from 'react-router';
import { useLocation } from 'react-router-dom';
import { Preloader } from '@ui';
import { useSelector } from '../services/store';
import { getIsAuthChecked, getUser } from '../services/slice/user';

type ProtectedRouteProps = {
  onlyUnauth?: boolean;
  children: React.ReactNode;
};

export function ProtectedRoute({ children, onlyUnauth }: ProtectedRouteProps) {
  const location = useLocation();
  const user = useSelector(getUser);
  const isAuthChecked = useSelector(getIsAuthChecked);

  if (!isAuthChecked) {
    return <Preloader />;
  }

  if (onlyUnauth && user) {
    const from = location.state?.from || { pathname: '/' };
    const backgroundLocation = location.state?.from?.state || null;
    return <Navigate replace to={from} state={{ backgroundLocation }} />;
  }

  if (!onlyUnauth && !user) {
    return (
      <Navigate
        replace
        to={'/login'}
        state={{
          from: {
            ...location,
            backgroundLocation: location.state?.backgroundLocation
          }
        }}
      />
    );
  }
  return children;
}
