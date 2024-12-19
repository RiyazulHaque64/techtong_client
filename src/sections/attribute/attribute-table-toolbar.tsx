import type { ICategory } from 'src/types/category';
import type { Dispatch, SetStateAction } from 'react';
import type { SelectChangeEvent } from '@mui/material';

import { useCallback } from 'react';

import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import { Select, Checkbox, MenuItem, InputLabel, FormControl, OutlinedInput } from '@mui/material';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

type Props = {
  setSearchText: Dispatch<SetStateAction<string>>;
  searchText: string;
  selectedCategories: string[];
  setSelectedCategories: Dispatch<SetStateAction<string[]>>;
  categories: ICategory[];
};

export function AttributeTableToolbar({
  searchText,
  setSearchText,
  selectedCategories,
  setSelectedCategories,
  categories,
}: Props) {
  const handleSearch = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearchText(event.target.value);
    },
    [setSearchText]
  );

  const handleFilterService = useCallback(
    (event: SelectChangeEvent<string[]>) => {
      const newValue =
        typeof event.target.value === 'string' ? event.target.value.split(',') : event.target.value;

      setSelectedCategories(newValue);
    },
    [setSelectedCategories]
  );

  return (
    <Stack
      spacing={2}
      alignItems={{ xs: 'flex-end', md: 'center' }}
      direction={{ xs: 'column', md: 'row' }}
      sx={{ p: 2.5, pr: { xs: 2.5, md: 1 } }}
    >
      <Stack direction="row" alignItems="center" spacing={2} flexGrow={1} sx={{ width: 1 }}>
        <FormControl sx={{ flexShrink: 0, width: { xs: 1, md: 190 } }}>
          <InputLabel htmlFor="invoice-filter-service-select-label" sx={{ ml: '-4px' }}>
            Category
          </InputLabel>

          <Select
            multiple
            value={selectedCategories}
            onChange={handleFilterService}
            input={<OutlinedInput label="Service" />}
            renderValue={(selected) => selected.map((value: string) => value).join(', ')}
            inputProps={{ id: 'invoice-filter-service-select-label' }}
            sx={{ textTransform: 'capitalize' }}
          >
            {categories.map((category) => (
              <MenuItem key={category.id} value={category.title}>
                <Checkbox
                  disableRipple
                  size="small"
                  checked={selectedCategories.includes(category.title)}
                />
                {category.title}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          fullWidth
          value={searchText}
          onChange={handleSearch}
          placeholder="Search attribute..."
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
    </Stack>
  );
}
