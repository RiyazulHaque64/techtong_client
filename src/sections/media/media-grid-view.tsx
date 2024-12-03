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
import { MediaActionSelected } from './media-action-selected';
import { MediaNewFolderDialog } from './media-new-folder-dialog';

// ----------------------------------------------------------------------

type Props = {
  table: TableProps;
  dataFiltered: IImage[];
  onOpenConfirm: () => void;
  onDeleteItem: (path: string, close: () => void) => void;
  deleteLoading: boolean;
};

export function MediaGridView({
  table,
  dataFiltered,
  onDeleteItem,
  onOpenConfirm,
  deleteLoading,
}: Props) {
  const { selected, onSelectRow: onSelectItem, onSelectAllRows: onSelectAllItems } = table;

  const files = useBoolean();

  const upload = useBoolean();

  const containerRef = useRef(null);

  return (
    <>
      <Box ref={containerRef}>
        <MediaPanel
          title="Files"
          subtitle={`${dataFiltered.filter((item) => item.type !== 'folder').length} files`}
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
            {dataFiltered
              .filter((i) => i.type !== 'folder')
              .map((file) => (
                <MediaFileItem
                  key={file.id}
                  file={file}
                  selected={selected.includes(file.id)}
                  onSelect={() => onSelectItem(file.id)}
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
                dataFiltered.map((row) => row.id)
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
      <MediaNewFolderDialog open={upload.value} onClose={upload.onFalse} />
    </>
  );
}
