import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';

import { AuthSplitLayout } from 'src/layouts/auth-split';

import { SplashScreen } from 'src/components/loading-screen';

import { GuestGuard } from 'src/auth/guard';

// ----------------------------------------------------------------------

const ForgotPassowrdPage = lazy(() => import('src/pages/auth/forgot-password'));

// ----------------------------------------------------------------------

export const authRoutes = [
  {
    path: 'auth',
    element: (
      <Suspense fallback={<SplashScreen />}>
        <Outlet />
      </Suspense>
    ),
    children: [
      {
        path: 'forgot-password',
        element: (
          <GuestGuard>
            <AuthSplitLayout>
              <ForgotPassowrdPage />
            </AuthSplitLayout>
          </GuestGuard>
        ),
      },
    ],
  },
];
