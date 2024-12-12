import type { IImage } from 'src/types/image';

import { Box, Stack } from '@mui/material';

import { fData } from 'src/utils/format-number';
import { fDateTime } from 'src/utils/format-time';

import { fileFormat } from 'src/components/file-thumbnail';

type Props = {
  currentSelected: IImage;
};

export function ImageDetails({ currentSelected }: Props) {
  return (
    <Stack spacing={1.5}>
      <Stack direction="row" sx={{ typography: 'caption', textTransform: 'capitalize' }}>
        <Box component="span" sx={{ width: 80, color: 'text.secondary', mr: 2 }}>
          Name
        </Box>
        {currentSelected.name}
      </Stack>
      <Stack direction="row" sx={{ typography: 'caption', textTransform: 'capitalize' }}>
        <Box component="span" sx={{ width: 80, color: 'text.secondary', mr: 2 }}>
          Alt text
        </Box>
        {currentSelected.alt_text}
      </Stack>
      <Stack direction="row" sx={{ typography: 'caption', textTransform: 'capitalize' }}>
        <Box component="span" sx={{ width: 80, color: 'text.secondary', mr: 2 }}>
          Size
        </Box>
        {fData(currentSelected.size)}
      </Stack>

      <Stack direction="row" sx={{ typography: 'caption', textTransform: 'capitalize' }}>
        <Box component="span" sx={{ width: 80, color: 'text.secondary', mr: 2 }}>
          Modified
        </Box>
        {fDateTime(currentSelected.created_at)}
      </Stack>

      <Stack direction="row" sx={{ typography: 'caption', textTransform: 'capitalize' }}>
        <Box component="span" sx={{ width: 80, color: 'text.secondary', mr: 2 }}>
          Type
        </Box>
        {fileFormat(currentSelected.type)}
      </Stack>

      <Stack direction="row" sx={{ typography: 'caption', textTransform: 'capitalize' }}>
        <Box component="span" sx={{ width: 80, color: 'text.secondary', mr: 2 }}>
          Dimension (WxH)
        </Box>
        {`${currentSelected.width} x ${currentSelected.height} pixels`}
      </Stack>

      <Stack direction="row" sx={{ typography: 'caption', textTransform: 'capitalize' }}>
        <Box component="span" sx={{ width: 80, color: 'text.secondary', mr: 2 }}>
          Uploaded by
        </Box>
        {currentSelected.user?.name || 'Unknown'}
      </Stack>
    </Stack>
  );
}
