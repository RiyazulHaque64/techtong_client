import type { FocusEvent, KeyboardEvent } from 'react';
import type { TextFieldProps } from '@mui/material/TextField';

import { Controller, useFormContext } from 'react-hook-form';

import TextField from '@mui/material/TextField';
import { Box, Stack, IconButton, Typography, InputAdornment } from '@mui/material';

import { Iconify } from '../iconify';

// ----------------------------------------------------------------------

type Props = TextFieldProps & {
  name: string;
};

export function RHFListTextField({ name, helperText, type, ...other }: Props) {
  const { control, watch, setValue } = useFormContext();

  const values: string[] = watch(name);

  const handleKeyDown = (
    e: KeyboardEvent<HTMLInputElement>,
    new_value: string,
    onChange: (value: string) => void
  ) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      if (new_value.trim() && !values.includes(new_value.toLowerCase())) {
        setValue(name, [...values, new_value.trim().toLowerCase()], { shouldValidate: true });
      }
      onChange('');
    }
  };

  const handleClick = (new_value: string, onChange: (value: string) => void) => {
    if (new_value.trim() && !values.includes(new_value.toLowerCase())) {
      setValue(name, [...values, new_value.trim().toLowerCase()], { shouldValidate: true });
    }
    onChange('');
  };

  const handleBlur = (
    e: FocusEvent<HTMLInputElement>,
    new_value: string,
    onChange: (value: string) => void
  ) => {
    if (new_value.trim().length > 0) {
      setValue(name, [...values, new_value.trim().toLowerCase()], { shouldValidate: true });
      onChange('');
    }
  };

  const handleDeleteItem = (itemToDelete: string) => {
    const remainingItem = values.filter((value) => value !== itemToDelete);
    setValue(name, remainingItem);
  };

  return (
    <Controller
      name="item_value"
      control={control}
      render={({ field, fieldState: { error } }) => (
        <Box>
          <TextField
            {...field}
            fullWidth
            type="text"
            value={field.value || ''}
            onKeyDown={(e: KeyboardEvent<HTMLInputElement>) =>
              handleKeyDown(e, field.value, field.onChange)
            }
            onBlur={(e: FocusEvent<HTMLInputElement>) => handleBlur(e, field.value, field.onChange)}
            error={!!error}
            helperText={error?.message ?? helperText}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => handleClick(field.value, field.onChange)} edge="end">
                    <Iconify icon="ic:round-plus" width={24} />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            {...other}
          />
          <Stack direction="column" spacing={1} sx={{ flexWrap: 'wrap', mt: 2, ml: 1 }}>
            {values.map((item, index) => (
              <Stack
                direction="row"
                alignItems="center"
                gap={1}
                key={index}
                sx={{ color: 'text.secondary' }}
              >
                <Iconify icon="eva:checkmark-circle-2-outline" />
                <Typography>{item}</Typography>
                <Iconify
                  icon="eva:close-fill"
                  onClick={() => handleDeleteItem(item)}
                  sx={{ cursor: 'pointer' }}
                />
              </Stack>
            ))}
          </Stack>
        </Box>
      )}
    />
  );
}
