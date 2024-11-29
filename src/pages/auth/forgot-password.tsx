import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { ForgotPasswordView } from 'src/auth/view';

// ----------------------------------------------------------------------

const metadata = { title: `Forgot Password | ${CONFIG.appName}` };

export default function ForgotPasswordPage() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <ForgotPasswordView />
    </>
  );
}
