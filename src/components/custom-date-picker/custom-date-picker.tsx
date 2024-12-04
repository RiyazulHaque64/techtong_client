import type { DialogProps } from '@mui/material/Dialog';

import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import FormHelperText from '@mui/material/FormHelperText';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';

import { useResponsive } from 'src/hooks/use-responsive';

import type { UseDatePickerReturn } from './types';

// ----------------------------------------------------------------------

export function CustomDatePicker({
  open,
  error,
  date,
  onClose,
  PaperProps,
  onChangeDate,
  title = 'Select date',
  ...other
}: DialogProps & UseDatePickerReturn) {
  const mdUp = useResponsive('up', 'md');

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        ...PaperProps,
        sx: {
          ...PaperProps?.sx,
          p: 4,
        },
      }}
      {...other}
    >
      <DialogTitle sx={{ p: 0 }}>{title}</DialogTitle>

      <DialogContent sx={{ ...(mdUp && { overflow: 'unset' }), p: 0 }}>
        <Stack justifyContent="center" sx={{ pt: 1 }}>
          <Paper
            variant="outlined"
            sx={{ borderRadius: 2, borderColor: 'divider', borderStyle: 'dashed' }}
          >
            <DateCalendar value={date} onChange={onChangeDate} />
          </Paper>
        </Stack>

        {error && error.length > 0 && (
          <FormHelperText error sx={{ px: 2 }}>
            {error}
          </FormHelperText>
        )}
      </DialogContent>
    </Dialog>
  );
}
