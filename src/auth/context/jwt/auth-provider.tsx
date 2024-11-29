import { useMemo } from 'react';

import { useAppSelector } from 'src/redux/hooks';
import { selectCurrentUser } from 'src/redux/features/auth/authSlice';

import { AuthContext } from '../auth-context';

type Props = {
  children: React.ReactNode;
};

export function AuthProvider({ children }: Props) {
  const currentUser = useAppSelector(selectCurrentUser);

  const checkAuthenticated =
    currentUser?.role === 'ADMIN' || currentUser?.role === 'SUPER_ADMIN'
      ? 'authenticated'
      : 'unauthenticated';

  const memoizedValue = useMemo(
    () => ({
      user: currentUser,
      authenticated: checkAuthenticated === 'authenticated',
      loading: false,
      unauthenticated: checkAuthenticated === 'unauthenticated',
    }),
    [currentUser, checkAuthenticated]
  );

  return <AuthContext.Provider value={memoizedValue}>{children}</AuthContext.Provider>;
}
