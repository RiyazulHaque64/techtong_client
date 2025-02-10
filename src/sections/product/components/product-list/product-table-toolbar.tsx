import type { Dispatch, SetStateAction } from 'react';
import type { TMeta } from 'src/redux/interfaces/common';
import type { UsePopoverReturn } from 'src/components/custom-popover';

import { Fragment, useCallback } from 'react';

import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import { Button, MenuItem, MenuList, Typography } from '@mui/material';

import { CONFIG } from 'src/config-global';
import { useGetBrandsQuery } from 'src/redux/features/brand/brandApi';
import { useGetCategoriesQuery } from 'src/redux/features/category/categoryApi';

import { Iconify } from 'src/components/iconify';
import { usePopover, CustomPopover } from 'src/components/custom-popover';

import {
  type TFilterOption,
  BRAND_FILTER_DEFAULT_OPTION,
  STOCK_STATUS_DEFAULT_OPTION,
  CATEGORY_FILTER_DEFAULT_OPTION,
} from '../../utils';

import type { TProductFilter } from '../../view/product-list-view';

// ----------------------------------------------------------------------

type Props = {
  productMeta: TMeta & {
    all: number;
    published: number;
    draft: number;
    featured: number;
    low_stock: number;
    in_stock: number;
  };
  setSearchText: Dispatch<SetStateAction<string>>;
  searchText: string;
  filter: TProductFilter;
  setFilter: Dispatch<SetStateAction<TProductFilter>>;
};

export function ProductTableToolbar({
  productMeta,
  setSearchText,
  searchText,
  filter,
  setFilter,
}: Props) {
  const { data: brands } = useGetBrandsQuery([{ name: 'limit', value: CONFIG.search_query.limit }]);
  const { data: categories } = useGetCategoriesQuery([
    { name: 'limit', value: CONFIG.search_query.limit },
  ]);

  const stockPopover = usePopover();
  const brandPopover = usePopover();
  const categoryPopover = usePopover();

  const STOCK_STATUS_OPTIONS = [
    { ...STOCK_STATUS_DEFAULT_OPTION },
    { value: 'in_stock', label: `In Stock (${productMeta.in_stock})` },
    { value: 'low_stock', label: `Low Stock (${productMeta.low_stock})` },
    {
      value: 'out_of_stock',
      label: `Out of Stock (${productMeta.all - (productMeta.in_stock + productMeta.low_stock)})`,
    },
  ];

  const BRAND_OPTIONS = [
    { ...BRAND_FILTER_DEFAULT_OPTION },
    ...(brands?.data?.map((brand) => ({
      label: `${brand.name} (${brand?._count?.products})`,
      value: brand.name,
    })) || []),
  ];

  const CATEGORY_OPTIONS = [
    { ...CATEGORY_FILTER_DEFAULT_OPTION },
    ...(categories?.data?.map((cat) => ({
      label: `${cat.title} (${cat?._count?.products})`,
      value: cat.title,
    })) || []),
  ];

  const FILTER_OPTIONS = [
    {
      name: 'stock_status',
      label: filter.stock_status.label,
      value: filter.stock_status,
      icon: 'mingcute:stock-line',
      popover: stockPopover,
      options: STOCK_STATUS_OPTIONS,
      setValue: setFilter,
    },
    {
      name: 'brand',
      label: filter.brand.label,
      value: filter.brand,
      icon: 'solar:filter-bold-duotone',
      popover: brandPopover,
      options: BRAND_OPTIONS,
      setValue: setFilter,
    },
    {
      name: 'category',
      label: filter.category.label,
      value: filter.category,
      icon: 'solar:filter-bold-duotone',
      popover: categoryPopover,
      options: CATEGORY_OPTIONS,
      setValue: setFilter,
    },
  ];

  const handleSearch = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearchText(event.target.value);
    },
    [setSearchText]
  );

  const renderPopover = (
    name: string,
    popover: UsePopoverReturn,
    options: TFilterOption[],
    selectedValue: TFilterOption,
    setValue: Dispatch<SetStateAction<TProductFilter>>
  ) => (
    <CustomPopover
      open={popover.open}
      anchorEl={popover.anchorEl}
      onClose={popover.onClose}
      slotProps={{ arrow: { placement: 'top-right' } }}
    >
      <MenuList sx={{ width: '166px' }}>
        {options.map((option) => (
          <MenuItem
            key={option.label}
            selected={option.value === selectedValue.value}
            onClick={() => {
              setValue({ ...filter, [name]: option });
              popover.onClose();
            }}
          >
            {option.label}
          </MenuItem>
        ))}
      </MenuList>
    </CustomPopover>
  );

  return (
    <Stack
      spacing={2}
      alignItems="center"
      justifyContent="space-between"
      direction={{ xs: 'column', md: 'row' }}
      sx={{ p: 2.5, pr: { xs: 2.5, md: 1 } }}
    >
      <Stack direction="row" alignItems="center" gap={1}>
        {FILTER_OPTIONS.map(({ name, label, value, setValue, icon, popover, options }) => (
          <Fragment key={name}>
            <Button
              color="inherit"
              variant="outlined"
              onClick={popover.onOpen}
              sx={{ textTransform: 'capitalize', width: { xs: '100%', sm: '170px' } }}
            >
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                sx={{ width: 1 }}
              >
                <Stack direction="row" alignItems="center" gap={1}>
                  <Iconify icon={icon} />
                  <Typography variant="caption" sx={{ fontWeight: 'bold' }}>
                    {label}
                  </Typography>
                </Stack>
                <Iconify icon="eva:arrow-ios-downward-fill" />
              </Stack>
            </Button>
            {renderPopover(name, popover, options, value, setValue)}
          </Fragment>
        ))}
      </Stack>
      <TextField
        size="small"
        value={searchText}
        onChange={handleSearch}
        placeholder="Search product..."
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
            </InputAdornment>
          ),
          ...(searchText && {
            endAdornment: (
              <InputAdornment position="end">
                <Iconify
                  icon="line-md:close"
                  sx={{ color: 'text.disabled', cursor: 'pointer' }}
                  onClick={() => setSearchText('')}
                />
              </InputAdornment>
            ),
          }),
        }}
      />
    </Stack>
  );
}
