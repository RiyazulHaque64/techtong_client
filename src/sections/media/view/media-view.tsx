import type { TQueryParam, IErrorResponse } from 'src/redux/interfaces/common';

import { useState, useCallback } from 'react';

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

import { useBoolean } from 'src/hooks/use-boolean';
import { useDebounce } from 'src/hooks/use-debounce';

import { DashboardContent } from 'src/layouts/dashboard';
import { useGetImagesQuery, useDeleteImagesMutation } from 'src/redux/features/image/imageApi';

import { toast } from 'src/components/snackbar';
import { useTable } from 'src/components/table';
import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { LoadingScreen } from 'src/components/loading-screen';

import { FetchingError } from 'src/sections/error/fetching-error';

import { MediaTable } from '../media-table';
import { MediaFilters } from '../media-filters';
import { MediaGridView } from '../media-grid-view';
import { MediaFiltersResult } from '../media-filters-result';
import { MEDIA_FILTER_OPTIONS } from '../media-filters-options';
import { MediaNewFolderDialog } from '../media-new-folder-dialog';

// ----------------------------------------------------------------------

export function MediaView() {
  const table = useTable({ defaultRowsPerPage: 10, defaultOrder: 'desc' });

  const [searchText, setSearchText] = useState<string>('');
  const [types, setTypes] = useState<string[]>([]);
  const [queryParams, setQueryParams] = useState<TQueryParam[]>([]);

  const searchTerm = useDebounce(searchText, 500);

  const [deleteImages, { isLoading: deleteLoading }] = useDeleteImagesMutation();
  const {
    data: images,
    isLoading: getImagesLoading,
    isError,
    error,
  } = useGetImagesQuery([
    ...queryParams,
    { name: 'page', value: table.page + 1 },
    { name: 'limit', value: table.rowsPerPage },
    {
      name: 'sortBy',
      value: table.orderBy,
    },
    {
      name: 'sortOrder',
      value: table.order,
    },
    { name: 'searchTerm', value: searchTerm },
    { name: 'type', value: types.join(',') },
  ]);

  const openFromDate = useBoolean();
  const openToDate = useBoolean();

  const confirm = useBoolean();

  const upload = useBoolean();

  const [view, setView] = useState('list');

  // const [tableData, setTableData] = useState<IFile[]>(_allFiles);

  const canReset =
    !!searchText ||
    types.length > 0 ||
    !!queryParams.find((param) => param.name === 'fromDate')?.value ||
    !!queryParams.find((param) => param.name === 'toDate')?.value;

  const notFound = (!images?.data?.length && canReset) || !images?.data?.length;

  // Handler
  const handleChangeView = useCallback(
    (event: React.MouseEvent<HTMLElement>, newView: string | null) => {
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
      const res = await deleteImages({ images_path: table.selected });
      if (res?.error) {
        toast.error((res?.error as IErrorResponse)?.data?.message || 'Failed to delete!');
      } else {
        toast.success('Delete success!');
        table.setSelected([]);
      }
      confirm.onFalse();
    } catch (err) {
      toast.error((typeof err === 'string' ? err : err.message) || 'Failed to delete!');
    }
  }, [deleteImages, table, confirm]);

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
        onResetPage={table.onResetPage}
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
      onResetPage={table.onResetPage}
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
            meta={images.meta}
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
            dataFiltered={images.data}
            onDeleteItem={handleDeleteItem}
            onOpenConfirm={confirm.onTrue}
            deleteLoading={deleteLoading}
          />
        )}
      </DashboardContent>

      <MediaNewFolderDialog open={upload.value} onClose={upload.onFalse} />

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content={
          <>
            Are you sure want to delete <strong> {table.selected.length} </strong>{' '}
            {table.selected.length === 1 ? 'image' : 'images'} ?
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
