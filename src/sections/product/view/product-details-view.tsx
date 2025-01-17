import type { IProduct } from 'src/types/product';

import { useCallback } from 'react';

import { Tab, Box, Card, Tabs, Stack } from '@mui/material';

import { paths } from 'src/routes/paths';

import { useTabs } from 'src/hooks/use-tabs';

import { varAlpha } from 'src/theme/styles';
import { DashboardContent } from 'src/layouts/dashboard';

import ProductVideo from '../components/product-video';
import ProductAttributes from '../components/product-attributes';
import ProductSpecification from '../components/product-specification';
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
  const { slug, thumbnail, images } = product;
  console.log('product: ', product);
  const tabs = useTabs('specification');

  const handleChangePublish = useCallback((newValue: boolean) => {
    console.log(newValue);
  }, []);

  return (
    <DashboardContent>
      <ProductDetailsToolbar
        product={product}
        editLink={paths.dashboard.edit_product(`${slug}`)}
        liveLink={paths.dashboard.details_product(`${slug}`)}
        onChangePublish={handleChangePublish}
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
            { value: 'specification', label: 'Specification' },
            { value: 'description', label: 'Description' },
            { value: 'additional_information', label: 'Additional Information' },
            { value: 'video', label: 'Video' },
            { value: 'attributes', label: 'Attributes' },
          ].map((tab) => (
            <Tab key={tab.value} value={tab.value} label={tab.label} />
          ))}
        </Tabs>

        {tabs.value === 'description' && (
          <ProductDetailsDescription description={product?.description ?? ''} />
        )}

        {tabs.value === 'specification' && (
          <ProductSpecification specifications={product?.specification ?? []} />
        )}

        {tabs.value === 'additional_information' && (
          <ProductAdditionalInformation
            additional_information={product?.additional_information ?? ''}
          />
        )}

        {tabs.value === 'video' && <ProductVideo video_url={product?.video_url} />}

        {tabs.value === 'attributes' && <ProductAttributes attributes={product?.attributes} />}
        {/* {tabs.value === 'reviews' && (
          <ProductDetailsReview
            ratings={product?.ratings ?? []}
            reviews={product?.reviews ?? []}
            totalRatings={product?.totalRatings ?? 0}
            totalReviews={product?.totalReviews ?? 0}
          />
        )} */}
      </Card>
    </DashboardContent>
  );
}

// { value: 'reviews', label: `Reviews (${product?.reviews.length})` }
