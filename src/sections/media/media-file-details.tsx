import type { IImage } from 'src/types/image';
import type { DrawerProps } from '@mui/material/Drawer';
import type { IErrorResponse } from 'src/redux/interfaces/common';

import { toast } from 'sonner';
import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Drawer from '@mui/material/Drawer';
import { TextField } from '@mui/material';
import Divider from '@mui/material/Divider';
import { useTheme } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import { useBoolean } from 'src/hooks/use-boolean';

import { fData } from 'src/utils/format-number';
import { fDateTime } from 'src/utils/format-time';

import { CONFIG } from 'src/config-global';
import { useUpdateImageMutation } from 'src/redux/features/image/imageApi';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { fileFormat, FileThumbnail } from 'src/components/file-thumbnail';

// ----------------------------------------------------------------------

type Props = DrawerProps & {
  item: IImage;
  onClose: () => void;
  onDelete: (id: string, close: () => void) => void;
  onCopyLink: () => void;
  deleteLoading: boolean;
};

export function MediaFileDetails({
  item,
  open,
  onClose,
  onDelete,
  onCopyLink,
  deleteLoading,
  ...other
}: Props) {
  const { id, name, size, path, type, width, height, user, alt_text, created_at } = item;

  const [updateImage] = useUpdateImageMutation();

  const theme = useTheme();
  const properties = useBoolean(true);
  const altText = useBoolean(true);
  const confirm = useBoolean();
  const editAltText = useBoolean();
  const editName = useBoolean();

  const [newName, setNewName] = useState<string>('');
  const [newAltText, setNewAltText] = useState<string>('');

  const handleUpdateImage = useCallback(
    async (idToUpdate: string, data: Record<string, string>) => {
      try {
        const res = await updateImage({ id: idToUpdate, data });
        if (res?.error) {
          toast.error((res?.error as IErrorResponse)?.data?.message || 'Failed to delete!');
        } else {
          editAltText.onFalse();
          editName.onFalse();
          setNewAltText('');
          setNewName('');
        }
      } catch (err) {
        toast.error((typeof err === 'string' ? err : err.message) || 'Failed to delete!');
      }
    },
    [updateImage, editAltText, editName]
  );

  const renderProperties = (
    <Stack spacing={1.5}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ typography: 'subtitle2' }}
      >
        Properties
        <IconButton size="small" onClick={properties.onToggle}>
          <Iconify
            icon={properties.value ? 'eva:arrow-ios-upward-fill' : 'eva:arrow-ios-downward-fill'}
          />
        </IconButton>
      </Stack>

      {properties.value && (
        <>
          <Stack direction="row" sx={{ typography: 'caption', textTransform: 'capitalize' }}>
            <Box component="span" sx={{ width: 80, color: 'text.secondary', mr: 2 }}>
              Size
            </Box>
            {fData(size)}
          </Stack>

          <Stack direction="row" sx={{ typography: 'caption', textTransform: 'capitalize' }}>
            <Box component="span" sx={{ width: 80, color: 'text.secondary', mr: 2 }}>
              Modified
            </Box>
            {fDateTime(created_at)}
          </Stack>

          <Stack direction="row" sx={{ typography: 'caption', textTransform: 'capitalize' }}>
            <Box component="span" sx={{ width: 80, color: 'text.secondary', mr: 2 }}>
              Type
            </Box>
            {fileFormat(type)}
          </Stack>

          <Stack direction="row" sx={{ typography: 'caption', textTransform: 'capitalize' }}>
            <Box component="span" sx={{ width: 80, color: 'text.secondary', mr: 2 }}>
              Dimension (WxH)
            </Box>
            {`${width} x ${height} pixels`}
          </Stack>

          <Stack direction="row" sx={{ typography: 'caption', textTransform: 'capitalize' }}>
            <Box component="span" sx={{ width: 80, color: 'text.secondary', mr: 2 }}>
              Uploaded by
            </Box>
            {user?.name || 'Unknown'}
          </Stack>
        </>
      )}
    </Stack>
  );

  const renderAltText = (
    <Stack spacing={1.5}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ typography: 'subtitle2' }}
      >
        Alter text
        <IconButton size="small" onClick={altText.onToggle}>
          <Iconify
            icon={altText.value ? 'eva:arrow-ios-upward-fill' : 'eva:arrow-ios-downward-fill'}
          />
        </IconButton>
      </Stack>

      {altText.value && (
        <Stack direction="row" alignItems="center" gap={1}>
          {editAltText.value ? (
            <>
              <TextField
                variant="outlined"
                value={newAltText}
                onChange={(e) => setNewAltText(e.target.value)}
                size="small"
                sx={{ width: '90%', '& .MuiOutlinedInput-input': { padding: '4px 10px' } }}
                onBlur={() => handleUpdateImage(id, { alt_text: newAltText })}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleUpdateImage(id, { alt_text: newAltText });
                  }
                }}
              />
              <IconButton
                aria-label="edit_name"
                size="small"
                sx={{
                  width: '10%',
                  color: theme.palette.primary.dark,
                  '&:hover': { backgroundColor: theme.palette.primary.lighter },
                }}
                onClick={() => handleUpdateImage(id, { alt_text: newAltText })}
              >
                <Iconify icon="hugeicons:tick-04" />
              </IconButton>
            </>
          ) : (
            <>
              <Typography variant="body2">{alt_text}</Typography>
              <IconButton
                aria-label="edit_alt_text"
                size="small"
                sx={{
                  color: theme.palette.primary.dark,
                  '&:hover': { backgroundColor: theme.palette.primary.lighter },
                }}
                onClick={() => {
                  setNewAltText(alt_text);
                  editAltText.onTrue();
                }}
              >
                <Iconify icon="mdi:edit-outline" />
              </IconButton>
            </>
          )}
        </Stack>
      )}
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
            <Typography variant="h6"> Image Details </Typography>
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
              file={`${CONFIG.bucket.url}/${CONFIG.bucket.general_bucket}/${path}`}
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

            <Stack direction="row" alignItems="center" gap={1}>
              {editName.value ? (
                <>
                  <TextField
                    variant="outlined"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    size="small"
                    sx={{ width: '90%', '& .MuiOutlinedInput-input': { padding: '4px 10px' } }}
                    onBlur={() => handleUpdateImage(id, { name: newName })}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleUpdateImage(id, { name: newName });
                      }
                    }}
                  />
                  <IconButton
                    aria-label="edit_name"
                    size="small"
                    sx={{
                      width: '10%',
                      color: theme.palette.primary.dark,
                      '&:hover': { backgroundColor: theme.palette.primary.lighter },
                    }}
                    onClick={() => handleUpdateImage(id, { name: newName })}
                  >
                    <Iconify icon="hugeicons:tick-04" />
                  </IconButton>
                </>
              ) : (
                <>
                  <Typography variant="subtitle1" sx={{ wordBreak: 'break-all' }}>
                    {name}
                  </Typography>
                  <IconButton
                    aria-label="edit_name"
                    size="small"
                    sx={{
                      color: theme.palette.primary.dark,
                      '&:hover': { backgroundColor: theme.palette.primary.lighter },
                    }}
                    onClick={() => {
                      setNewName(name);
                      editName.onTrue();
                    }}
                  >
                    <Iconify icon="mdi:edit-outline" />
                  </IconButton>
                </>
              )}
            </Stack>

            <Divider sx={{ borderStyle: 'dashed' }} />

            {renderProperties}

            {renderAltText}
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
            onClick={() => onDelete(path, confirm.onFalse)}
            disabled={deleteLoading}
          >
            {deleteLoading ? 'Deleting...' : 'Delete'}
          </Button>
        }
      />
    </>
  );
}
