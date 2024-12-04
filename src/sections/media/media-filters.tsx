import type { IImageFilters } from 'src/types/file';
import type { Dispatch, SetStateAction } from 'react';
import type { IDatePickerControl } from 'src/types/common';
import type { TQueryParam } from 'src/redux/interfaces/common';
import type { UseSetStateReturn } from 'src/hooks/use-set-state';

import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import CardActionArea from '@mui/material/CardActionArea';
import InputAdornment from '@mui/material/InputAdornment';

import { formatFileType } from 'src/utils/helper';
import { fDate, fIsAfter, fDateTime } from 'src/utils/format-time';

import { varAlpha } from 'src/theme/styles';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { FileThumbnail } from 'src/components/file-thumbnail';
import { usePopover, CustomPopover } from 'src/components/custom-popover';
import { CustomDatePicker } from 'src/components/custom-date-picker/custom-date-picker';

// ----------------------------------------------------------------------

type Props = {
  onResetPage: () => void;
  openFromDate: boolean;
  onOpenFromDate: () => void;
  onCloseFromDate: () => void;
  openToDate: boolean;
  onOpenToDate: () => void;
  onCloseToDate: () => void;
  filters: UseSetStateReturn<IImageFilters>;
  options: {
    types: string[];
  };
  setQueryparams: Dispatch<SetStateAction<TQueryParam[]>>;
};

export function MediaFilters({
  filters,
  options,
  onResetPage,
  setQueryparams,
  openFromDate,
  onOpenFromDate,
  onCloseFromDate,
  openToDate,
  onOpenToDate,
  onCloseToDate,
}: Props) {
  const popover = usePopover();

  const [fromDate, setFromDate] = useState<IDatePickerControl | null>(null);
  const [toDate, setToDate] = useState<IDatePickerControl | null>(null);
  const [dateError, setDateError] = useState<string>('');

  const renderLabel = filters.state.type.length
    ? filters.state.type.slice(0, 2).join(',')
    : 'All type';

  // Handler
  const handleFilterName = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onResetPage();
      filters.setState({ searchTerm: event.target.value });
    },
    [filters, onResetPage]
  );

  const handleFromDate = useCallback(
    (newValue: IDatePickerControl) => {
      if (fIsAfter(newValue, new Date())) {
        setDateError('From date not be later than today');
      } else if (toDate && fIsAfter(newValue, toDate)) {
        setDateError('From date must be before than to date');
      } else {
        setFromDate(newValue);
        onResetPage();
        const from_date = fDateTime(newValue, 'YYYY-MM-DD') as string;
        setQueryparams((prev) => {
          const othersQueries = prev.filter((query) => query.name !== 'fromDate');
          return [...othersQueries, { name: 'fromDate', value: from_date }];
        });
        onCloseFromDate();
        setDateError('');
      }
    },
    [onResetPage, setQueryparams, onCloseFromDate, toDate]
  );

  const handleToDate = useCallback(
    (newValue: IDatePickerControl) => {
      if (fromDate && fIsAfter(fromDate, newValue)) {
        setDateError('To date must be later than start date');
      } else {
        setToDate(newValue);
        onResetPage();
        const to_date = fDateTime(newValue, 'YYYY-MM-DD') as string;
        setQueryparams((prev) => {
          const othersQueries = prev.filter((query) => query.name !== 'toDate');
          return [...othersQueries, { name: 'toDate', value: to_date }];
        });
        onCloseToDate();
        setDateError('');
      }
    },
    [onResetPage, setQueryparams, onCloseToDate, fromDate]
  );

  const handleFilterType = useCallback(
    (newValue: string) => {
      const checked = filters.state.type.includes(newValue)
        ? filters.state.type.filter((value) => value !== newValue)
        : [...filters.state.type, newValue];

      filters.setState({ type: checked });
    },
    [filters]
  );

  const handleResetType = useCallback(() => {
    popover.onClose();
    filters.setState({ type: [] });
  }, [filters, popover]);

  // JSX
  const renderFilterName = (
    <TextField
      value={filters.state.searchTerm}
      onChange={handleFilterName}
      placeholder="Search..."
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
          </InputAdornment>
        ),
      }}
      sx={{ width: { xs: 1, md: 260 } }}
    />
  );

  const renderFromDate = (
    <>
      <Button
        color="inherit"
        onClick={() => {
          setDateError('');
          onOpenFromDate();
        }}
        endIcon={
          <Iconify
            icon={openFromDate ? 'eva:arrow-ios-upward-fill' : 'eva:arrow-ios-downward-fill'}
            sx={{ ml: -0.5 }}
          />
        }
      >
        {fromDate ? fDate(fromDate) : 'From date'}
      </Button>

      <CustomDatePicker
        title="Select from date"
        date={fromDate}
        onChangeDate={handleFromDate}
        open={openFromDate}
        onClose={onCloseFromDate}
        selected={!!fromDate}
        error={dateError}
      />
    </>
  );

  const renderToDate = (
    <>
      <Button
        color="inherit"
        onClick={() => {
          setDateError('');
          onOpenToDate();
        }}
        endIcon={
          <Iconify
            icon={openFromDate ? 'eva:arrow-ios-upward-fill' : 'eva:arrow-ios-downward-fill'}
            sx={{ ml: -0.5 }}
          />
        }
      >
        {toDate ? fDate(toDate) : 'To date'}
      </Button>

      <CustomDatePicker
        title="Select to date"
        date={toDate}
        onChangeDate={handleToDate}
        open={openToDate}
        onClose={onCloseToDate}
        selected={!!toDate}
        error={dateError}
      />
    </>
  );

  const renderFilterType = (
    <>
      <Button
        color="inherit"
        onClick={popover.onOpen}
        endIcon={
          <Iconify
            icon={popover.open ? 'eva:arrow-ios-upward-fill' : 'eva:arrow-ios-downward-fill'}
            sx={{ ml: -0.5 }}
          />
        }
      >
        {renderLabel}
        {filters.state.type.length > 2 && (
          <Label color="info" sx={{ ml: 1 }}>
            +{filters.state.type.length - 2}
          </Label>
        )}
      </Button>

      <CustomPopover
        open={popover.open}
        anchorEl={popover.anchorEl}
        onClose={popover.onClose}
        slotProps={{ paper: { sx: { p: 2.5 } } }}
      >
        <Stack spacing={2.5}>
          <Box
            gap={1}
            display="grid"
            gridTemplateColumns={{ xs: 'repeat(2, 1fr)', sm: 'repeat(4, 1fr)' }}
          >
            {options.types.map((type) => {
              const selected = filters.state.type.includes(type);

              return (
                <CardActionArea
                  key={type}
                  onClick={() => handleFilterType(type)}
                  sx={{
                    p: 1,
                    borderRadius: 1,
                    cursor: 'pointer',
                    border: (theme) =>
                      `solid 1px ${varAlpha(theme.vars.palette.grey['500Channel'], 0.08)}`,
                    ...(selected && { bgcolor: 'action.selected' }),
                  }}
                >
                  <Stack
                    spacing={1}
                    direction="row"
                    alignItems="center"
                    sx={{
                      typography: 'caption',
                      textTransform: 'capitalize',
                      ...(selected && { fontWeight: 'fontWeightSemiBold' }),
                    }}
                  >
                    <FileThumbnail file={type} sx={{ width: 24, height: 24 }} type="icon" />
                    {formatFileType(type)}
                  </Stack>
                </CardActionArea>
              );
            })}
          </Box>

          <Stack spacing={1.5} direction="row" alignItems="center" justifyContent="flex-end">
            <Button variant="outlined" color="inherit" onClick={handleResetType}>
              Clear
            </Button>

            <Button variant="contained" onClick={popover.onClose}>
              Apply
            </Button>
          </Stack>
        </Stack>
      </CustomPopover>
    </>
  );

  return (
    <Stack
      spacing={1}
      direction={{ xs: 'column', md: 'row' }}
      alignItems={{ xs: 'flex-end', md: 'center' }}
      sx={{ width: 1 }}
    >
      {renderFilterName}
      <Stack spacing={1} direction="row" alignItems="center" justifyContent="flex-end" flexGrow={1}>
        {renderFromDate}
        {renderToDate}
        {renderFilterType}
      </Stack>
    </Stack>
  );
}
