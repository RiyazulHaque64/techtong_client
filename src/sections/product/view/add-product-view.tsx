import { Stack } from '@mui/material';

import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { ManageProductForm } from '../manage-product-form';

export function AddProductView() {
  return (
    <DashboardContent>
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
        <CustomBreadcrumbs
          heading="Add Product"
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'Product', href: paths.dashboard.product },
            { name: 'Add Product' },
          ]}
          sx={{ mb: 3 }}
        />
      </Stack>
      <ManageProductForm />
    </DashboardContent>
  );
}
