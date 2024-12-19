import type { Dispatch, SetStateAction } from 'react';

import { startCase } from 'lodash';
import { useCallback } from 'react';

import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import { Select, MenuItem, InputLabel, FormControl } from '@mui/material';

import { useGetCategoriesQuery } from 'src/redux/features/category/categoryApi';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

type Props = {
  setSearchText: Dispatch<SetStateAction<string>>;
  searchText: string;
  parentCategory: string;
  setParentCategory: Dispatch<SetStateAction<string>>;
};

export function CategoryTableToolbar({
  setSearchText,
  searchText,
  parentCategory,
  setParentCategory,
}: Props) {
  const { data: categories } = useGetCategoriesQuery([{ name: 'limit', value: 500 }]);

  const handleSearch = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearchText(event.target.value);
    },
    [setSearchText]
  );

  return (
    <Stack
      spacing={2}
      alignItems={{ xs: 'flex-end', md: 'center' }}
      direction={{ xs: 'column', md: 'row' }}
      sx={{ p: 2.5, pr: { xs: 2.5, md: 1 } }}
    >
      <Stack direction="row" alignItems="center" spacing={2} flexGrow={1} sx={{ width: 1 }}>
        <FormControl sx={{ width: { xs: 1, md: 190 } }}>
          <InputLabel id="demo-simple-select-label">Parent Category</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={parentCategory}
            label="Parent Category"
            onChange={(e) => setParentCategory(e.target.value)}
          >
            <MenuItem value="ALL">All Categories</MenuItem>
            {categories?.data.map((category) => (
              <MenuItem key={category.id} value={category.title}>
                {startCase(category.title)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          fullWidth
          value={searchText}
          onChange={handleSearch}
          placeholder="Search category..."
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
