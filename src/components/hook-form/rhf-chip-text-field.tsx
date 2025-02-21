import type { FocusEvent, KeyboardEvent } from 'react';
import type { TextFieldProps } from '@mui/material/TextField';

import { Controller, useFormContext } from 'react-hook-form';

import TextField from '@mui/material/TextField';
import { Box, Chip, Stack, IconButton, InputAdornment } from '@mui/material';

import { Iconify } from '../iconify';

// ----------------------------------------------------------------------

type Props = TextFieldProps & {
  name: string;
};

export function RHFChipTextField({ name, helperText, type, ...other }: Props) {
  const { control, watch, setValue } = useFormContext();

  const values: string[] = watch(name);

  const handleKeyDown = (
    e: KeyboardEvent<HTMLInputElement>,
    new_value: string,
    onChange: (value: string) => void
  ) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      if (new_value?.length && new_value.trim() && !values.includes(new_value.toLowerCase())) {
        setValue(name, [...values, new_value.trim().toLowerCase()], { shouldValidate: true });
      }
      onChange('');
    }
  };

  const handleClick = (new_value: string, onChange: (value: string) => void) => {
    if (new_value?.length && new_value.trim() && !values.includes(new_value.toLowerCase())) {
      setValue(name, [...values, new_value.trim().toLowerCase()], { shouldValidate: true });
    }
    onChange('');
  };

  const handleBlur = (
    e: FocusEvent<HTMLInputElement>,
    new_value: string,
    onChange: (value: string) => void
  ) => {
    if (new_value?.length && new_value.trim().length > 0) {
      setValue(name, [...values, new_value.trim().toLowerCase()], { shouldValidate: true });
      onChange('');
    }
  };

  const handleDeleteChip = (chipToDelete: string) => {
    const remainingChip = values.filter((value) => value !== chipToDelete);
    setValue(name, remainingChip);
  };

  return (
    <Controller
      name="chip_value"
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
          <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', mt: 1 }}>
            {values.map((chip, index) => (
              <Chip
                key={index}
                label={chip}
                size="small"
                variant="soft"
                color="info"
                onDelete={() => handleDeleteChip(chip)}
                sx={{ textTransform: 'capitalize' }}
              />
            ))}
          </Stack>
        </Box>
      )}
    />
  );
}
