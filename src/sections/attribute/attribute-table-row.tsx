import type { IAttribute } from 'src/types/attribute';

import { startCase } from 'lodash';

import { Chip } from '@mui/material';
import Button from '@mui/material/Button';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';

import { useBoolean } from 'src/hooks/use-boolean';

import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';

import { AttributeManageForm } from './attribute-manage-form';

// ----------------------------------------------------------------------

type Props = {
  row: IAttribute;
  selected: boolean;
  onSelectRow: () => void;
  onDeleteRow: (id: string, close: () => void) => void;
  deleteLoading: boolean;
};

export function AttributeTableRow({
  row,
  selected,
  onSelectRow,
  onDeleteRow,
  deleteLoading,
}: Props) {
  const { id, name } = row;
  const confirm = useBoolean();

  const manageForm = useBoolean();

  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox
            checked={selected}
            onClick={onSelectRow}
            inputProps={{ id: `row-checkbox-${id}`, 'aria-label': `Row checkbox` }}
          />
        </TableCell>
        <TableCell> {startCase(name)} </TableCell>
        <TableCell align="center">{row.category?.title}</TableCell>
        <TableCell align="center">
          {row.value.map((v) => (
            <Chip
              key={v}
              variant="soft"
              color="info"
              label={v}
              sx={{ m: 0.5, textTransform: 'capitalize' }}
            />
          ))}
        </TableCell>
        <TableCell align="right" sx={{ px: 1, whiteSpace: 'nowrap' }}>
          <IconButton onClick={manageForm.onTrue}>
            <Iconify icon="solar:pen-bold" />
          </IconButton>
          <IconButton onClick={confirm.onTrue} sx={{ color: 'error.main' }}>
            <Iconify icon="solar:trash-bin-trash-bold" />
          </IconButton>
        </TableCell>
      </TableRow>

      <AttributeManageForm item={row} open={manageForm.value} onClose={manageForm.onFalse} />

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content="Are you sure want to delete?"
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => onDeleteRow(id, confirm.onFalse)}
            disabled={deleteLoading}
          >
            Delete
          </Button>
        }
      />
    </>
  );
}
