import type { Dispatch, SetStateAction } from 'react';
import type { UsePopoverReturn } from 'src/components/custom-popover';
import type { TMeta } from 'src/redux/interfaces/common';
import type { TFilterOption } from 'src/types/common';

import { Fragment, useCallback } from 'react';

import { Button, MenuItem, MenuList, Typography } from '@mui/material';
import InputAdornment from '@mui/material/InputAdornment';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';

import { CustomPopover, usePopover } from 'src/components/custom-popover';
import { Iconify } from 'src/components/iconify';

import { STOCK_STATUS_DEFAULT_OPTION } from './utils';

import type { TOrderFilter } from './view';

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
    filter: TOrderFilter;
    setFilter: Dispatch<SetStateAction<TOrderFilter>>;
};

export function OrderTableToolbar({
    productMeta,
    setSearchText,
    searchText,
    filter,
    setFilter,
}: Props) {

    const stockPopover = usePopover();

    const STOCK_STATUS_OPTIONS = [
        { ...STOCK_STATUS_DEFAULT_OPTION },
        { value: 'in_stock', label: `In Stock (${productMeta.in_stock})` },
        { value: 'low_stock', label: `Low Stock (${productMeta.low_stock})` },
        {
            value: 'out_of_stock',
            label: `Out of Stock (${productMeta.all - (productMeta.in_stock + productMeta.low_stock)})`,
        },
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
        }
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
        setValue: Dispatch<SetStateAction<TOrderFilter>>
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
