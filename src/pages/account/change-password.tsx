import { Helmet } from 'react-helmet-async';

import { useAppSelector } from 'src/redux/hooks';
import { selectCurrentUser } from 'src/redux/features/auth/authSlice';

import { ChangePasswordView } from 'src/sections/account/change-password-view';

// ----------------------------------------------------------------------

const metadata = { title: `Change password` };

export default function Page() {
  const user = useAppSelector(selectCurrentUser);
  return (
    <>
      <Helmet>
        <title>
          {metadata.title} | {user?.name || 'user'}
        </title>
      </Helmet>

      <ChangePasswordView />
    </>
  );
}
