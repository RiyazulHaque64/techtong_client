import type { Theme, SxProps } from '@mui/material/styles';
import type { TablePaginationProps } from '@mui/material/TablePagination';

import Box from '@mui/material/Box';
import TablePagination from '@mui/material/TablePagination';

// ----------------------------------------------------------------------

export type TablePaginationCustomProps = TablePaginationProps & {
  dense?: boolean;
  sx?: SxProps<Theme>;
  onChangeDense?: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export function TablePaginationCustom({
  sx,
  rowsPerPageOptions = [5, 10, 15, 20, 25],
  ...other
}: TablePaginationCustomProps) {
  return (
    <Box sx={{ position: 'relative', ...sx }}>
      <TablePagination
        rowsPerPageOptions={rowsPerPageOptions}
        component="div"
        {...other}
        sx={{ borderTopColor: 'transparent' }}
      />
    </Box>
  );
}
