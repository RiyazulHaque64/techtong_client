import type { KeyboardEvent } from 'react';
import type { TextFieldProps } from '@mui/material/TextField';

import { Controller, useFormContext } from 'react-hook-form';

import { grey } from '@mui/material/colors';
import TextField from '@mui/material/TextField';
import { Box, Chip, Typography } from '@mui/material';

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

  const handleDeleteChip = (chipToDelete: string) => {
    console.log('chip to delete: ', chipToDelete);
    const remainingChip = values.filter((value) => value !== chipToDelete);
    setValue(name, remainingChip);
  };

  return (
    <Controller
      name="chip_value"
      control={control}
      render={({ field, fieldState: { error } }) => (
        <Box>
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 0.5,
              alignItems: 'center',
              padding: '6px 10px',
              border: `1px solid ${grey[300]}`,
              borderRadius: '8px',
            }}
          >
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
            <TextField
              {...field}
              variant="standard"
              value={field.value || ''}
              onKeyDown={(e: KeyboardEvent<HTMLInputElement>) =>
                handleKeyDown(e, field.value, field.onChange)
              }
              error={!!error}
              InputProps={{
                disableUnderline: true,
                style: { margin: '0 4px', width: 'auto', flex: 1 },
              }}
              sx={{
                '& .MuiInputBase-root': { padding: 0 },
              }}
              {...other}
            />
          </Box>
          <Typography sx={{ color: grey[700], fontSize: '0.8em', ml: 1, mt: '4px' }}>
            {error?.message ?? helperText}
          </Typography>
        </Box>
      )}
    />
  );
}

// inputProps={{
//             startAdornment: (
//               <StyledInputAdornment position="start">
//                 {values?.map((value: string | number, index: number) => (
//                   <Chip key={index} label={value} />
//                 ))}
//               </StyledInputAdornment>
//             ),
//             autoComplete: 'off',
//           }}

// {/* <TextField
//   {...field}
//   fullWidth
//   type={type}
//   value={field.value || ''}
//   onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => handleKeyDown(e, field.value, field.onChange)}
//   error={!!error}
//   helperText={error?.message ?? helperText}
//   InputProps={{
//     startAdornment: (
//       <InputAdornment position="start">
//         {values?.map((value: string | number, index: number) => (
//           <Chip key={index} label={value} size="small" color="info" variant="soft" />
//         ))}
//       </InputAdornment>
//     ),
//   }}
//   multiline
//   {...other}
// />; */}
