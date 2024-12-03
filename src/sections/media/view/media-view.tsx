import type { IFile, IImageFilters } from 'src/types/file';
import type { IErrorResponse } from 'src/redux/interfaces/common';

import { useState, useEffect, useCallback } from 'react';

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

import { useBoolean } from 'src/hooks/use-boolean';
import { useSetState } from 'src/hooks/use-set-state';

import { fIsAfter } from 'src/utils/format-time';

import { _allFiles } from 'src/_mock';
import { DashboardContent } from 'src/layouts/dashboard';
import { useGetImagesQuery, useDeleteImagesMutation } from 'src/redux/features/image/imageApi';

import { toast } from 'src/components/snackbar';
import { useTable } from 'src/components/table';
import { Iconify } from 'src/components/iconify';
import { EmptyContent } from 'src/components/empty-content';
import { ConfirmDialog } from 'src/components/custom-dialog';

import { MediaTable } from '../media-table';
import { MediaFilters } from '../media-filters';
import { MediaGridView } from '../media-grid-view';
import { MediaFiltersResult } from '../media-filters-result';
import { MEDIA_FILTER_OPTIONS } from '../media-filters-options';
import { MediaNewFolderDialog } from '../media-new-folder-dialog';

// ----------------------------------------------------------------------

export function MediaView() {
  const table = useTable({ defaultRowsPerPage: 10, defaultOrder: 'desc' });

  const queryParams = [
    { name: 'page', value: table.page },
    { name: 'limit', value: table.rowsPerPage },
    {
      name: 'sortBy',
      value: table.orderBy,
    },
    {
      name: 'sortOrder',
      value: table.order,
    },
  ];

  const [deleteImages, { isLoading: deleteLoading }] = useDeleteImagesMutation();
  const { data: images } = useGetImagesQuery(queryParams);

  const openDateRange = useBoolean();

  const confirm = useBoolean();

  const upload = useBoolean();

  const [view, setView] = useState('list');

  const [tableData, setTableData] = useState<IFile[]>(_allFiles);

  const filters = useSetState<IImageFilters>({
    searchTerm: '',
    type: [],
    fromDate: null,
    toDate: null,
  });

  console.log(filters.state);

  const dateError = fIsAfter(filters.state.fromDate, filters.state.toDate);

  const canReset =
    !!filters.state.searchTerm ||
    filters.state.type.length > 0 ||
    (!!filters.state.fromDate && !!filters.state.toDate);

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

  const handleDeleteItems = useCallback(() => {
    const deleteRows = tableData.filter((row) => !table.selected.includes(row.id));

    toast.success('Delete success!');

    setTableData(deleteRows);
  }, [table.selected, tableData]);

  // Effect
  useEffect(() => {}, []);

  // JSX
  const renderFilters = (
    <Stack
      spacing={2}
      direction={{ xs: 'column', md: 'row' }}
      alignItems={{ xs: 'flex-end', md: 'center' }}
    >
      <MediaFilters
        filters={filters}
        dateError={dateError}
        onResetPage={table.onResetPage}
        openDateRange={openDateRange.value}
        onOpenDateRange={openDateRange.onTrue}
        onCloseDateRange={openDateRange.onFalse}
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
    <MediaFiltersResult filters={filters} totalResults={2} onResetPage={table.onResetPage} />
  );

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

        {notFound ? (
          <EmptyContent filled sx={{ py: 10 }} />
        ) : (
          <>
            {view === 'list' ? (
              <MediaTable
                table={table}
                dataFiltered={images?.data}
                onDeleteRow={handleDeleteItem}
                notFound={notFound}
                onOpenConfirm={confirm.onTrue}
                deleteLoading={deleteLoading}
              />
            ) : (
              <MediaGridView
                table={table}
                dataFiltered={images?.data}
                onDeleteItem={handleDeleteItem}
                onOpenConfirm={confirm.onTrue}
                deleteLoading={deleteLoading}
              />
            )}
          </>
        )}
      </DashboardContent>

      <MediaNewFolderDialog open={upload.value} onClose={upload.onFalse} />

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
              handleDeleteItems();
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
