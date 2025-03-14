import type { IImage } from 'src/types/image';
import type { BoxProps } from '@mui/material/Box';
import type { TableProps } from 'src/components/table';

import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import Tooltip from '@mui/material/Tooltip';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';
import TableContainer from '@mui/material/TableContainer';
import { tableCellClasses } from '@mui/material/TableCell';

import { Iconify } from 'src/components/iconify';
import { TableNoData, TableHeadCustom, TableSelectedAction } from 'src/components/table';

import { MediaTableRow } from './media-table-row';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'path', label: 'Image', width: 90 },
  { id: 'name', label: 'Name' },
  { id: 'size', label: 'Size', width: 120 },
  { id: 'type', label: 'Format', width: 120 },
  { id: 'created_at', label: 'Uploaded on', width: 150 },
  { id: '', width: 88 },
];

// ----------------------------------------------------------------------

type Props = BoxProps & {
  notFound: boolean;
  dataFiltered: IImage[];
  onOpenConfirm: () => void;
  onDeleteRow: (path: string, close: () => void) => void;
  deleteLoading: boolean;
  table: TableProps;
};

export function MediaTable({
  sx,
  notFound,
  onDeleteRow,
  dataFiltered,
  onOpenConfirm,
  deleteLoading,
  table,
  ...other
}: Props) {
  const {
    order,
    orderBy,
    //
    selected,
    onSelectRow,
    onSelectAllRows,
    //
    onSort,
  } = table;

  return (
    <Box
      sx={{
        position: 'relative',
        m: (theme) => ({ md: theme.spacing(-2, -3, 0, -3) }),
        ...sx,
      }}
      {...other}
    >
      <TableSelectedAction
        numSelected={selected.length}
        rowCount={dataFiltered.length}
        onSelectAllRows={(checked) =>
          onSelectAllRows(
            checked,
            dataFiltered.map((row) => row.id)
          )
        }
        action={
          <Tooltip title="Delete">
            <IconButton color="primary" onClick={onOpenConfirm}>
              <Iconify icon="solar:trash-bin-trash-bold" />
            </IconButton>
          </Tooltip>
        }
        sx={{
          pl: 1,
          pr: 2,
          top: 16,
          left: 24,
          right: 24,
          width: 'auto',
          borderRadius: 1.5,
        }}
      />

      <TableContainer sx={{ px: { md: 3 } }}>
        <Table
          size="medium"
          sx={{ minWidth: 960, borderCollapse: 'separate', borderSpacing: '0 6px' }}
        >
          <TableHeadCustom
            order={order}
            orderBy={orderBy}
            headLabel={TABLE_HEAD}
            rowCount={dataFiltered.length}
            numSelected={selected.length}
            onSort={onSort}
            onSelectAllRows={(checked) =>
              onSelectAllRows(
                checked,
                dataFiltered.map((row) => row.path)
              )
            }
            sx={{
              [`& .${tableCellClasses.head}`]: {
                '&:first-of-type': { borderTopLeftRadius: 12, borderBottomLeftRadius: 12 },
                '&:last-of-type': { borderTopRightRadius: 12, borderBottomRightRadius: 12 },
              },
            }}
          />

          <TableBody>
            {dataFiltered.map((row) => (
              <MediaTableRow
                key={row.id}
                row={row}
                selected={selected.includes(row.path)}
                onSelectRow={() => onSelectRow(row.path)}
                onDeleteRow={onDeleteRow}
                deleteLoading={deleteLoading}
              />
            ))}
            <TableNoData
              notFound={notFound}
              title="No media found"
              sx={{
                m: -2,
                borderRadius: 1.5,
                border: (theme) => `dashed 1px ${theme.vars.palette.divider}`,
              }}
            />
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
