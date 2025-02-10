import type { ICategory } from 'src/types/category';

import { Stack } from '@mui/material';
import Button from '@mui/material/Button';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';

import { useBoolean } from 'src/hooks/use-boolean';

import { CONFIG } from 'src/config-global';

import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';

import { CategoryDetails } from './category-details';
import { CategoryManageForm } from './category-manage-form';

// ----------------------------------------------------------------------

type Props = {
  row: ICategory;
  selected: boolean;
  onSelectRow: () => void;
  onDeleteRow: (id: string, close: () => void) => void;
  deleteLoading: boolean;
};

export function CategoryTableRow({
  row,
  selected,
  onSelectRow,
  onDeleteRow,
  deleteLoading,
}: Props) {
  const { id, icon, title, description, parent, _count } = row;
  const confirm = useBoolean();

  const details = useBoolean();
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

        <TableCell align="center">
          <Stack direction="row" alignItems="center" spacing={2}>
            <img
              src={`${CONFIG.bucket.url}/${CONFIG.bucket.general_bucket}/${icon}`}
              alt={title}
              style={{ borderRadius: '4px', width: '40px', height: '40px', objectFit: 'cover' }}
            />
          </Stack>
        </TableCell>
        <TableCell> {title} </TableCell>
        <TableCell> {description} </TableCell>
        <TableCell align="center"> {parent?.title} </TableCell>
        <TableCell align="center"> {_count?.products} </TableCell>
        <TableCell align="right" sx={{ px: 1, whiteSpace: 'nowrap' }}>
          <IconButton onClick={details.onTrue}>
            <Iconify icon="solar:eye-bold" />
          </IconButton>
          <IconButton onClick={manageForm.onTrue}>
            <Iconify icon="solar:pen-bold" />
          </IconButton>
          <IconButton onClick={confirm.onTrue} sx={{ color: 'error.main' }}>
            <Iconify icon="solar:trash-bin-trash-bold" />
          </IconButton>
        </TableCell>
      </TableRow>

      <CategoryDetails
        item={row}
        open={details.value}
        onClose={details.onFalse}
        onDelete={onDeleteRow}
        deleteLoading={false}
      />

      <CategoryManageForm item={row} open={manageForm.value} onClose={manageForm.onFalse} />

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
