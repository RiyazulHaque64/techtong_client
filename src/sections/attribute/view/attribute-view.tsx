import type { IErrorResponse } from 'src/redux/interfaces/common';

import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import { Stack } from '@mui/material';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';

import { paths } from 'src/routes/paths';

import { useBoolean } from 'src/hooks/use-boolean';
import { useDebounce } from 'src/hooks/use-debounce';

import { DashboardContent } from 'src/layouts/dashboard';
import { useGetCategoriesQuery } from 'src/redux/features/category/categoryApi';
import {
  useGetAttributesQuery,
  useDeleteAttributeMutation,
} from 'src/redux/features/attribute/attributeApi';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { LoadingScreen } from 'src/components/loading-screen';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import {
  useTable,
  emptyRows,
  TableNoData,
  TableEmptyRows,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from 'src/components/table';

import { FetchingError } from 'src/sections/error/fetching-error';

import { AttributeTableRow } from '../attribute-table-row';
import { AttributeManageForm } from '../attribute-manage-form';
import { AttributeTableToolbar } from '../attribute-table-toolbar';
import { AttributeFiltersResult } from '../attribute-filters-result';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Name', width: 150 },
  { id: 'category', label: 'Category', width: 150, align: 'center' },
  { id: 'value', label: 'Value', align: 'center', noSort: true },
  { id: '', width: 88 },
];

// ----------------------------------------------------------------------

export function AttributeView() {
  const [searchText, setSearchText] = useState<string>('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const confirm = useBoolean();
  const manageForm = useBoolean();
  const searchTerm = useDebounce(searchText, 500);
  const table = useTable();

  const { page, rowsPerPage, orderBy, order, selected, setSelected, onResetPage } = table;

  // Fetcher
  const { data: categories } = useGetCategoriesQuery([{ name: 'limit', value: 500 }]);
  const [deleteAttributes, { isLoading: deleteLoading }] = useDeleteAttributeMutation();
  const {
    data: brands,
    isLoading: getBrandsLoading,
    isError,
    error,
  } = useGetAttributesQuery([
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
    ...(searchTerm ? [{ name: 'searchTerm', value: searchTerm }] : []),
    ...(selectedCategories.length > 0
      ? [{ name: 'category', value: selectedCategories.join(',') }]
      : []),
  ]);

  const canReset = !!searchText || selectedCategories.length > 0;

  // Handlers
  const handleDeleteRow = useCallback(
    async (id: string, close: () => void) => {
      try {
        const res = await deleteAttributes({ ids: [id] });
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
    [deleteAttributes]
  );

  const handleDeleteRows = useCallback(async () => {
    try {
      const res = await deleteAttributes({ ids: selected });
      if (res?.error) {
        toast.error((res?.error as IErrorResponse)?.data?.message || 'Delete failed!');
      } else {
        toast.success('Delete success!');
        setSelected([]);
      }
    } catch (err) {
      toast.error('Delete failed!');
    }
  }, [selected, deleteAttributes, setSelected]);

  // JSX
  if (getBrandsLoading) {
    return (
      <LoadingScreen sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }} />
    );
  }

  if (isError || !brands) {
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
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
          <CustomBreadcrumbs
            heading="Attribute"
            links={[{ name: 'Dashboard', href: paths.dashboard.root }, { name: 'Attribute' }]}
            sx={{ mb: 3 }}
          />
          <Button
            variant="contained"
            startIcon={<Iconify icon="eva:cloud-upload-fill" />}
            onClick={manageForm.onTrue}
          >
            Add Attribute
          </Button>
        </Stack>

        <Card>
          <AttributeTableToolbar
            setSearchText={setSearchText}
            searchText={searchText}
            selectedCategories={selectedCategories}
            setSelectedCategories={setSelectedCategories}
            categories={categories?.data || []}
          />
          {canReset && (
            <AttributeFiltersResult
              selectedCategories={selectedCategories}
              setSelectedCategories={setSelectedCategories}
              searchText={searchText}
              setSearchText={setSearchText}
              onResetPage={onResetPage}
              totalResults={brands.meta.total}
              sx={{ p: 2.5, pt: 0 }}
            />
          )}

          <Box sx={{ position: 'relative' }}>
            <TableSelectedAction
              numSelected={table.selected.length}
              rowCount={brands.meta.total}
              onSelectAllRows={(checked) =>
                table.onSelectAllRows(
                  checked,
                  brands.data.map((row) => row.id)
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
                  rowCount={brands.meta.total}
                  numSelected={table.selected.length}
                  onSort={table.onSort}
                  onSelectAllRows={(checked) =>
                    table.onSelectAllRows(
                      checked,
                      brands.data.map((row) => row.id)
                    )
                  }
                />

                <TableBody>
                  {brands.data.map((row) => (
                    <AttributeTableRow
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
                    emptyRows={emptyRows(table.page, table.rowsPerPage, brands.data.length)}
                  />

                  <TableNoData notFound={!!(brands.data.length === 0)} title="No attribute found" />
                </TableBody>
              </Table>
            </Scrollbar>
          </Box>

          <TablePaginationCustom
            page={table.page}
            count={brands.meta.total}
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

      <AttributeManageForm open={manageForm.value} onClose={manageForm.onFalse} />
    </>
  );
}
