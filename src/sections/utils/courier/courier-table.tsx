import type { CardProps } from '@mui/material/Card';
import type { IErrorResponse } from "src/redux/interfaces/common";

import { useCallback, useState } from "react";

import { Box, Button, Card, CardHeader, IconButton, InputAdornment, Skeleton, Stack, Table, TableBody, TableContainer, TextField, Tooltip } from "@mui/material";

import { useBoolean } from "src/hooks/use-boolean";
import { useDebounce } from 'src/hooks/use-debounce';

import { useDeleteCouriersMutation, useGetCouriersQuery } from "src/redux/features/courier/courier-api";

import { ConfirmDialog } from "src/components/custom-dialog";
import { Iconify } from "src/components/iconify";
import { toast } from 'src/components/snackbar';
import { TableHeadCustom, TableNoData, TablePaginationCustom, TableSelectedAction, useTable } from "src/components/table";

import { FetchingError } from 'src/sections/error/fetching-error';

import { CourierFormModal } from './courier-form-modal';
import { CourierTableRow } from './courier-table-row';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
    { id: 'name', label: 'Name', width: 220 },
    { id: 'email', label: 'Email', width: 220 },
    { id: 'contact_number', label: 'Contact Number', width: 200 },
    { id: 'address', label: 'Address' },
    { id: '', label: 'Actions', width: 100, align: 'center' },
]

// ----------------------------------------------------------------------

type Props = CardProps;

export function CourierTable({ ...other }: Props) {
    const [searchText, setSearchText] = useState<string>('');

    const searchTerm = useDebounce(searchText, 500);
    const table = useTable();
    const { page, rowsPerPage, orderBy, order, selected, setSelected } = table;

    const confirm = useBoolean();
    const openModal = useBoolean();

    const { data: couriers, isLoading: getCouriersLoading, isError, error } = useGetCouriersQuery([
        { name: 'page', value: page + 1 },
        { name: 'limit', value: rowsPerPage },
        {
            name: 'sortBy',
            value: orderBy,
        },
        {
            name: 'sortOrder',
            value: order,
        },
        ...(searchTerm.length > 0 ? [{ name: 'searchTerm', value: searchTerm }] : []),
    ]);
    const [deleteCouriers, { isLoading: deleteLoading }] = useDeleteCouriersMutation();

    // Handlers
    const handleDeleteRow = useCallback(
        async (id: string, close: () => void) => {
            try {
                const res = await deleteCouriers({ ids: [id] });
                if (res?.error) {
                    toast.error((res?.error as IErrorResponse)?.data?.message || 'Delete failed!');
                } else {
                    toast.success('Delete success!');
                    close();
                }
            } catch (err) {
                toast.error('Delete failed!');
            }
        },
        [deleteCouriers]
    );

    const handleDeleteRows = useCallback(async () => {
        try {
            const res = await deleteCouriers({ ids: selected });
            if (res?.error) {
                toast.error((res?.error as IErrorResponse)?.data?.message || 'Delete failed!');
            } else {
                toast.success('Delete success!');
                setSelected([]);
            }
        } catch (err) {
            toast.error('Delete failed!');
        }
    }, [selected, deleteCouriers, setSelected]);

    const handleSearch = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            setSearchText(event.target.value);
        },
        [setSearchText]
    );

    // JSX
    if (getCouriersLoading) {
        return (
            <Stack>
                <Skeleton sx={{ minHeight: 550 }} />
            </Stack>
        );
    }

    if (isError || !couriers) {
        return (
            <FetchingError
                errorResponse={(error as IErrorResponse).data}
                statusCode={(error as IErrorResponse).status}
            />
        );
    }

    return (
        <>
            <Card {...other}>
                <CardHeader
                    title="Courier List"
                    action={
                        <Stack direction='row' alignItems='center' gap={1}>
                            <TextField
                                size='small'
                                value={searchText}
                                onChange={handleSearch}
                                placeholder="Search courier..."
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                                        </InputAdornment>
                                    ),
                                    ...(searchText && {
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <Iconify
                                                    icon="line-md:close"
                                                    sx={{ color: 'text.disabled', cursor: 'pointer' }}
                                                    onClick={() => setSearchText('')}
                                                />
                                            </InputAdornment>
                                        ),
                                    }),
                                }}
                            />
                            <Button
                                color="inherit"
                                variant="outlined"
                                startIcon={<Iconify icon="fa6-solid:plus" />}
                                onClick={openModal.onTrue}
                            >
                                Add
                            </Button>
                        </Stack>
                    }
                    sx={{ mb: 3 }}
                />
                <Box sx={{ position: 'relative' }}>
                    <TableSelectedAction
                        numSelected={table.selected.length}
                        rowCount={couriers.meta.total}
                        onSelectAllRows={(checked) => {
                            console.log(checked);
                            return (
                                table.onSelectAllRows(
                                    checked,
                                    couriers.data.map((row) => row.id)
                                )
                            )
                        }
                        }
                        action={
                            <Tooltip title="Delete">
                                <IconButton color="primary" onClick={confirm.onTrue}>
                                    <Iconify icon="solar:trash-bin-trash-bold" />
                                </IconButton>
                            </Tooltip>
                        }
                    />
                    <TableContainer sx={{ maxHeight: '410px' }}>
                        <Table stickyHeader>
                            <TableHeadCustom
                                order={table.order}
                                orderBy={table.orderBy}
                                headLabel={TABLE_HEAD}
                                rowCount={couriers.meta.total}
                                numSelected={table.selected.length}
                                onSort={table.onSort}
                                onSelectAllRows={(checked) =>
                                    table.onSelectAllRows(
                                        checked,
                                        couriers.data.map((row) => row.id)
                                    )
                                }
                            />
                            <TableBody sx={{ border: '1px solid red' }}>
                                {couriers.data.map((row) => (
                                    <CourierTableRow key={row.id} row={row} deleteLoading={deleteLoading} onDeleteRow={handleDeleteRow} selected={table.selected.includes(row.id)}
                                        onSelectRow={() => table.onSelectRow(row.id)} />
                                ))}

                                <TableNoData notFound={!!(couriers.data.length === 0)} title="No courier found" />
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
                <TablePaginationCustom
                    page={table.page}
                    count={couriers.meta.total}
                    rowsPerPage={table.rowsPerPage}
                    onPageChange={table.onChangePage}
                    onRowsPerPageChange={table.onChangeRowsPerPage}
                />
            </Card>
            <ConfirmDialog
                open={confirm.value}
                onClose={confirm.onFalse}
                title="Delete"
                content={
                    <>
                        Are you sure want to delete <strong> {table.selected.length} </strong> items?
                    </>
                }
                action={
                    <Button
                        variant="contained"
                        color="error"
                        onClick={() => {
                            handleDeleteRows();
                            confirm.onFalse();
                        }}
                    >
                        Delete
                    </Button>
                }
            />
            <CourierFormModal open={openModal.value} onClose={openModal.onFalse} />
        </>

    );
}

