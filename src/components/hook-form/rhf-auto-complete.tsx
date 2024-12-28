import { Controller, useFormContext } from 'react-hook-form';

import TextField from '@mui/material/TextField';
import { Chip, Autocomplete } from '@mui/material';

// ----------------------------------------------------------------------
export type TOptionItem = { label: string; value: number | string };

type Props = {
  name: string;
  options: TOptionItem[];
  label?: string;
  placeholder?: string;
  multiple?: boolean;
  size?: 'small' | 'medium';
};

export function RHFAutoComplete({
  name,
  options,
  label,
  placeholder,
  multiple = false,
  size = 'medium',
}: Props) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <Autocomplete
          {...field}
          size={size}
          multiple={multiple}
          fullWidth
          options={options}
          getOptionLabel={(option) => option.label || ''}
          isOptionEqualToValue={(option, value) => option.label === value.label}
          value={multiple ? field.value || [] : field.value || null}
          onChange={(_, value) => field.onChange(value)}
          renderInput={(params) => (
            <TextField {...params} label={label} placeholder={placeholder} />
          )}
          renderOption={(props, option) => (
            <li {...props} key={option.label}>
              {option.label}
            </li>
          )}
          renderTags={(selected, getTagProps) =>
            selected.map((option, index) => (
              <Chip
                {...getTagProps({ index })}
                key={option.label}
                label={option.label}
                size="small"
                variant="soft"
              />
            ))
          }
        />
      )}
    />
  );
}
