import type { IImage } from 'src/types/image';
import type { TableProps } from 'src/components/table';

import { useRef } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Collapse from '@mui/material/Collapse';

import { useBoolean } from 'src/hooks/use-boolean';

import { Iconify } from 'src/components/iconify';

import { MediaPanel } from './media-panel';
import { MediaFileItem } from './media-file-item';
import { MediaUploadDialog } from './media-upload-dialog';
import { MediaActionSelected } from './media-action-selected';

// ----------------------------------------------------------------------

type Props = {
  total: number;
  dataFiltered: IImage[];
  onOpenConfirm: () => void;
  onDeleteItem: (path: string, close: () => void) => void;
  deleteLoading: boolean;
  table: TableProps;
};

export function MediaGridView({
  dataFiltered,
  onDeleteItem,
  onOpenConfirm,
  deleteLoading,
  total,
  table,
}: Props) {
  const { selected, onSelectRow: onSelectItem, onSelectAllRows: onSelectAllItems } = table;

  const files = useBoolean();

  const upload = useBoolean();

  const containerRef = useRef(null);

  return (
    <>
      <Box ref={containerRef}>
        <MediaPanel
          title="Images"
          subtitle={`${dataFiltered?.length} of ${total} images`}
          onOpen={upload.onTrue}
          collapse={files.value}
          onCollapse={files.onToggle}
        />
        <Collapse in={!files.value} unmountOnExit>
          <Box
            display="grid"
            gridTemplateColumns={{
              xs: 'repeat(1, 1fr)',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)',
              lg: 'repeat(4, 1fr)',
            }}
            gap={3}
          >
            {dataFiltered.map((file) => (
              <MediaFileItem
                key={file.id}
                file={file}
                selected={selected.includes(file.path)}
                onSelect={() => onSelectItem(file.path)}
                onDelete={onDeleteItem}
                sx={{ maxWidth: 'auto' }}
                deleteLoading={deleteLoading}
              />
            ))}
          </Box>
        </Collapse>
        {!!selected?.length && (
          <MediaActionSelected
            numSelected={selected.length}
            rowCount={dataFiltered.length}
            selected={selected}
            onSelectAllItems={(checked) =>
              onSelectAllItems(
                checked,
                dataFiltered.map((row) => row.path)
              )
            }
            action={
              <Button
                size="small"
                color="error"
                variant="contained"
                startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
                onClick={onOpenConfirm}
                sx={{ mr: 1 }}
              >
                Delete
              </Button>
            }
          />
        )}
      </Box>
      <MediaUploadDialog open={upload.value} onClose={upload.onFalse} />
    </>
  );
}
