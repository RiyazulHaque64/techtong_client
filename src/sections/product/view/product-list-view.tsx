import type { IErrorResponse } from 'src/redux/interfaces/common';

import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import { Tab, Tabs } from '@mui/material';
import Tooltip from '@mui/material/Tooltip';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { useBoolean } from 'src/hooks/use-boolean';
import { useDebounce } from 'src/hooks/use-debounce';

import { varAlpha } from 'src/theme/styles';
import { DashboardContent } from 'src/layouts/dashboard';
import {
  useGetProductsQuery,
  useDeleteProductsMutation,
} from 'src/redux/features/product/product-api';

import { Label } from 'src/components/label';
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

import { ProductTableRow } from '../components/product-list/product-table-row';
import { ProductFiltersState } from '../components/product-list/product-filters-state';
import { ProductTableToolbar } from '../components/product-list/product-table-toolbar';
import {
  PRODUCT_TAB_OPTIONS,
  BRAND_FILTER_DEFAULT_OPTION,
  STOCK_STATUS_DEFAULT_OPTION,
  CATEGORY_FILTER_DEFAULT_OPTION,
} from '../utils';

import type { TFilterOption } from '../utils';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Product', width: 180 },
  { id: 'stock', label: 'Stock', width: 120 },
  { id: 'price', label: 'Price', width: 90 },
  { id: 'updated_at', label: 'Updated at', align: 'center', width: 90 },
  {
    id: 'published',
    label: 'Published',
    width: 80,
    align: 'center',
    noSort: true,
  },
  {
    id: 'featured',
    label: 'Featured',
    width: 80,
    align: 'center',
    noSort: true,
  },
  { id: '', label: 'Actions', align: 'center', width: 80 },
];

// ----------------------------------------------------------------------

export type TProductFilter = {
  stock_status: TFilterOption;
  brand: TFilterOption;
  category: TFilterOption;
};

export function ProductListView() {
  const [searchText, setSearchText] = useState<string>('');
  const [selectedTab, setSelectedTab] = useState('all');
  const [filter, setFilter] = useState<TProductFilter>({
    stock_status: STOCK_STATUS_DEFAULT_OPTION,
    brand: BRAND_FILTER_DEFAULT_OPTION,
    category: CATEGORY_FILTER_DEFAULT_OPTION,
  });

  const confirm = useBoolean();
  const searchTerm = useDebounce(searchText, 500);
  const table = useTable();

  const { page, rowsPerPage, orderBy, order, selected, setSelected, onResetPage } = table;

  // Fetcher
  const [deleteProducts, { isLoading: deleteLoading }] = useDeleteProductsMutation();
  const {
    data: products,
    isLoading: getProductsLoading,
    isError,
    error,
  } = useGetProductsQuery([
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
    ...(filter.brand.value.length > 0 ? [{ name: 'brand', value: filter.brand.value }] : []),
    ...(filter.category.value.length > 0 ? [{ name: 'brand', value: filter.category.value }] : []),
    ...(filter.stock_status.value.length > 0
      ? [{ name: 'stock_status', value: filter.stock_status.value }]
      : []),
  ]);

  const canReset =
    !!searchText || !!filter.stock_status.value || !!filter.brand.value || !!filter.category.value;

  // Handlers
  const handleDeleteRow = useCallback(
    async (id: string, close: () => void) => {
      try {
        const res = await deleteProducts({ ids: [id] });
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
    [deleteProducts]
  );

  const handleDeleteRows = useCallback(async () => {
    try {
      const res = await deleteProducts({ ids: selected });
      if (res?.error) {
        toast.error((res?.error as IErrorResponse)?.data?.message || 'Delete failed!');
      } else {
        toast.success('Delete success!');
        setSelected([]);
      }
    } catch (err) {
      toast.error('Delete failed!');
    }
  }, [selected, deleteProducts, setSelected]);

  // JSX
  if (getProductsLoading) {
    return (
      <LoadingScreen sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }} />
    );
  }

  if (isError || !products) {
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
          heading="Products"
          links={[{ name: 'Dashboard', href: paths.dashboard.root }, { name: 'Product' }]}
          action={
            <Button
              component={RouterLink}
              href={paths.dashboard.add_product}
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              New product
            </Button>
          }
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
            {PRODUCT_TAB_OPTIONS.map((t: { value: string; label: string }) => (
              <Tab
                key={t.value}
                iconPosition="end"
                value={t.value}
                label={t.label}
                icon={
                  <Label
                    variant={((t.value === 'all' || t.value === selectedTab) && 'filled') || 'soft'}
                    color={
                      (t.value === 'published' && 'success') ||
                      (t.value === 'draft' && 'warning') ||
                      'default'
                    }
                  >
                    {t.value === 'published'
                      ? products.meta.published
                      : t.value === 'draft'
                        ? products.meta.draft
                        : t.value === 'featured'
                          ? products.meta.featured
                          : products.meta.all}
                  </Label>
                }
              />
            ))}
          </Tabs>
          <ProductTableToolbar
            productMeta={products.meta}
            setSearchText={setSearchText}
            searchText={searchText}
            filter={filter}
            setFilter={setFilter}
          />
          {canReset && (
            <ProductFiltersState
              searchText={searchText}
              setSearchText={setSearchText}
              filter={filter}
              setFilter={setFilter}
              onResetPage={onResetPage}
              totalResults={products.meta.total}
              sx={{ p: 2.5, pt: 0 }}
            />
          )}

          <Box sx={{ position: 'relative' }}>
            <TableSelectedAction
              numSelected={table.selected.length}
              rowCount={products.meta.total}
              onSelectAllRows={(checked) =>
                table.onSelectAllRows(
                  checked,
                  products.data.map((row) => row.id)
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
                  rowCount={products.meta.total}
                  numSelected={table.selected.length}
                  onSort={table.onSort}
                  onSelectAllRows={(checked) =>
                    table.onSelectAllRows(
                      checked,
                      products.data.map((row) => row.id)
                    )
                  }
                />

                <TableBody>
                  {products.data.map((row) => (
                    <ProductTableRow
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
                    emptyRows={emptyRows(table.page, table.rowsPerPage, products.data.length)}
                  />

                  <TableNoData notFound={!!(products.data.length === 0)} title="No product found" />
                </TableBody>
              </Table>
            </Scrollbar>
          </Box>

          <TablePaginationCustom
            page={table.page}
            count={products.meta.total}
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
