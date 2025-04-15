import type { IErrorResponse } from 'src/redux/interfaces/common';
import type { TFilterOption } from 'src/types/common';

import { useCallback, useState } from 'react';

import { Tab, Tabs } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import Tooltip from '@mui/material/Tooltip';

import { paths } from 'src/routes/paths';

import { useBoolean } from 'src/hooks/use-boolean';
import { useDebounce } from 'src/hooks/use-debounce';

import { DashboardContent } from 'src/layouts/dashboard';
import { useDeleteOrdersMutation, useGetOrdersQuery } from 'src/redux/features/order/order-api';
import { varAlpha } from 'src/theme/styles';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { Iconify } from 'src/components/iconify';
import { Label } from 'src/components/label';
import { LoadingScreen } from 'src/components/loading-screen';
import { Scrollbar } from 'src/components/scrollbar';
import { toast } from 'src/components/snackbar';
import {
    emptyRows,
    TableEmptyRows,
    TableHeadCustom,
    TableNoData,
    TablePaginationCustom,
    TableSelectedAction,
    useTable,
} from 'src/components/table';

import { FetchingError } from 'src/sections/error/fetching-error';

import { OrderFiltersState } from '../order-filters-state';
import { OrderTableRow } from '../order-table-row';
import { OrderTableToolbar } from '../order-table-toolbar';
import { ORDER_TAB_OPTIONS, PAYMENT_STATUS_DEFAULT_OPTION } from '../utils';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
    { id: 'order_id', label: 'Order', width: 80, align: 'center' },
    { id: 'customer', label: 'Customer', width: 160, noSort: true },
    { id: 'created_at', label: 'Date', width: 100 },
    { id: 'item', label: 'Items', width: 50, noSort: true, align: 'center' },
    { id: 'price', label: 'Price', width: 80, align: 'center' },
    {
        id: 'payment_status',
        label: 'Payment',
        width: 60,
        align: 'center'
    },
    {
        id: 'order_status',
        label: 'Status',
        width: 60,
        align: 'center'
    },
    { id: '', label: 'Actions', align: 'center', width: 80 },
];

// ----------------------------------------------------------------------

export type TOrderFilter = {
    payment_status: TFilterOption;
    from_date: string | undefined;
    to_date: string | undefined;
};

export function OrderView() {
    const [searchText, setSearchText] = useState<string>('');
    const [selectedTab, setSelectedTab] = useState('ALL');
    const [filter, setFilter] = useState<TOrderFilter>({
        payment_status: PAYMENT_STATUS_DEFAULT_OPTION,
        from_date: undefined,
        to_date: undefined
    });

    const confirm = useBoolean();
    const searchTerm = useDebounce(searchText, 500);
    const table = useTable();

    const { page, rowsPerPage, orderBy, order, selected, setSelected, onResetPage } = table;

    // Fetcher
    const [deleteOrders, { isLoading: deleteLoading }] = useDeleteOrdersMutation();
    const {
        data: orders,
        isLoading: getOrdersLoading,
        isError,
        error,
    } = useGetOrdersQuery([
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
        ...(filter.payment_status.value.length > 0
            ? [{ name: 'payment_status', value: filter.payment_status.value }]
            : []),
        ...(filter.from_date
            ? [{ name: 'from_date', value: filter.from_date }]
            : []),
        ...(filter.to_date
            ? [{ name: 'to_date', value: filter.to_date }]
            : []),
        ...(selectedTab !== 'ALL'
            ? [{ name: 'order_status', value: selectedTab }]
            : []),
    ]);

    const canReset =
        !!searchText || !!filter.payment_status.value || !!filter.from_date || !!filter.to_date;

    // Handlers
    const handleDeleteRow = useCallback(
        async (id: string, close: () => void) => {
            try {
                const res = await deleteOrders({ ids: [id] });
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
        [deleteOrders]
    );

    const handleDeleteRows = useCallback(async () => {
        try {
            const res = await deleteOrders({ ids: selected });
            if (res?.error) {
                toast.error((res?.error as IErrorResponse)?.data?.message || 'Delete failed!');
            } else {
                toast.success('Delete success!');
                setSelected([]);
            }
        } catch (err) {
            toast.error('Delete failed!');
        }
    }, [selected, deleteOrders, setSelected]);

    // JSX
    if (getOrdersLoading) {
        return (
            <LoadingScreen sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }} />
        );
    }

    if (isError || !orders) {
        return (
            <FetchingError
                errorResponse={(error as IErrorResponse).data}
                statusCode={(error as IErrorResponse).status}
            />
        );
    }

    return (
        <>
            <DashboardContent>
                <CustomBreadcrumbs
                    heading="Order"
                    links={[{ name: 'Dashboard', href: paths.dashboard.root }, { name: 'Order' }]}
                    sx={{ mb: 3 }}
                />

                <Card>
                    <Tabs
                        value={selectedTab}
                        onChange={(event, newValue) => setSelectedTab(newValue)}
                        sx={{
                            px: 2.5,
                            boxShadow: (theme) =>
                                `inset 0 -2px 0 0 ${varAlpha(theme.vars.palette.grey['500Channel'], 0.08)}`,
                        }}
                    >
                        {ORDER_TAB_OPTIONS.map((t: { value: string; label: string }) => (
                            <Tab
                                key={t.value}
                                iconPosition="end"
                                value={t.value}
                                label={t.label}
                                icon={
                                    <Label
                                        variant={((t.value === 'ALL' || t.value === selectedTab) && 'filled') || 'soft'}
                                        color={
                                            (t.value === 'PENDING' && 'warning') ||
                                            (t.value === 'DELIVERED' && 'success') ||
                                            (t.value === 'CANCELLED' && 'error') ||
                                            'default'
                                        }
                                    >
                                        {(t.value === 'ALL' ? orders.meta.total : orders.meta[t.value.toLowerCase()]) || 0}
                                    </Label>
                                }
                            />
                        ))}
                    </Tabs>
                    <OrderTableToolbar
                        orderMeta={orders.meta}
                        setSearchText={setSearchText}
                        searchText={searchText}
                        filter={filter}
                        setFilter={setFilter}
                    />
                    {canReset && (
                        <OrderFiltersState
                            searchText={searchText}
                            setSearchText={setSearchText}
                            filter={filter}
                            setFilter={setFilter}
                            onResetPage={onResetPage}
                            totalResults={orders.meta.total}
                            sx={{ p: 2.5, pt: 0 }}
                        />
                    )}

                    <Box sx={{ position: 'relative' }}>
                        <TableSelectedAction
                            numSelected={table.selected.length}
                            rowCount={orders.meta.total}
                            onSelectAllRows={(checked) =>
                                table.onSelectAllRows(
                                    checked,
                                    orders.data.map((row) => row.id)
                                )
                            }
                            action={
                                <Tooltip title="Delete">
                                    <IconButton color="primary" onClick={confirm.onTrue}>
                                        <Iconify icon="solar:trash-bin-trash-bold" />
                                    </IconButton>
                                </Tooltip>
                            }
                        />

                        <Scrollbar sx={{ minHeight: 444 }}>
                            <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
                                <TableHeadCustom
                                    order={table.order}
                                    orderBy={table.orderBy}
                                    headLabel={TABLE_HEAD}
                                    rowCount={orders.meta.total}
                                    numSelected={table.selected.length}
                                    onSort={table.onSort}
                                    onSelectAllRows={(checked) =>
                                        table.onSelectAllRows(
                                            checked,
                                            orders.data.map((row) => row.id)
                                        )
                                    }
                                />

                                <TableBody>
                                    {orders.data.map((row) => (
                                        <OrderTableRow
                                            key={row.id}
                                            row={row}
                                            selected={table.selected.includes(row.id)}
                                            onSelectRow={() => table.onSelectRow(row.id)}
                                            onDeleteRow={handleDeleteRow}
                                            deleteLoading={deleteLoading}
                                        />
                                    ))}

                                    <TableEmptyRows
                                        height={table.dense ? 56 : 56 + 20}
                                        emptyRows={emptyRows(table.page, table.rowsPerPage, orders.data.length)}
                                    />

                                    <TableNoData notFound={!!(orders.data.length === 0)} title="No order found" />
                                </TableBody>
                            </Table>
                        </Scrollbar>
                    </Box>

                    <TablePaginationCustom
                        page={table.page}
                        count={orders.meta.total}
                        rowsPerPage={table.rowsPerPage}
                        onPageChange={table.onChangePage}
                        onRowsPerPageChange={table.onChangeRowsPerPage}
                    />
                </Card>
            </DashboardContent>

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
        </>
    );
}
