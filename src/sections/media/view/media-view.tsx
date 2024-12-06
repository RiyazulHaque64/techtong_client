import type { TQueryParam, IErrorResponse } from 'src/redux/interfaces/common';

import { useState, useCallback } from 'react';

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { tablePaginationClasses } from '@mui/material/TablePagination';

import { useBoolean } from 'src/hooks/use-boolean';
import { useDebounce } from 'src/hooks/use-debounce';

import { DashboardContent } from 'src/layouts/dashboard';
import { useGetImagesQuery, useDeleteImagesMutation } from 'src/redux/features/image/imageApi';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { LoadingScreen } from 'src/components/loading-screen';
import { useTable, TablePaginationCustom } from 'src/components/table';

import { FetchingError } from 'src/sections/error/fetching-error';

import { MediaTable } from '../media-table';
import { MediaFilters } from '../media-filters';
import { MediaGridView } from '../media-grid-view';
import { MediaUploadDialog } from '../media-upload-dialog';
import { MediaFiltersResult } from '../media-filters-result';
import { MEDIA_FILTER_OPTIONS } from '../media-filters-options';

// ----------------------------------------------------------------------

export function MediaView() {
  const table = useTable({ defaultRowsPerPage: 10, defaultOrder: 'desc' });
  const {
    page,
    rowsPerPage,
    orderBy,
    order,
    selected,
    setSelected,
    onResetPage,
    onChangePage,
    onChangeRowsPerPage,
  } = table;

  const [searchText, setSearchText] = useState<string>('');
  const [types, setTypes] = useState<string[]>([]);
  const [queryParams, setQueryParams] = useState<TQueryParam[]>([]);
  const [view, setView] = useState<'list' | null>('list');

  const searchTerm = useDebounce(searchText, 500);

  const [deleteImages, { isLoading: deleteLoading }] = useDeleteImagesMutation();
  const {
    data: images,
    isLoading: getImagesLoading,
    isError,
    error,
  } = useGetImagesQuery([
    ...queryParams,
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
    { name: 'type', value: types.join(',') },
  ]);

  const openFromDate = useBoolean();
  const openToDate = useBoolean();
  const confirm = useBoolean();
  const upload = useBoolean();

  const canReset =
    !!searchText ||
    types.length > 0 ||
    !!queryParams.find((param) => param.name === 'fromDate')?.value ||
    !!queryParams.find((param) => param.name === 'toDate')?.value;

  const notFound = (!images?.data?.length && canReset) || !images?.data?.length;

  // Handler
  const handleChangeView = useCallback(
    (event: React.MouseEvent<HTMLElement>, newView: 'list' | null) => {
      if (newView !== null) {
        setView(newView);
      }
    },
    []
  );

  const handleDeleteItem = useCallback(
    async (path: string, close: () => void) => {
      try {
        const res = await deleteImages({ images_path: [path] });
        if (res?.error) {
          toast.error((res?.error as IErrorResponse)?.data?.message || 'Failed to delete!');
        } else {
          toast.success('Delete success!');
        }
        close();
      } catch (err) {
        toast.error((typeof err === 'string' ? err : err.message) || 'Failed to delete!');
      }
    },
    [deleteImages]
  );

  const handleDeleteItems = useCallback(async () => {
    try {
      const res = await deleteImages({ images_path: selected });
      if (res?.error) {
        toast.error((res?.error as IErrorResponse)?.data?.message || 'Failed to delete!');
      } else {
        toast.success('Delete success!');
        setSelected([]);
      }
      confirm.onFalse();
    } catch (err) {
      toast.error((typeof err === 'string' ? err : err.message) || 'Failed to delete!');
    }
  }, [deleteImages, selected, setSelected, confirm]);

  // JSX
  const renderFilters = (
    <Stack
      spacing={2}
      direction={{ xs: 'column', md: 'row' }}
      alignItems={{ xs: 'flex-end', md: 'center' }}
    >
      <MediaFilters
        types={types}
        setTypes={setTypes}
        searchText={searchText}
        setSearchText={setSearchText}
        queryParams={queryParams}
        setQueryparams={setQueryParams}
        onResetPage={onResetPage}
        openFromDate={openFromDate.value}
        onOpenFromDate={openFromDate.onTrue}
        onCloseFromDate={openFromDate.onFalse}
        openToDate={openToDate.value}
        onOpenToDate={openToDate.onTrue}
        onCloseToDate={openToDate.onFalse}
        options={{ types: MEDIA_FILTER_OPTIONS }}
      />

      <ToggleButtonGroup size="small" value={view} exclusive onChange={handleChangeView}>
        <ToggleButton value="list">
          <Iconify icon="solar:list-bold" />
        </ToggleButton>

        <ToggleButton value="grid">
          <Iconify icon="mingcute:dot-grid-fill" />
        </ToggleButton>
      </ToggleButtonGroup>
    </Stack>
  );

  const renderResults = (
    <MediaFiltersResult
      setSearchText={setSearchText}
      queryParams={queryParams}
      setQueryparams={setQueryParams}
      searchText={searchText}
      types={types}
      setTypes={setTypes}
      totalResults={images?.meta?.total || 0}
      onResetPage={onResetPage}
    />
  );

  if (getImagesLoading) {
    return (
      <LoadingScreen sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }} />
    );
  }
  if (isError || !images) {
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
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography variant="h4">Media</Typography>
          <Button
            variant="contained"
            startIcon={<Iconify icon="eva:cloud-upload-fill" />}
            onClick={upload.onTrue}
          >
            Upload
          </Button>
        </Stack>

        <Stack spacing={2.5} sx={{ my: { xs: 3, md: 5 } }}>
          {renderFilters}
          {canReset && renderResults}
        </Stack>

        {view === 'list' ? (
          <MediaTable
            table={table}
            dataFiltered={images.data}
            onDeleteRow={handleDeleteItem}
            notFound={notFound}
            onOpenConfirm={confirm.onTrue}
            deleteLoading={deleteLoading}
          />
        ) : (
          <MediaGridView
            table={table}
            total={images.meta.total}
            dataFiltered={images.data}
            onDeleteItem={handleDeleteItem}
            onOpenConfirm={confirm.onTrue}
            deleteLoading={deleteLoading}
          />
        )}
        <TablePaginationCustom
          page={page}
          rowsPerPage={images.meta.limit}
          count={images.meta.total}
          onPageChange={onChangePage}
          onRowsPerPageChange={onChangeRowsPerPage}
          sx={{ [`& .${tablePaginationClasses.toolbar}`]: { borderTopColor: 'transparent' } }}
        />
      </DashboardContent>

      <MediaUploadDialog open={upload.value} onClose={upload.onFalse} />

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content={
          <>
            Are you sure want to delete <strong> {selected.length} </strong>{' '}
            {selected.length === 1 ? 'image' : 'images'} ?
          </>
        }
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              handleDeleteItems();
            }}
            disabled={deleteLoading}
          >
            {deleteLoading ? 'Deleting...' : 'Delete'}
          </Button>
        }
      />
    </>
  );
}
