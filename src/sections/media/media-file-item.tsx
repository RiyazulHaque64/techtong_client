import type { IImage } from 'src/types/image';
import type { CardProps } from '@mui/material/Card';

import { useCallback } from 'react';

import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import { useBoolean } from 'src/hooks/use-boolean';
import { useCopyToClipboard } from 'src/hooks/use-copy-to-clipboard';

import { fData } from 'src/utils/format-number';
import { fDateTime } from 'src/utils/format-time';

import { CONFIG } from 'src/config-global';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { usePopover, CustomPopover } from 'src/components/custom-popover';

import { MediaFileDetails } from './media-file-details';

// ----------------------------------------------------------------------

type Props = CardProps & {
  selected?: boolean;
  file: IImage;
  onDelete: (path: string, close: () => void) => void;
  onSelect?: () => void;
  deleteLoading: boolean;
};

export function MediaFileItem({
  file,
  selected,
  onSelect,
  onDelete,
  sx,
  deleteLoading,
  ...other
}: Props) {
  const confirm = useBoolean();

  const details = useBoolean();

  const popover = usePopover();

  const checkbox = useBoolean();

  const { copy } = useCopyToClipboard();

  const handleCopy = useCallback(() => {
    toast.success('Copied!');
    copy(`${CONFIG.bucket.url}/${CONFIG.bucket.name}/${file.path}`);
  }, [copy, file.path]);

  const renderAction = (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      sx={{ top: 0, right: 0, position: 'absolute', width: '100%', p: 1 }}
    >
      <Box
        onMouseEnter={checkbox.onTrue}
        onMouseLeave={checkbox.onFalse}
        sx={{ display: 'inline-flex', width: 36, height: 36 }}
      >
        <Checkbox
          checked={selected}
          onClick={onSelect}
          icon={<Iconify icon="eva:radio-button-off-fill" />}
          checkedIcon={<Iconify icon="eva:checkmark-circle-2-fill" />}
          inputProps={{ id: `item-checkbox-${file.id}`, 'aria-label': `Item checkbox` }}
          sx={{ width: 1, height: 1 }}
        />
      </Box>
      <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
        <Iconify icon="eva:more-vertical-fill" />
      </IconButton>
    </Stack>
  );

  const renderText = (
    <Box sx={{ width: '100%', p: 2 }}>
      <Typography
        variant="subtitle2"
        sx={{
          mb: '4px',
          width: 1,
          cursor: 'pointer',
        }}
        onClick={details.onTrue}
      >
        {file.name}
      </Typography>
      <Stack
        direction="row"
        alignItems="center"
        sx={{
          maxWidth: 0.99,
          whiteSpace: 'nowrap',
          typography: 'caption',
          color: 'text.disabled',
        }}
      >
        {fData(file.size)}
        <Box
          component="span"
          sx={{
            mx: 0.75,
            width: 2,
            height: 2,
            flexShrink: 0,
            borderRadius: '50%',
            bgcolor: 'currentColor',
          }}
        />
        <Typography noWrap component="span" variant="caption">
          {fDateTime(file.created_at)}
        </Typography>
      </Stack>
    </Box>
  );

  return (
    <>
      <Paper
        variant="outlined"
        sx={{
          p: 0,
          display: 'flex',
          borderRadius: '8px',
          position: 'relative',
          bgcolor: 'transparent',
          flexDirection: 'column',
          alignItems: 'flex-start',
          ...((checkbox.value || selected) && {
            bgcolor: 'background.paper',
            boxShadow: (theme) => theme.customShadows.z20,
          }),
          ...sx,
        }}
        {...other}
      >
        <Box
          component="img"
          sx={{
            display: 'block',
            maxWidth: '100%',
            overflow: 'hidden',
            width: '100%',
            borderRadius: '8px 8px 0px 0px',
            height: '250px',
            objectFit: 'cover',
          }}
          src={`${CONFIG.bucket.url}/${CONFIG.bucket.name}/${file.path}`}
          alt={file.alt_text || file.name}
        />
        {renderText}
        {renderAction}
      </Paper>

      <CustomPopover
        open={popover.open}
        anchorEl={popover.anchorEl}
        onClose={popover.onClose}
        slotProps={{ arrow: { placement: 'right-top' } }}
      >
        <MenuList>
          <MenuItem
            onClick={() => {
              popover.onClose();
              handleCopy();
            }}
          >
            <Iconify icon="eva:link-2-fill" />
            Copy Link
          </MenuItem>

          <MenuItem
            onClick={(e) => {
              popover.onClose();
              details.onTrue();
            }}
          >
            <Iconify icon="tabler:list-details" />
            Details
          </MenuItem>

          <Divider sx={{ borderStyle: 'dashed' }} />

          <MenuItem
            onClick={() => {
              confirm.onTrue();
              popover.onClose();
            }}
            sx={{ color: 'error.main' }}
          >
            <Iconify icon="solar:trash-bin-trash-bold" />
            Delete
          </MenuItem>
        </MenuList>
      </CustomPopover>

      <MediaFileDetails
        item={file}
        onCopyLink={handleCopy}
        open={details.value}
        onClose={details.onFalse}
        onDelete={() => {
          details.onFalse();
          onDelete(file.path, details.onFalse);
        }}
        deleteLoading={deleteLoading}
      />

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content="Are you sure want to delete?"
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => onDelete(file.path, confirm.onFalse)}
            disabled={deleteLoading}
          >
            {deleteLoading ? 'Deleting...' : 'Delete'}
          </Button>
        }
      />
    </>
  );
}
