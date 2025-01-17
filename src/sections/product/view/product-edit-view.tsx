import { useParams } from 'react-router-dom';

import { Stack } from '@mui/material';

import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';
import { useGetSingleProductQuery } from 'src/redux/features/product/product-api';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { ManageProductForm } from '../manage-product-form';

export function ProductEditView() {
  const { slug } = useParams();
  const { data: product } = useGetSingleProductQuery(slug || '');

  return (
    <DashboardContent>
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
        <CustomBreadcrumbs
          heading="Edit Product"
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'Product', href: paths.dashboard.product },
            { name: 'Edit Product' },
          ]}
          sx={{ mb: 3 }}
        />
      </Stack>
      <ManageProductForm product={product?.data} />
    </DashboardContent>
  );
}
