import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { UpdateProfileForm } from './components/update-profile-form';

// ----------------------------------------------------------------------

export function UpdateProfileView() {
  return (
    <DashboardContent maxWidth="xl">
      <CustomBreadcrumbs
        heading="Update profile"
        links={[{ name: 'Home', href: paths.dashboard.root }, { name: 'Update profile' }]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <UpdateProfileForm />
    </DashboardContent>
  );
}
