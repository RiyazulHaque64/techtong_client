import { Helmet } from 'react-helmet-async';

import { useAppSelector } from 'src/redux/hooks';
import { selectCurrentUser } from 'src/redux/features/auth/authSlice';

import { UpdateProfileView } from 'src/sections/account/update-profile-view';

// ----------------------------------------------------------------------

const metadata = { title: `Update profile` };

export default function Page() {
  const user = useAppSelector(selectCurrentUser);
  return (
    <>
      <Helmet>
        <title>
          {metadata.title} | {user?.name || 'user'}
        </title>
      </Helmet>

      <UpdateProfileView />
    </>
  );
}
