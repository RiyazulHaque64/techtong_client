import type { IErrorResponse } from 'src/redux/interfaces/common';

import { useCallback, useState } from 'react';

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
import { useDeleteBrandMutation, useGetBrandsQuery } from 'src/redux/features/brand/brandApi';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { Iconify } from 'src/components/iconify';
import { LoadingScreen } from 'src/components/loading-screen';
import { ImageSelectModal } from 'src/components/modal/image-select-modal';
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

import { BrandManageForm } from '../brand-manage-form';
import { BrandTableRow } from '../brand-table-row';
import { BrandTableToolbar } from '../brand-table-toolbar';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'icon', label: 'Icon', width: 120, noSort: true },
  { id: 'name', label: 'Name', width: 150 },
  { id: 'description', label: 'Description' },
  {
    id: 'products',
    label: 'Products',
    width: 100,
    align: 'center',
  },
  { id: '', width: 88 },
];

// ----------------------------------------------------------------------

export function BrandView() {
  const [searchText, setSearchText] = useState<string>('');
  const [selectedImages, setSelectedImages] = useState<string[]>([]);

  const selectLogo = useBoolean();
  const confirm = useBoolean();
  const manageForm = useBoolean();
  const searchTerm = useDebounce(searchText, 500);
  const table = useTable();

  const { page, rowsPerPage, orderBy, order, selected, setSelected } = table;

  // Fetcher
  const [deleteBrands, { isLoading: deleteLoading }] = useDeleteBrandMutation();
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
    ...(searchTerm.length > 0 ? [{ name: 'searchTerm', value: searchTerm }] : []),
  ]);

  // Handlers
  const handleDeleteRow = useCallback(
    async (id: string, close: () => void) => {
      try {
        const res = await deleteBrands({ ids: [id] });
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
    [deleteBrands]
  );

  const handleDeleteRows = useCallback(async () => {
    try {
      const res = await deleteBrands({ ids: selected });
      if (res?.error) {
        toast.error((res?.error as IErrorResponse)?.data?.message || 'Delete failed!');
      } else {
        toast.success('Delete success!');
        setSelected([]);
      }
    } catch (err) {
      toast.error('Delete failed!');
    }
  }, [selected, deleteBrands, setSelected]);

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
        <CustomBreadcrumbs
          heading="Brand"
          links={[{ name: 'Dashboard', href: paths.dashboard.root }, { name: 'Brand' }]}
          action={
            <Button
              onClick={manageForm.onTrue}
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              Add Brand
            </Button>
          }
          sx={{ mb: 3 }}
        />

        <Card>
          <BrandTableToolbar setSearchText={setSearchText} searchText={searchText} />

          <Box sx={{ position: 'relative' }}>
            <TableSelectedAction
              numSelected={table.selected.length}
              rowCount={brands.meta.total}
              onSelectAllRows={(checked) => {
                console.log(checked);
                return (
                  table.onSelectAllRows(
                    checked,
                    brands.data.map((row) => row.id)
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
                      deleteLoading={deleteLoading}
                    />
                  ))}

                  <TableEmptyRows
                    height={table.dense ? 56 : 56 + 20}
                    emptyRows={emptyRows(table.page, table.rowsPerPage, brands.data.length)}
                  />

                  <TableNoData notFound={!!(brands.data.length === 0)} title="No brands found" />
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

      <ImageSelectModal
        title="Select logo"
        open={selectLogo.value}
        onClose={selectLogo.onFalse}
        selectedImages={selectedImages}
        setSelectedImages={setSelectedImages}
        multiple={false}
      />

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

      <BrandManageForm open={manageForm.value} onClose={manageForm.onFalse} />
    </>
  );
}
