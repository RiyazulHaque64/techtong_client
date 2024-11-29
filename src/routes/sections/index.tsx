import { lazy } from 'react';
import { Navigate, useRoutes } from 'react-router-dom';

import { AuthSplitLayout } from 'src/layouts/auth-split';

import { GuestGuard } from 'src/auth/guard';

import { authRoutes } from './auth';
import { mainRoutes } from './main';
import { dashboardRoutes } from './dashboard';

const SignInPage = lazy(() => import('src/pages/auth/sign-in'));

// ----------------------------------------------------------------------

export function Router() {
  return useRoutes([
    {
      path: '/',
      element: (
        <GuestGuard>
          <AuthSplitLayout section={{ title: 'Hi, Welcome back' }}>
            <SignInPage />
          </AuthSplitLayout>
        </GuestGuard>
      ),
    },

    // Auth
    ...authRoutes,

    // Dashboard
    ...dashboardRoutes,

    // Main
    ...mainRoutes,

    // No match
    { path: '*', element: <Navigate to="/404" replace /> },
  ]);
}
