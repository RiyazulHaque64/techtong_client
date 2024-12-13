import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';

import { CONFIG } from 'src/config-global';
import { DashboardLayout } from 'src/layouts/dashboard';

import { LoadingScreen } from 'src/components/loading-screen';

import { AuthGuard } from 'src/auth/guard';

import { paths } from '../paths';

// ----------------------------------------------------------------------

const IndexPage = lazy(() => import('src/pages/dashboard/one'));
const Media = lazy(() => import('src/pages/dashboard/media'));
const Brand = lazy(() => import('src/pages/dashboard/brand'));
const Category = lazy(() => import('src/pages/dashboard/category'));
const Attribute = lazy(() => import('src/pages/dashboard/attribute'));
const ChangePassword = lazy(() => import('src/pages/account/change-password'));
const UpdateProfile = lazy(() => import('src/pages/account/update-profile'));
const PageFour = lazy(() => import('src/pages/dashboard/four'));
const PageFive = lazy(() => import('src/pages/dashboard/five'));
const PageSix = lazy(() => import('src/pages/dashboard/six'));

// ----------------------------------------------------------------------

const layoutContent = (
  <DashboardLayout>
    <Suspense fallback={<LoadingScreen />}>
      <Outlet />
    </Suspense>
  </DashboardLayout>
);

export const dashboardRoutes = [
  {
    path: paths.dashboard.root,
    element: CONFIG.auth.skip ? <>{layoutContent}</> : <AuthGuard>{layoutContent}</AuthGuard>,
    children: [
      { element: <IndexPage />, index: true },
      { path: paths.auth.change_password, element: <ChangePassword /> },
      { path: paths.auth.update_profile, element: <UpdateProfile /> },
      { path: paths.dashboard.media, element: <Media /> },
      { path: paths.dashboard.brand, element: <Brand /> },
      { path: paths.dashboard.category, element: <Category /> },
      { path: paths.dashboard.attribute, element: <Attribute /> },
      {
        path: 'group',
        children: [
          { element: <PageFour />, index: true },
          { path: 'five', element: <PageFive /> },
          { path: 'six', element: <PageSix /> },
        ],
      },
    ],
  },
];
