import type { IProduct } from 'src/types/product';
import type { StackProps } from '@mui/material/Stack';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { Iconify } from 'src/components/iconify';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { usePopover, CustomPopover } from 'src/components/custom-popover';

// ----------------------------------------------------------------------

type Props = StackProps & {
  backLink?: string;
  editLink: string;
  liveLink: string;
  product: IProduct;
  onChangePublish: (newValue: boolean) => void;
};

export function ProductDetailsToolbar({
  backLink,
  editLink,
  liveLink,
  product,
  onChangePublish,
  sx,
  ...other
}: Props) {
  const popover = usePopover();

  const publishOptions = [
    { value: true, label: 'Published' },
    { value: false, label: 'Draft' },
  ];

  return (
    <>
      <Stack spacing={1.5} direction="row" sx={{ mb: 4, ...sx }} {...other}>
        <CustomBreadcrumbs
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'Products', href: paths.dashboard.product },
            { name: product.name },
          ]}
        />
        {backLink && (
          <Button
            component={RouterLink}
            href={backLink}
            startIcon={<Iconify icon="eva:arrow-ios-back-fill" width={16} />}
          >
            Back
          </Button>
        )}

        <Box sx={{ flexGrow: 1 }} />

        {product.published && (
          <Tooltip title="Go Live">
            <IconButton component={RouterLink} href={liveLink}>
              <Iconify icon="eva:external-link-fill" />
            </IconButton>
          </Tooltip>
        )}

        <Tooltip title="Edit">
          <IconButton component={RouterLink} href={editLink}>
            <Iconify icon="solar:pen-bold" />
          </IconButton>
        </Tooltip>

        <LoadingButton
          color="inherit"
          variant="contained"
          loading={!product.published}
          loadingIndicator="Loading…"
          endIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}
          onClick={popover.onOpen}
          sx={{ textTransform: 'capitalize' }}
        >
          {product.published ? 'Published' : 'Draft'}
        </LoadingButton>
      </Stack>

      <CustomPopover
        open={popover.open}
        anchorEl={popover.anchorEl}
        onClose={popover.onClose}
        slotProps={{ arrow: { placement: 'top-right' } }}
      >
        <MenuList>
          {publishOptions.map((option) => (
            <MenuItem
              key={option.label}
              selected={option.value === product.published}
              onClick={() => {
                popover.onClose();
                onChangePublish(option.value);
              }}
            >
              {option.value ? (
                <Iconify icon="eva:cloud-upload-fill" />
              ) : (
                <Iconify icon="solar:file-text-bold" />
              )}
              {option.label}
            </MenuItem>
          ))}
        </MenuList>
      </CustomPopover>
    </>
  );
}
