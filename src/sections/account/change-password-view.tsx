import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { ChangePasswordForm } from './components/change-password-form';

// ----------------------------------------------------------------------

export function ChangePasswordView() {
  return (
    <DashboardContent maxWidth="xl">
      <CustomBreadcrumbs
        heading="Change password"
        links={[{ name: 'Home', href: paths.dashboard.root }, { name: 'Change password' }]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <ChangePasswordForm />
    </DashboardContent>
  );
}
