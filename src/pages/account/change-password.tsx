import { Helmet } from 'react-helmet-async';

import { ChangePasswordView } from 'src/sections/account/change-password-view';

// ----------------------------------------------------------------------

const metadata = { title: `Change password` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <ChangePasswordView />
    </>
  );
}
