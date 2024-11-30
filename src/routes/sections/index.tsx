import { Navigate, useRoutes } from 'react-router-dom';

import { authRoutes } from './auth';
import { mainRoutes } from './main';
import { dashboardRoutes } from './dashboard';

// ----------------------------------------------------------------------

export function Router() {
  return useRoutes([
    // Dashboard
    ...dashboardRoutes,

    // Auth
    ...authRoutes,

    // Main
    ...mainRoutes,

    // No match
    { path: '*', element: <Navigate to="/404" replace /> },
  ]);
}
