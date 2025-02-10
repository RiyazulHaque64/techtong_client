import type { IImage } from 'src/types/image';
import type { CardProps } from '@mui/material/Card';

import Box from '@mui/material/Box';
import { Grid } from '@mui/material';
import { grey } from '@mui/material/colors';
import Checkbox from '@mui/material/Checkbox';

import { useBoolean } from 'src/hooks/use-boolean';

import { CONFIG } from 'src/config-global';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

type Props = CardProps & {
  selected?: boolean;
  file: IImage;
  onSelect?: () => void;
  currentSelected: IImage | null;
  setCurrentSelected: React.Dispatch<React.SetStateAction<IImage | null>>;
};

export function ImageItem({
  file,
  selected,
  onSelect,
  currentSelected,
  setCurrentSelected,
  sx,
  ...other
}: Props) {
  const checkbox = useBoolean();

  const renderAction = (
    <Box
      onMouseEnter={checkbox.onTrue}
      onMouseLeave={checkbox.onFalse}
      sx={{
        display: 'inline-flex',
        width: 36,
        height: 36,
        position: 'absolute',
        top: 10,
        left: 10,
      }}
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
  );

  return (
    <Grid item xs={6} sm={4} md={3}>
      <Box
        sx={{
          position: 'relative',
          aspectRatio: '3 / 2',
          overflow: 'hidden',
          borderRadius: 2,
          boxShadow: 1,
          cursor: 'pointer',
          backgroundColor: grey[50],
          transition: 'transform 0.3s ease',
          transform: currentSelected?.id === file.id ? 'scale(1.05)' : 'none',
          border: (theme) =>
            currentSelected?.id === file.id ? `3px solid ${theme.palette.grey[300]}` : 'none',
          '&:hover': {
            transform: 'scale(1.05)',
          },
        }}
        onClick={() => setCurrentSelected(file)}
      >
        <img
          src={`${CONFIG.bucket.url}/${CONFIG.bucket.general_bucket}/${file.path}`}
          alt={file.alt_text || file.name}
          style={{
            objectFit: 'cover',
            transition: 'opacity 0.3s ease',
            opacity: currentSelected?.id === file.id ? 0.8 : 1,
          }}
        />
        {renderAction}
      </Box>
    </Grid>
  );
}
