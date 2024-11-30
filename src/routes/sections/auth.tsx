import { lazy } from 'react';

import { AuthSplitLayout } from 'src/layouts/auth-split';

import { GuestGuard } from 'src/auth/guard';

import { paths } from '../paths';

// ----------------------------------------------------------------------

const SignInPage = lazy(() => import('src/pages/auth/sign-in'));
const ForgotPassowrdPage = lazy(() => import('src/pages/auth/forgot-password'));

// ----------------------------------------------------------------------

export const authRoutes = [
  {
    path: paths.auth.login,
    element: (
      <GuestGuard>
        <AuthSplitLayout section={{ title: 'Hi, Welcome back' }}>
          <SignInPage />
        </AuthSplitLayout>
      </GuestGuard>
    ),
  },
  {
    path: paths.auth.forgot_password,
    element: (
      <GuestGuard>
        <AuthSplitLayout>
          <ForgotPassowrdPage />
        </AuthSplitLayout>
      </GuestGuard>
    ),
  },
];
