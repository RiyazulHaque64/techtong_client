import type { GridCellParams } from '@mui/x-data-grid';
import type { TShortCategory } from 'src/types/category';

import { Fragment } from 'react';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import { LoadingButton } from '@mui/lab';
import Avatar from '@mui/material/Avatar';
import ListItemText from '@mui/material/ListItemText';
import LinearProgress from '@mui/material/LinearProgress';
import { Switch, Button, Divider, Typography, IconButton } from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';

import { stockStatus } from 'src/utils/helper';
import { fTime, fDate } from 'src/utils/format-time';

import { CONFIG } from 'src/config-global';
import { useUpdateProductMutation } from 'src/redux/features/product/product-api';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { usePopover, CustomPopover } from 'src/components/custom-popover';

import { QuickUpdateForm } from './quick-update-form';

// ----------------------------------------------------------------------

type ParamsProps = {
  params: GridCellParams;
};

export function RenderCellPrice({ params }: ParamsProps) {
  return (
    <Stack>
      <Stack direction="row">
        <Iconify icon="tabler:currency-taka" sx={{ width: 18, height: 18 }} />
        <Typography sx={{ fontSize: '1em' }}>{params.row.price} (P)</Typography>
      </Stack>
      {params.row.discount_price && (
        <Stack direction="row">
          <Iconify icon="tabler:currency-taka" sx={{ width: 18, height: 18 }} />
          <Typography sx={{ fontSize: '1em' }}>{params.row.discount_price} (D)</Typography>
        </Stack>
      )}
      {params.row.retailer_price && (
        <Stack direction="row">
          <Iconify icon="tabler:currency-taka" sx={{ width: 18, height: 18 }} />
          <Typography sx={{ fontSize: '1em' }}>{params.row.retailer_price} (R)</Typography>
        </Stack>
      )}
    </Stack>
  );
}

export function RenderCellPublish({ params }: ParamsProps) {
  const [updateProduct, { isLoading: updatePublishedLoading }] = useUpdateProductMutation();

  const popover = usePopover();

  const updatePublishedStatus = async () => {
    const res = await updateProduct({
      id: params.row.id,
      data: { published: !params.row.published },
    });
    if (res?.error) {
      toast.error('Update failed!');
    } else {
      toast.success('Update success!');
      popover.onClose();
    }
  };
  return (
    <>
      <Switch checked={params.row.published} onClick={popover.onOpen} color="success" />
      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        anchorEl={popover.anchorEl}
        slotProps={{ arrow: { placement: 'bottom-right' } }}
      >
        <Box sx={{ p: 2, maxWidth: 280 }}>
          <Typography variant="subtitle1">
            {params.row.published ? 'Unpublish' : 'Publish'}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: '4px' }}>
            Are you sure want to {params.row.published ? 'unnpublish' : 'publish'} this product?
          </Typography>
          <Stack direction="row" justifyContent="flex-end" gap={1} sx={{ mt: 2 }}>
            <Button
              variant="outlined"
              size="small"
              color="primary"
              onClick={popover.onClose}
              disabled={updatePublishedLoading}
            >
              Cancel
            </Button>
            <LoadingButton
              variant="contained"
              size="small"
              color="primary"
              onClick={updatePublishedStatus}
              disabled={updatePublishedLoading}
              loading={updatePublishedLoading}
            >
              Confirm
            </LoadingButton>
          </Stack>
        </Box>
      </CustomPopover>
    </>
  );
}

export function RenderCellFeatured({ params }: ParamsProps) {
  const [updateProduct, { isLoading: updateFeaturedLoading }] = useUpdateProductMutation();

  const popover = usePopover();

  const updateFeaturedStatus = async () => {
    const res = await updateProduct({
      id: params.row.id,
      data: { featured: !params.row.featured },
    });
    if (res?.error) {
      toast.error('Update failed!');
    } else {
      toast.success('Update success!');
      popover.onClose();
    }
  };
  return (
    <>
      <Switch checked={params.row.featured} onClick={popover.onOpen} />
      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        anchorEl={popover.anchorEl}
        slotProps={{ arrow: { placement: 'bottom-right' } }}
      >
        <Box sx={{ p: 2, maxWidth: 280 }}>
          <Typography variant="subtitle1">Featured</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: '4px' }}>
            Are you sure want to update featured status?
          </Typography>
          <Stack direction="row" justifyContent="flex-end" gap={1} sx={{ mt: 2 }}>
            <Button
              variant="outlined"
              size="small"
              color="primary"
              onClick={popover.onClose}
              disabled={updateFeaturedLoading}
            >
              Cancel
            </Button>
            <LoadingButton
              variant="contained"
              size="small"
              color="primary"
              onClick={updateFeaturedStatus}
              disabled={updateFeaturedLoading}
              loading={updateFeaturedLoading}
            >
              Confirm
            </LoadingButton>
          </Stack>
        </Box>
      </CustomPopover>
    </>
  );
}

export function RenderCellQuickUpdate({ params }: ParamsProps) {
  const quickEdit = useBoolean();
  return (
    <>
      <IconButton onClick={quickEdit.onTrue}>
        <Iconify icon="lucide:edit" />
      </IconButton>
      <QuickUpdateForm open={quickEdit.value} onClose={quickEdit.onFalse} product={params.row} />
    </>
  );
}

export function RenderCellUpdatedAt({ params }: ParamsProps) {
  return (
    <Stack spacing={0.5}>
      <Box component="span">{fDate(params.row.updated_at)}</Box>
      <Box component="span" sx={{ typography: 'caption', color: 'text.secondary' }}>
        {fTime(params.row.updated_at)}
      </Box>
    </Stack>
  );
}

export function RenderCellStock({ params }: ParamsProps) {
  return (
    <Stack justifyContent="center" sx={{ typography: 'caption', color: 'text.secondary' }}>
      <LinearProgress
        value={params.row.stock}
        variant="determinate"
        color={
          (params.row.stock === 0 && 'error') || (params.row.stock < 5 && 'warning') || 'success'
        }
        sx={{ mb: 1, width: 1, height: 6, maxWidth: 80 }}
      />
      {!!params.row.stock && params.row.stock} {stockStatus(params.row.stock)}
    </Stack>
  );
}

export function RenderCellProduct({
  params,
  onViewRow,
}: ParamsProps & {
  onViewRow: () => void;
}) {
  return (
    <Stack
      direction="row"
      alignItems="center"
      sx={{ py: 2, width: 1, cursor: 'pointer' }}
      onClick={onViewRow}
    >
      <Avatar
        src={`${CONFIG.bucket.url}/${CONFIG.bucket.name}/${params.row?.thumbnail}`}
        alt={params.row.name}
        variant="rounded"
        sx={{ width: 64, height: 64, mr: 2 }}
      />

      <ListItemText
        disableTypography
        primary={
          <Link
            noWrap
            color="inherit"
            variant="subtitle2"
            onClick={onViewRow}
            sx={{ cursor: 'pointer' }}
          >
            {params.row.name}
          </Link>
        }
        secondary={
          <Box component="div" sx={{ typography: 'body2', color: 'text.disabled' }}>
            {params.row.categories?.map((cat: TShortCategory, index: number) => (
              <Fragment key={cat.id}>
                <Typography component="span">{cat.title}</Typography>
                {index < params.row.categories.length - 1 && (
                  <Divider component="span" sx={{ mx: 1 }} />
                )}
              </Fragment>
            ))}
          </Box>
        }
        sx={{ display: 'flex', flexDirection: 'column' }}
      />
    </Stack>
  );
}
