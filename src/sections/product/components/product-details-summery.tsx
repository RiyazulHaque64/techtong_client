import type { IProduct } from 'src/types/product';
import type { ICheckoutItem } from 'src/types/checkout';

import { startCase } from 'lodash';

import { Box } from '@mui/material';
import Stack from '@mui/material/Stack';
import Rating from '@mui/material/Rating';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';

import { intervalDays } from 'src/utils/format-time';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

type Props = {
  product: IProduct;
  items?: ICheckoutItem[];
  disableActions?: boolean;
  onGotoStep?: (step: number) => void;
  onAddCart?: (cartItem: ICheckoutItem) => void;
};

export function ProductDetailsSummary({
  items,
  product,
  onAddCart,
  onGotoStep,
  disableActions,
  ...other
}: Props) {
  const {
    name,
    price,
    discount_price,
    retailer_price,
    created_at,
    stock,
    key_features,
    tags,
    code,
    model,
    categories,
    brand,
  } = product;

  const renderLabel = (
    <Stack direction="row" alignItems="center" justifyContent="space-between" gap={1}>
      <Stack direction="row" gap={1} alignItems="center" sx={{ mb: 1 }}>
        {intervalDays(new Date().toDateString(), created_at) < 30 && (
          <Label color="info" sx={{ textTransform: 'uppercase' }}>
            New
          </Label>
        )}
        <Label
          variant="soft"
          color={stock === 0 ? 'error' : stock < 5 ? 'warning' : 'success'}
          sx={{ textTransform: 'uppercase' }}
        >
          {stock === 0 ? 'Out of stock' : stock < 5 ? 'Low stock' : 'In stock'}
        </Label>
      </Stack>
      <Label variant="outlined" sx={{ textTransform: 'uppercase' }}>
        {code}
      </Label>
    </Stack>
  );

  const renderPrice = (
    <Stack direction="row" alignItems="center" spacing={1}>
      <Label variant="outlined">
        Regular Price: {price}
        <Iconify icon="tabler:currency-taka" sx={{ width: 18, height: 18, ml: -0.5 }} />
      </Label>
      <Label variant="outlined">
        Discount Price: {discount_price}
        <Iconify icon="tabler:currency-taka" sx={{ width: 18, height: 18, ml: -0.5 }} />
      </Label>
      <Label variant="outlined">
        Retailer Price: {retailer_price}
        <Iconify icon="tabler:currency-taka" sx={{ width: 18, height: 18, ml: -0.5 }} />
      </Label>
    </Stack>
  );

  const renderTagAndFeatures = (
    <Stack direction="column" gap={2}>
      <Box>
        <Typography variant="h6">Key Features</Typography>
        {key_features.map((feature) => (
          <Typography key={feature} variant="body2" sx={{ color: 'text.secondary' }}>
            {feature}
          </Typography>
        ))}
      </Box>
      <Stack direction="row" gap={1} alignItems="center">
        <Typography variant="caption" sx={{ fontSize: '0.9rem' }}>
          Tags:{' '}
        </Typography>
        <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.9rem' }}>
          {tags.map((tag) => startCase(tag)).join(', ')}
        </Typography>
      </Stack>
    </Stack>
  );

  return (
    <Box sx={{ pt: 3 }} {...other}>
      {renderLabel}
      <Typography variant="h5">{name}</Typography>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          color: 'text.secondary',
        }}
      >
        <Typography sx={{ fontSize: '0.9rem' }}>
          {categories?.map((c) => c.title).join(', ')}
        </Typography>
        <Divider orientation="vertical" variant="middle" flexItem sx={{ height: '0.9rem' }} />
        <Typography sx={{ fontSize: '0.9rem' }}>{brand.name}</Typography>
        <Divider orientation="vertical" variant="middle" flexItem sx={{ height: '0.9rem' }} />
        <Typography sx={{ fontSize: '0.9rem', textTransform: 'uppercase' }}>{model}</Typography>
      </Box>

      {renderPrice}
      <Divider sx={{ borderStyle: 'dashed', my: 2 }} />
      {renderTagAndFeatures}
      <Divider sx={{ borderStyle: 'dashed', my: 2 }} />
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ color: 'text.disabled', typography: 'body2' }}
      >
        <Typography variant="caption" component="div" sx={{ fontSize: '1rem' }}>
          Available: {stock}
        </Typography>
        <Stack direction="row" alignItems="center">
          <Rating size="small" value={5} precision={0.1} readOnly sx={{ mr: 1 }} />
          <Typography variant="caption" sx={{ fontSize: '0.9rem' }}>
            5 reviews
          </Typography>
        </Stack>
      </Stack>
    </Box>
  );
}
