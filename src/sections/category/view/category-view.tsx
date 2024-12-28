import type { IErrorResponse } from 'src/redux/interfaces/common';

import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';

import { paths } from 'src/routes/paths';

import { useBoolean } from 'src/hooks/use-boolean';
import { useDebounce } from 'src/hooks/use-debounce';

import { DashboardContent } from 'src/layouts/dashboard';
import {
  useGetCategoriesQuery,
  useDeleteCategoriesMutation,
} from 'src/redux/features/category/categoryApi';

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

import { CategoryTableRow } from '../category-table-row';
import { CategoryManageForm } from '../category-manage-form';
import { CategoryTableToolbar } from '../category-table-toolbar';
import { CategoryFiltersResult } from '../category-filters-result';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'icon', label: 'Icon', width: 120, noSort: true },
  { id: 'title', label: 'Title', width: 150 },
  { id: 'description', label: 'Description' },
  { id: 'parent', label: 'Parent Category', align: 'center', noSort: true },
  {
    id: 'products',
    label: 'Products',
    width: 100,
    align: 'center',
  },
  { id: '', width: 88 },
];

// ----------------------------------------------------------------------

export function CategoryView() {
  const [searchText, setSearchText] = useState<string>('');
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [parentCategory, setParentCategory] = useState<string>('');

  const selectLogo = useBoolean();
  const confirm = useBoolean();
  const manageForm = useBoolean();
  const searchTerm = useDebounce(searchText, 500);
  const table = useTable();

  const { page, rowsPerPage, orderBy, order, selected, setSelected, onResetPage } = table;

  // Fetcher
  const [deleteCategories, { isLoading: deleteLoading }] = useDeleteCategoriesMutation();
  const {
    data: categories,
    isLoading: getCategoriesLoading,
    isError,
    error,
  } = useGetCategoriesQuery([
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
    ...(parentCategory.length > 0 && parentCategory !== 'ALL'
      ? [{ name: 'parent', value: parentCategory }]
      : []),
  ]);

  const canReset = !!searchText || (parentCategory.length > 0 && parentCategory !== 'ALL');

  // Handlers
  const handleDeleteRow = useCallback(
    async (id: string, close: () => void) => {
      try {
        const res = await deleteCategories({ ids: [id] });
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
    [deleteCategories]
  );

  const handleDeleteRows = useCallback(async () => {
    try {
      const res = await deleteCategories({ ids: selected });
      if (res?.error) {
        toast.error((res?.error as IErrorResponse)?.data?.message || 'Delete failed!');
      } else {
        toast.success('Delete success!');
        setSelected([]);
      }
    } catch (err) {
      toast.error('Delete failed!');
    }
  }, [selected, deleteCategories, setSelected]);

  // JSX
  if (getCategoriesLoading) {
    return (
      <LoadingScreen sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }} />
    );
  }

  if (isError || !categories) {
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
          heading="Category"
          links={[{ name: 'Dashboard', href: paths.dashboard.root }, { name: 'Category' }]}
          action={
            <Button
              onClick={manageForm.onTrue}
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              Add Category
            </Button>
          }
          sx={{ mb: 3 }}
        />

        <Card>
          <CategoryTableToolbar
            setSearchText={setSearchText}
            searchText={searchText}
            parentCategory={parentCategory}
            setParentCategory={setParentCategory}
          />
          {canReset && (
            <CategoryFiltersResult
              parentCategory={parentCategory}
              setParentCategory={setParentCategory}
              searchText={searchText}
              setSearchText={setSearchText}
              onResetPage={onResetPage}
              totalResults={categories.meta.total}
              sx={{ p: 2.5, pt: 0 }}
            />
          )}

          <Box sx={{ position: 'relative' }}>
            <TableSelectedAction
              numSelected={table.selected.length}
              rowCount={categories.meta.total}
              onSelectAllRows={(checked) =>
                table.onSelectAllRows(
                  checked,
                  categories.data.map((row) => row.id)
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
                  rowCount={categories.meta.total}
                  numSelected={table.selected.length}
                  onSort={table.onSort}
                  onSelectAllRows={(checked) =>
                    table.onSelectAllRows(
                      checked,
                      categories.data.map((row) => row.id)
                    )
                  }
                />

                <TableBody>
                  {categories.data.map((row) => (
                    <CategoryTableRow
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
                    emptyRows={emptyRows(table.page, table.rowsPerPage, categories.data.length)}
                  />

                  <TableNoData
                    notFound={!!(categories.data.length === 0)}
                    title="No categories found"
                  />
                </TableBody>
              </Table>
            </Scrollbar>
          </Box>

          <TablePaginationCustom
            page={table.page}
            count={categories.meta.total}
            rowsPerPage={table.rowsPerPage}
            onPageChange={table.onChangePage}
            onRowsPerPageChange={table.onChangeRowsPerPage}
          />
        </Card>
      </DashboardContent>

      <ImageSelectModal
        title="Select icon"
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

      <CategoryManageForm open={manageForm.value} onClose={manageForm.onFalse} />
    </>
  );
}
