import type { Dispatch, SetStateAction } from 'react';
import type { IDatePickerControl } from 'src/types/common';
import type { TQueryParam } from 'src/redux/interfaces/common';

import dayjs from 'dayjs';
import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import CardActionArea from '@mui/material/CardActionArea';
import InputAdornment from '@mui/material/InputAdornment';

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
  options: {
    types: string[];
  };
  queryParams: TQueryParam[];
  setQueryparams: Dispatch<SetStateAction<TQueryParam[]>>;
  searchText: string;
  setSearchText: Dispatch<SetStateAction<string>>;
  types: string[];
  setTypes: Dispatch<SetStateAction<string[]>>;
};

export function ImageFiltersToolbar({
  options,
  onResetPage,
  queryParams,
  setQueryparams,
  openFromDate,
  onOpenFromDate,
  onCloseFromDate,
  openToDate,
  onOpenToDate,
  onCloseToDate,
  searchText,
  setSearchText,
  types,
  setTypes,
}: Props) {
  const popover = usePopover();

  const [dateError, setDateError] = useState<string>('');

  const renderLabel = types.length ? types.slice(0, 2).join(',') : 'All type';
  const from_date = queryParams.find((param) => param.name === 'fromDate')?.value;
  const to_date = queryParams.find((param) => param.name === 'toDate')?.value;

  // Handler
  const handleSearch = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onResetPage();
      setSearchText(event.target.value);
    },
    [setSearchText, onResetPage]
  );

  const handleFromDate = useCallback(
    (newValue: IDatePickerControl) => {
      if (fIsAfter(newValue, new Date())) {
        setDateError('From date not be later than today');
      } else if (to_date && fIsAfter(newValue, to_date)) {
        setDateError('From date must be before than to date');
      } else {
        onResetPage();
        const fromDate = fDateTime(newValue, 'YYYY-MM-DD') as string;
        setQueryparams((prev) => {
          const othersQueries = prev.filter((query) => query.name !== 'fromDate');
          return [...othersQueries, { name: 'fromDate', value: fromDate }];
        });
        onCloseFromDate();
        setDateError('');
      }
    },
    [onResetPage, setQueryparams, onCloseFromDate, to_date]
  );

  const handleToDate = useCallback(
    (newValue: IDatePickerControl) => {
      if (from_date && fIsAfter(from_date, newValue)) {
        setDateError('To date must be later than start date');
      } else {
        onResetPage();
        const toDate = fDateTime(newValue, 'YYYY-MM-DD') as string;
        setQueryparams((prev) => {
          const othersQueries = prev.filter((query) => query.name !== 'toDate');
          return [...othersQueries, { name: 'toDate', value: toDate }];
        });
        onCloseToDate();
        setDateError('');
      }
    },
    [onResetPage, setQueryparams, onCloseToDate, from_date]
  );

  const handleFilterType = useCallback(
    (newValue: string) => {
      setTypes((prev) => {
        const newTypes = prev.includes(newValue)
          ? prev.filter((value) => value !== newValue)
          : [...prev, newValue];
        return newTypes;
      });
    },
    [setTypes]
  );

  const handleResetType = useCallback(() => {
    popover.onClose();
    setTypes([]);
  }, [setTypes, popover]);

  // JSX
  const renderSearchBox = (
    <TextField
      size="small"
      value={searchText}
      onChange={handleSearch}
      placeholder="Search image..."
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
          </InputAdornment>
        ),
      }}
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
        {from_date ? fDate(from_date) : 'From date'}
      </Button>

      <CustomDatePicker
        title="Select from date"
        date={dayjs(from_date) || null}
        onChangeDate={handleFromDate}
        open={openFromDate}
        onClose={onCloseFromDate}
        selected={!!from_date}
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
        {to_date ? fDate(to_date) : 'To date'}
      </Button>

      <CustomDatePicker
        title="Select to date"
        date={dayjs(to_date) || null}
        onChangeDate={handleToDate}
        open={openToDate}
        onClose={onCloseToDate}
        selected={!!to_date}
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
        {types.length > 2 && (
          <Label color="info" sx={{ ml: 1 }}>
            +{types.length - 2}
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
              const selected = types.includes(type);

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
                    {type}
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
      spacing={{ xs: 1, md: 4 }}
      direction={{ xs: 'column', sm: 'row' }}
      alignItems="center"
      justifyContent={{ sm: 'space-between', md: 'flex-end' }}
    >
      <Stack spacing={1} direction="row" alignItems="center">
        {renderFromDate}
        {renderToDate}
        {renderFilterType}
      </Stack>
      {renderSearchBox}
    </Stack>
  );
}
