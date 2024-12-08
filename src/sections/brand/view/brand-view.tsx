import type { IBrandTableFilters } from 'src/types/brand';
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
import { useRouter } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';
import { useDebounce } from 'src/hooks/use-debounce';
import { useSetState } from 'src/hooks/use-set-state';

import { DashboardContent } from 'src/layouts/dashboard';
import { useGetBrandsQuery } from 'src/redux/features/brand/brandApi';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { LoadingScreen } from 'src/components/loading-screen';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { ImageSelectModal } from 'src/components/modal/image-select-modal';
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

import { BrandTableRow } from '../brand-table-row';
import { BrandTableFiltersResult } from '../brand-table-filter-result';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'icon', label: 'Icon', width: 120 },
  { id: 'name', label: 'Name', width: 150 },
  { id: 'description', label: 'Description' },
  {
    id: '_count.products',
    label: 'Products',
    width: 100,
    align: 'center',
  },
  { id: '', width: 88 },
];

// ----------------------------------------------------------------------

export function BrandView() {
  const table = useTable();
  const { page, rowsPerPage, orderBy, order } = table;

  const [searchText, setSearchText] = useState<string>('');

  console.log(setSearchText);

  const selectLogo = useBoolean();

  const searchTerm = useDebounce(searchText, 500);

  const {
    data: brands,
    isLoading: getBrandsLoading,
    isError,
    error,
  } = useGetBrandsQuery([
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
    { name: 'searchTerm', value: searchTerm },
  ]);

  const router = useRouter();

  const confirm = useBoolean();

  const filters = useSetState<IBrandTableFilters>({
    searchTerm: '',
    startDate: null,
    endDate: null,
  });

  const canReset =
    !!filters.state.searchTerm || (!!filters.state.startDate && !!filters.state.endDate);

  const notFound = (!brands?.data.length && canReset) || !brands?.data.length;

  const handleDeleteRow = useCallback(async (id: string, close: () => void) => {
    toast.success('Delete success!');
    close();
    console.log(id);
  }, []);

  const handleDeleteRows = useCallback(() => {
    toast.success('Delete success!');
  }, []);

  const handleViewRow = useCallback(
    (id: string) => {
      router.push(paths.dashboard.root);
    },
    [router]
  );

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
            heading="Brand"
            links={[{ name: 'Dashboard', href: paths.dashboard.root }, { name: 'Brand' }]}
            sx={{ mb: { xs: 3, md: 5 } }}
          />
          <Button
            variant="contained"
            startIcon={<Iconify icon="eva:cloud-upload-fill" />}
            onClick={selectLogo.onTrue}
          >
            Select Logo
          </Button>
        </Stack>

        <Card>
          {/* <BrandTableToolbar
            filters={filters}
            onResetPage={table.onResetPage}
            dateError={dateError}
          /> */}

          {canReset && (
            <BrandTableFiltersResult
              filters={filters}
              totalResults={brands?.meta.total}
              onResetPage={table.onResetPage}
              sx={{ p: 2.5, pt: 0 }}
            />
          )}

          <Box sx={{ position: 'relative' }}>
            <TableSelectedAction
              dense={table.dense}
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
                    <BrandTableRow
                      key={row.id}
                      row={row}
                      selected={table.selected.includes(row.id)}
                      onSelectRow={() => table.onSelectRow(row.id)}
                      onDeleteRow={handleDeleteRow}
                      onViewRow={() => handleViewRow(row.id)}
                    />
                  ))}

                  <TableEmptyRows
                    height={table.dense ? 56 : 56 + 20}
                    emptyRows={emptyRows(table.page, table.rowsPerPage, brands.data.length)}
                  />

                  <TableNoData notFound={notFound} />
                </TableBody>
              </Table>
            </Scrollbar>
          </Box>

          <TablePaginationCustom
            page={table.page}
            dense={table.dense}
            count={brands.meta.total}
            rowsPerPage={table.rowsPerPage}
            onPageChange={table.onChangePage}
            onChangeDense={table.onChangeDense}
            onRowsPerPageChange={table.onChangeRowsPerPage}
          />
        </Card>
      </DashboardContent>

      <ImageSelectModal open={selectLogo.value} onClose={selectLogo.onFalse} />

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
