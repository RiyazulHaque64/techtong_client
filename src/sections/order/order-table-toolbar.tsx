import type { Dispatch, SetStateAction } from 'react';
import type { UsePopoverReturn } from 'src/components/custom-popover';
import type { TMeta } from 'src/redux/interfaces/common';
import type { IDatePickerControl, TFilterOption } from 'src/types/common';

import dayjs from 'dayjs';
import { Fragment, useCallback, useState } from 'react';

import { Button, MenuItem, MenuList, Typography } from '@mui/material';
import InputAdornment from '@mui/material/InputAdornment';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';

import { useBoolean } from 'src/hooks/use-boolean';

import { fDate, fDateTime, fIsAfter } from 'src/utils/format-time';

import { CustomDatePicker } from 'src/components/custom-date-picker/custom-date-picker';
import { CustomPopover, usePopover } from 'src/components/custom-popover';
import { Iconify } from 'src/components/iconify';

import { PAYMENT_STATUS_DEFAULT_OPTION } from './utils';

import type { TOrderFilter } from './view';

// ----------------------------------------------------------------------

type Props = {
    orderMeta: TMeta;
    setSearchText: Dispatch<SetStateAction<string>>;
    searchText: string;
    filter: TOrderFilter;
    setFilter: Dispatch<SetStateAction<TOrderFilter>>;
};

export function OrderTableToolbar({
    orderMeta,
    setSearchText,
    searchText,
    filter,
    setFilter
}: Props) {
    const { from_date, to_date } = filter;

    const [dateError, setDateError] = useState<string>('');

    const paymentPopover = usePopover();
    const fromDate = useBoolean();
    const toDate = useBoolean();

    const PAYMENT_STATUS_OPTIONS = [
        { ...PAYMENT_STATUS_DEFAULT_OPTION },
        { value: 'DUE', label: `Due (${0})` },
        { value: 'PAID', label: `Paid (${0})` }
    ];

    const FILTER_OPTIONS = [
        {
            name: 'payment_status',
            label: filter.payment_status.label,
            value: filter.payment_status,
            icon: 'solar:filter-bold-duotone',
            popover: paymentPopover,
            options: PAYMENT_STATUS_OPTIONS,
            setValue: setFilter,
        }
    ];

    const handleSearch = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            setSearchText(event.target.value);
        },
        [setSearchText]
    );

    const handleFromDate = useCallback(
        (newValue: IDatePickerControl) => {
            if (fIsAfter(newValue, new Date())) {
                setDateError('From date not be later than today');
            } else if (to_date && fIsAfter(newValue, to_date)) {
                setDateError('From date must be before than to date');
            } else {
                const formattedDate = fDateTime(newValue, 'YYYY-MM-DD') as string;
                setFilter({ ...filter, from_date: formattedDate });
                fromDate.onFalse();
                setDateError('');
            }
        },
        [to_date, filter, setFilter, fromDate]
    );

    const handleToDate = useCallback(
        (newValue: IDatePickerControl) => {
            if (from_date && fIsAfter(from_date, newValue)) {
                setDateError('To date must be later than start date');
            } else {
                const formattedDate = fDateTime(newValue, 'YYYY-MM-DD') as string;
                setFilter({ ...filter, to_date: formattedDate });
                toDate.onFalse();
                setDateError('');
            }
        },
        [from_date, filter, setFilter, toDate]
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

    const renderFromDate = (
        <>
            <Button
                color="inherit"
                variant="outlined"
                sx={{ textTransform: 'capitalize', width: { xs: '100%', sm: '154px' } }}
                onClick={() => {
                    setDateError('');
                    fromDate.onTrue();
                }}
            >
                <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    sx={{ width: 1 }}
                >
                    <Stack direction="row" alignItems="center" gap={1}>
                        <Iconify icon='solar:calendar-bold-duotone' />
                        <Typography variant="caption" sx={{ fontWeight: 'bold' }}>
                            {from_date ? fDate(from_date) : 'From date'}
                        </Typography>
                    </Stack>
                    <Iconify icon={fromDate.value ? 'eva:arrow-ios-upward-fill' : 'eva:arrow-ios-downward-fill'} />
                </Stack>
            </Button>

            <CustomDatePicker
                title="Select from date"
                date={dayjs(from_date) || null}
                onChangeDate={handleFromDate}
                open={fromDate.value}
                onClose={fromDate.onFalse}
                selected={!!from_date}
                error={dateError}
            />
        </>
    );

    const renderToDate = (
        <>
            <Button
                color="inherit"
                variant="outlined"
                sx={{ textTransform: 'capitalize', width: { xs: '100%', sm: '154px' } }}
                onClick={() => {
                    setDateError('');
                    toDate.onTrue();
                }}
            >
                <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    sx={{ width: 1 }}
                >
                    <Stack direction="row" alignItems="center" gap={1}>
                        <Iconify icon='solar:calendar-bold-duotone' />
                        <Typography variant="caption" sx={{ fontWeight: 'bold' }}>
                            {to_date ? fDate(to_date) : 'To date'}
                        </Typography>
                    </Stack>
                    <Iconify icon={toDate.value ? 'eva:arrow-ios-upward-fill' : 'eva:arrow-ios-downward-fill'} />
                </Stack>
            </Button>

            <CustomDatePicker
                title="Select to date"
                date={dayjs(to_date) || null}
                onChangeDate={handleToDate}
                open={toDate.value}
                onClose={toDate.onFalse}
                selected={!!to_date}
                error={dateError}
            />
        </>
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
                                <Iconify icon={popover.open ? 'eva:arrow-ios-upward-fill' : 'eva:arrow-ios-downward-fill'} />
                            </Stack>
                        </Button>
                        {renderPopover(name, popover, options, value, setValue)}
                    </Fragment>
                ))}

                {/* filter by date */}
                {renderFromDate}
                {renderToDate}
            </Stack>
            <TextField
                size='small'
                value={searchText}
                onChange={handleSearch}
                placeholder="Search order..."
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
