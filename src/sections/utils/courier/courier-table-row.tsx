import type { ICourier } from "src/types/courier";

import { Button, Checkbox, IconButton, TableCell, TableRow } from "@mui/material";

import { useBoolean } from "src/hooks/use-boolean";

import { ConfirmDialog } from "src/components/custom-dialog";
import { Iconify } from "src/components/iconify";

import { CourierFormModal } from "./courier-form-modal";

type Props = {
    row: ICourier;
    onDeleteRow: (id: string, close: () => void) => void;
    deleteLoading: boolean;
    selected: boolean;
    onSelectRow: () => void;
};

export function CourierTableRow({ row, onDeleteRow, deleteLoading, selected, onSelectRow }: Props) {

    const confirm = useBoolean();
    const edit = useBoolean();

    return (
        <>
            <TableRow hover selected={selected}>
                <TableCell padding="checkbox">
                    <Checkbox
                        checked={selected}
                        onClick={onSelectRow}
                        inputProps={{ id: `row-checkbox-${row.id}`, 'aria-label': `Row checkbox` }}
                    />
                </TableCell>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.email || 'No email'}</TableCell>
                <TableCell>{row.contact_number || 'No contact number'}</TableCell>
                <TableCell>{row.address || 'No address'}</TableCell>

                <TableCell align="right" sx={{ px: 1, whiteSpace: 'nowrap' }}>
                    <IconButton onClick={edit.onTrue}>
                        <Iconify icon="solar:pen-bold" />
                    </IconButton>
                    <IconButton onClick={confirm.onTrue} sx={{ color: 'error.main' }} title="Delete">
                        <Iconify icon="solar:trash-bin-trash-bold" />
                    </IconButton>
                </TableCell>
            </TableRow>
            <ConfirmDialog
                open={confirm.value}
                onClose={confirm.onFalse}
                title="Delete"
                content="Are you sure want to delete?"
                action={
                    <Button
                        variant="contained"
                        color="error"
                        onClick={() => onDeleteRow(row.id, confirm.onFalse)}
                        disabled={deleteLoading}
                    >
                        Delete
                    </Button>
                }
            />
            <CourierFormModal open={edit.value} onClose={edit.onFalse} courierID={row.id} />
        </>
    );
}