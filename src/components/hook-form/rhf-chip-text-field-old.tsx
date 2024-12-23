import type { FocusEvent, KeyboardEvent } from 'react';
import type { TextFieldProps } from '@mui/material/TextField';

import { Controller, useFormContext } from 'react-hook-form';

import TextField from '@mui/material/TextField';
import { Box, Chip, InputAdornment } from '@mui/material';

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
      if (new_value.trim() && !values.includes(new_value)) {
        setValue(name, [...values, new_value.trim()], { shouldValidate: true });
      }
      onChange('');
    } else if (e.key === 'Backspace' && new_value === '' && values.length > 0) {
      const updatedValues = [...values];
      updatedValues.pop();
      setValue(name, updatedValues);
    }
  };

  const handleBlur = (
    e: FocusEvent<HTMLInputElement>,
    new_value: string,
    onChange: (value: string) => void
  ) => {
    if (new_value.trim().length > 0) {
      setValue(name, [...values, new_value.trim()], { shouldValidate: true });
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
            type={type}
            value={type === 'number' && field.value === 0 ? '' : field.value}
            onKeyDown={(e: KeyboardEvent<HTMLInputElement>) =>
              handleKeyDown(e, field.value, field.onChange)
            }
            onBlur={(e: FocusEvent<HTMLInputElement>) => handleBlur(e, field.value, field.onChange)}
            error={!!error}
            helperText={error?.message ?? helperText}
            inputProps={{
              autoComplete: 'off',
              endAdornment: (
                <InputAdornment position="end">
                  <Iconify icon="solar:user-rounded-bold" width={24} />
                </InputAdornment>
              ),
            }}
            {...other}
          />
          {values.map((chip, index) => (
            <Chip
              key={index}
              label={chip}
              size="small"
              variant="soft"
              color="info"
              onDelete={() => handleDeleteChip(chip)}
            />
          ))}
        </Box>
      )}
    />
  );
}

// {/* <TextField
//   {...field}
//   fullWidth
//   variant="outlined"
//   value={field.value || ''}
//   onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => handleKeyDown(e, field.value, field.onChange)}
//   onBlur={(e: FocusEvent<HTMLInputElement>) => handleBlur(e, field.value, field.onChange)}
//   error={!!error}
//   InputProps={{
//     disableUnderline: true,
//     style: { margin: '0 4px', width: 'auto', flex: 1 },
//   }}
//   sx={{
//     '& .MuiInputBase-root': { padding: 0 },
//   }}
//   {...other}
// />; */}
