import type { IProduct } from 'src/types/product';

import { useCallback } from 'react';

import { Tab, Box, Card, Tabs, Stack } from '@mui/material';

import { paths } from 'src/routes/paths';

import { useTabs } from 'src/hooks/use-tabs';

import { varAlpha } from 'src/theme/styles';
import { DashboardContent } from 'src/layouts/dashboard';
import { useUpdateProductMutation } from 'src/redux/features/product/product-api';

import { toast } from 'src/components/snackbar';

import { PRODUCT_DETAILS_TABS } from '../utils';
import ProductVideo from '../components/product-video';
import ProductAttributes from '../components/product-attributes';
import ProductSpecification from '../components/product-specification';
import { ProductDetailsReview } from '../components/product-details-review';
import { ProductDetailsToolbar } from '../components/product-details-toolbar';
import { ProductDetailsSummary } from '../components/product-details-summery';
import { ProductDetailsCarousel } from '../components/product-details-carousel';
import { ProductDetailsDescription } from '../components/product-details-description';
import { ProductAdditionalInformation } from '../components/product-additional-information';

// ----------------------------------------------------------------------

type Props = {
  product: IProduct;
};

export function ProductDetailsView({ product }: Props) {
  const {
    slug,
    thumbnail,
    images,
    description,
    specification,
    additional_information,
    video_url,
    attributes,
    reviews,
  } = product;

  const [updateProduct, { isLoading: updateLoading }] = useUpdateProductMutation();

  const tabs = useTabs('specification');

  const handleChangePublish = useCallback(
    async (newValue: boolean) => {
      try {
        const res = await updateProduct({ id: product.id, data: { published: newValue } });
        if (res?.error) {
          toast.error('Failed to update!');
        } else {
          toast.success('Update success!');
        }
      } catch (err) {
        toast.error('Failed to update!');
      }
    },
    [product.id, updateProduct]
  );

  return (
    <DashboardContent>
      <ProductDetailsToolbar
        product={product}
        editLink={paths.dashboard.edit_product(`${slug}`)}
        liveLink={paths.dashboard.details_product(`${slug}`)}
        onChangePublish={handleChangePublish}
        updateLoading={updateLoading}
      />
      <Stack direction={{ xs: 'column', md: 'row' }} gap={6}>
        <Box width={{ xs: '100%', md: '40%' }}>
          <ProductDetailsCarousel images={thumbnail ? [thumbnail, ...images] : [...images]} />
        </Box>
        <Box width={{ xs: '100%', md: '60%' }}>
          <ProductDetailsSummary disableActions product={product} />
        </Box>
      </Stack>

      <Card sx={{ mt: 8 }}>
        <Tabs
          value={tabs.value}
          onChange={tabs.onChange}
          sx={{
            px: 3,
            boxShadow: (theme) =>
              `inset 0 -2px 0 0 ${varAlpha(theme.vars.palette.grey['500Channel'], 0.08)}`,
          }}
        >
          {[
            ...PRODUCT_DETAILS_TABS,
            { value: 'reviews', label: `Reviews (${product?.reviews.length})` },
          ].map((tab) => (
            <Tab key={tab.value} value={tab.value} label={tab.label} />
          ))}
        </Tabs>

        {tabs.value === 'description' && (
          <ProductDetailsDescription description={description ?? ''} />
        )}

        {tabs.value === 'specification' && (
          <ProductSpecification specifications={specification ?? []} />
        )}

        {tabs.value === 'additional_information' && (
          <ProductAdditionalInformation additional_information={additional_information ?? ''} />
        )}

        {tabs.value === 'video' && <ProductVideo video_url={video_url} />}

        {tabs.value === 'attributes' && <ProductAttributes attributes={attributes} />}
        {tabs.value === 'reviews' && (
          <ProductDetailsReview avg_rating={product?.avg_rating} reviews={reviews ?? []} />
        )}
      </Card>
    </DashboardContent>
  );
}
