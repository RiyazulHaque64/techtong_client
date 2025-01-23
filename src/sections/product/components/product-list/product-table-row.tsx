import type { IProduct, TProductCategory } from 'src/types/product';

import { Fragment, useCallback } from 'react';

import { LoadingButton } from '@mui/lab';
import Button from '@mui/material/Button';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import {
  Box,
  Link,
  Stack,
  Avatar,
  Switch,
  Divider,
  Typography,
  ListItemText,
  LinearProgress,
} from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';

import { stockStatus } from 'src/utils/helper';
import { fDate, fTime } from 'src/utils/format-time';

import { CONFIG } from 'src/config-global';
import { useUpdateProductMutation } from 'src/redux/features/product/product-api';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { usePopover, CustomPopover } from 'src/components/custom-popover';

// ----------------------------------------------------------------------

type Props = {
  row: IProduct;
  selected: boolean;
  onSelectRow: () => void;
  onDeleteRow: (id: string, close: () => void) => void;
  deleteLoading: boolean;
};

export function ProductTableRow({ row, selected, onSelectRow, onDeleteRow, deleteLoading }: Props) {
  const {
    id,
    slug,
    name,
    thumbnail,
    categories,
    stock,
    price,
    discount_price,
    retailer_price,
    published,
    updated_at,
  } = row;
  const confirm = useBoolean();

  const details = useBoolean();
  const manageForm = useBoolean();
  const router = useRouter();
  const popover = usePopover();

  const [updateProduct, { isLoading: updatePublishedLoading }] = useUpdateProductMutation();

  const handleViewRow = useCallback(
    (s: string) => {
      router.push(paths.dashboard.details_product(s));
    },
    [router]
  );

  const updatePublishedStatus = async (productId: string, publishedStatus: boolean) => {
    const res = await updateProduct({
      id: productId,
      data: { published: publishedStatus },
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
      <TableRow hover selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox
            checked={selected}
            onClick={onSelectRow}
            inputProps={{ id: `row-checkbox-${id}`, 'aria-label': `Row checkbox` }}
          />
        </TableCell>

        <TableCell align="center">
          <Stack
            direction="row"
            alignItems="center"
            sx={{ py: 2, width: 1, cursor: 'pointer' }}
            onClick={() => handleViewRow(slug)}
          >
            <Avatar
              src={`${CONFIG.bucket.url}/${CONFIG.bucket.name}/${thumbnail}`}
              alt={name}
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
                  onClick={() => handleViewRow(slug)}
                  sx={{ cursor: 'pointer' }}
                >
                  {name}
                </Link>
              }
              secondary={
                <Box component="div" sx={{ typography: 'body2', color: 'text.disabled' }}>
                  {categories?.map((cat: TProductCategory, index: number) => (
                    <Fragment key={cat.id}>
                      <Typography component="span">{cat.title}</Typography>
                      {index < categories.length - 1 && <Divider component="span" sx={{ mx: 1 }} />}
                    </Fragment>
                  ))}
                </Box>
              }
              sx={{ display: 'flex', flexDirection: 'column' }}
            />
          </Stack>
        </TableCell>
        <TableCell>
          <Stack justifyContent="center" sx={{ typography: 'caption', color: 'text.secondary' }}>
            <LinearProgress
              value={stock}
              variant="determinate"
              color={(stock === 0 && 'error') || (stock < 5 && 'warning') || 'success'}
              sx={{ mb: 1, width: 1, height: 6, maxWidth: 80 }}
            />
            {!!stock && stock} {stockStatus(stock)}
          </Stack>
        </TableCell>
        <TableCell align="center">
          <Stack>
            <Stack direction="row">
              <Iconify icon="tabler:currency-taka" sx={{ width: 18, height: 18 }} />
              <Typography sx={{ fontSize: '1em' }}>{price} (P)</Typography>
            </Stack>
            {discount_price && (
              <Stack direction="row">
                <Iconify icon="tabler:currency-taka" sx={{ width: 18, height: 18 }} />
                <Typography sx={{ fontSize: '1em' }}>{discount_price} (D)</Typography>
              </Stack>
            )}
            {retailer_price && (
              <Stack direction="row">
                <Iconify icon="tabler:currency-taka" sx={{ width: 18, height: 18 }} />
                <Typography sx={{ fontSize: '1em' }}>{retailer_price} (R)</Typography>
              </Stack>
            )}
          </Stack>
        </TableCell>
        <TableCell>
          <Stack spacing={0.5}>
            <Box component="span">{fDate(updated_at)}</Box>
            <Box component="span" sx={{ typography: 'caption', color: 'text.secondary' }}>
              {fTime(updated_at)}
            </Box>
          </Stack>
        </TableCell>
        <TableCell align="center">
          <>
            <Switch checked={published} onClick={popover.onOpen} color="success" />
            <CustomPopover
              open={popover.open}
              onClose={popover.onClose}
              anchorEl={popover.anchorEl}
              slotProps={{ arrow: { placement: 'bottom-right' } }}
            >
              <Box sx={{ p: 2, maxWidth: 280 }}>
                <Typography variant="subtitle1">{published ? 'Unpublish' : 'Publish'}</Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', mt: '4px' }}>
                  Are you sure want to {published ? 'unnpublish' : 'publish'} this product?
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
                    onClick={() => updatePublishedStatus(id, !published)}
                    disabled={updatePublishedLoading}
                    loading={updatePublishedLoading}
                  >
                    Confirm
                  </LoadingButton>
                </Stack>
              </Box>
            </CustomPopover>
          </>
        </TableCell>
        <TableCell align="right" sx={{ px: 1, whiteSpace: 'nowrap' }}>
          <IconButton onClick={details.onTrue}>
            <Iconify icon="solar:eye-bold" />
          </IconButton>
          <IconButton onClick={manageForm.onTrue}>
            <Iconify icon="solar:pen-bold" />
          </IconButton>
          <IconButton onClick={confirm.onTrue} sx={{ color: 'error.main' }}>
            <Iconify icon="solar:trash-bin-trash-bold" />
          </IconButton>
        </TableCell>
      </TableRow>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content="Are you sure want to delete?"
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => onDeleteRow(id, confirm.onFalse)}
            disabled={deleteLoading}
          >
            Delete
          </Button>
        }
      />
    </>
  );
}
