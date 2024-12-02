import type { IFile } from 'src/types/file';
import type { TableProps } from 'src/components/table';

import { useRef, useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Collapse from '@mui/material/Collapse';

import { useBoolean } from 'src/hooks/use-boolean';

import { Iconify } from 'src/components/iconify';

import { MediaPanel } from './media-panel';
import { MediaFileItem } from './media-file-item';
import { MediaShareDialog } from './media-share-dialog';
import { MediaActionSelected } from './media-action-selected';
import { MediaNewFolderDialog } from './media-new-folder-dialog';

// ----------------------------------------------------------------------

type Props = {
  table: TableProps;
  dataFiltered: IFile[];
  onOpenConfirm: () => void;
  onDeleteItem: (id: string) => void;
};

export function MediaGridView({ table, dataFiltered, onDeleteItem, onOpenConfirm }: Props) {
  const { selected, onSelectRow: onSelectItem, onSelectAllRows: onSelectAllItems } = table;

  const share = useBoolean();

  const files = useBoolean();

  const upload = useBoolean();

  const containerRef = useRef(null);

  const [inviteEmail, setInviteEmail] = useState('');

  const handleChangeInvite = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setInviteEmail(event.target.value);
  }, []);

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
                  onDelete={() => onDeleteItem(file.id)}
                  sx={{ maxWidth: 'auto' }}
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
              <>
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

                <Button
                  color="primary"
                  size="small"
                  variant="contained"
                  startIcon={<Iconify icon="solar:share-bold" />}
                  onClick={share.onTrue}
                >
                  Share
                </Button>
              </>
            }
          />
        )}
      </Box>

      <MediaShareDialog
        open={share.value}
        inviteEmail={inviteEmail}
        onChangeInvite={handleChangeInvite}
        onClose={() => {
          share.onFalse();
          setInviteEmail('');
        }}
      />

      <MediaNewFolderDialog open={upload.value} onClose={upload.onFalse} />
    </>
  );
}
