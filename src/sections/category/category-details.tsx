import type { ICategory } from 'src/types/category';
import type { DrawerProps } from '@mui/material/Drawer';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Drawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import { useBoolean } from 'src/hooks/use-boolean';

import { fDateTime } from 'src/utils/format-time';

import { CONFIG } from 'src/config-global';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { FileThumbnail } from 'src/components/file-thumbnail';

// ----------------------------------------------------------------------

type Props = DrawerProps & {
  item: ICategory;
  onClose: () => void;
  onDelete: (id: string, close: () => void) => void;
  deleteLoading: boolean;
};

export function CategoryDetails({ item, open, onClose, onDelete, deleteLoading, ...other }: Props) {
  const { id, title, slug, icon, description, created_at, updated_at } = item;

  const confirm = useBoolean();

  const renderProperties = (
    <Stack spacing={1.5}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ typography: 'subtitle2' }}
      >
        Details
      </Stack>

      <Stack direction="row" sx={{ typography: 'caption', textTransform: 'capitalize' }}>
        <Box component="span" sx={{ width: 80, color: 'text.secondary', mr: 2 }}>
          Name
        </Box>
        {title}
      </Stack>

      <Stack direction="row" sx={{ typography: 'caption', textTransform: 'capitalize' }}>
        <Box component="span" sx={{ width: 80, color: 'text.secondary', mr: 2 }}>
          Slug
        </Box>
        {slug}
      </Stack>

      <Stack direction="row" sx={{ typography: 'caption', textTransform: 'capitalize' }}>
        <Box component="span" sx={{ width: 80, color: 'text.secondary', mr: 2 }}>
          Description
        </Box>
        {description}
      </Stack>

      <Stack direction="row" sx={{ typography: 'caption', textTransform: 'capitalize' }}>
        <Box component="span" sx={{ width: 80, color: 'text.secondary', mr: 2 }}>
          Created at
        </Box>
        {fDateTime(created_at)}
      </Stack>

      <Stack direction="row" sx={{ typography: 'caption', textTransform: 'capitalize' }}>
        <Box component="span" sx={{ width: 80, color: 'text.secondary', mr: 2 }}>
          Modified at
        </Box>
        {fDateTime(updated_at)}
      </Stack>
    </Stack>
  );

  return (
    <>
      <Drawer
        open={open}
        onClose={onClose}
        anchor="right"
        slotProps={{ backdrop: { invisible: true } }}
        PaperProps={{ sx: { width: 320 } }}
        {...other}
      >
        <Scrollbar>
          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ p: 2.5 }}>
            <Typography variant="h6"> Brand Details </Typography>
            <IconButton aria-label="edit_name" size="small" onClick={onClose}>
              <Iconify icon="akar-icons:cross" sx={{ width: '14px', height: '14px' }} />
            </IconButton>
          </Stack>

          <Stack
            spacing={2.5}
            justifyContent="center"
            sx={{ p: 2.5, bgcolor: 'background.neutral' }}
          >
            <FileThumbnail
              imageView
              file={`${CONFIG.bucket.url}/${CONFIG.bucket.name}/${icon}`}
              sx={{ width: 'auto', height: 'auto', alignSelf: 'flex-start' }}
              slotProps={{
                img: {
                  width: 320,
                  height: 'auto',
                  aspectRatio: '4/3',
                  objectFit: 'cover',
                },
                icon: { width: 64, height: 64 },
              }}
            />

            <Divider sx={{ borderStyle: 'dashed' }} />

            {renderProperties}
          </Stack>
        </Scrollbar>

        <Box sx={{ p: 2.5 }}>
          <Button
            fullWidth
            variant="soft"
            color="error"
            size="large"
            startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
            onClick={() => {
              confirm.onTrue();
            }}
          >
            Delete
          </Button>
        </Box>
      </Drawer>
      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content="Are you sure want to delete?"
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => onDelete(id, confirm.onFalse)}
            disabled={deleteLoading}
          >
            {deleteLoading ? 'Deleting...' : 'Delete'}
          </Button>
        }
      />
    </>
  );
}
