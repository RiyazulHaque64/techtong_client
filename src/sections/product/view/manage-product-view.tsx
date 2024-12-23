import { Alert, Stack } from '@mui/material';

import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { ManageProductForm } from '../manage-product-form';

export function ManageProductView() {
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
      <Alert variant="outlined" severity="info" sx={{ mb: 3 }}>
        Product name, model and price is required to add a product
      </Alert>
      <ManageProductForm />
    </DashboardContent>
  );
}
