import type { Dispatch, SetStateAction } from 'react';

import { useCallback } from 'react';

import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

type Props = {
  setSearchText: Dispatch<SetStateAction<string>>;
  searchText: string;
};

export function BrandTableToolbar({ setSearchText, searchText }: Props) {
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
        <TextField
          fullWidth
          value={searchText}
          onChange={handleSearch}
          placeholder="Search brand..."
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
