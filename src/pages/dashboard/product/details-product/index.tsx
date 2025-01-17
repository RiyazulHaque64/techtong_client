import type { IErrorResponse } from 'src/redux/interfaces/common';

import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';

import { Button } from '@mui/material';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { CONFIG } from 'src/config-global';
import { DashboardContent } from 'src/layouts/dashboard';
import { useGetSingleProductQuery } from 'src/redux/features/product/product-api';

import { Iconify } from 'src/components/iconify';
import { EmptyContent } from 'src/components/empty-content';

import { ProductDetailsView } from 'src/sections/product/view';
import { FetchingError } from 'src/sections/error/fetching-error';
import { ProductDetailsSkeleton } from 'src/sections/product/components/product-skeleton';

// ----------------------------------------------------------------------

export default function Page() {
  const { slug } = useParams();

  const { data: product, isLoading, isError, error } = useGetSingleProductQuery(slug || '');

  if (isLoading) {
    return (
      <DashboardContent sx={{ pt: 5 }}>
        <ProductDetailsSkeleton />
      </DashboardContent>
    );
  }

  if (isError || !product) {
    return (
      <FetchingError
        errorResponse={(error as IErrorResponse)?.data}
        statusCode={(error as IErrorResponse)?.status}
      />
    );
  }

  if (!product?.data) {
    return (
      <DashboardContent sx={{ pt: 5 }}>
        <EmptyContent
          filled
          title="Product not found!"
          action={
            <Button
              variant="outlined"
              component={RouterLink}
              href={paths.dashboard.product}
              startIcon={<Iconify width={16} icon="eva:arrow-ios-back-fill" />}
              sx={{ mt: 3 }}
            >
              Back to product list
            </Button>
          }
          sx={{ py: 10, height: 'auto', flexGrow: 'unset' }}
        />
      </DashboardContent>
    );
  }

  const metadata = { title: `${product.data.name} - ${CONFIG.appName}` };

  return (
    <>
      <Helmet>
        <title>{metadata.title}</title>
      </Helmet>

      <ProductDetailsView product={product.data} />
    </>
  );
}
