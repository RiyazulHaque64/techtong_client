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
    <Grid
      item
      md={3}
      sx={{
        p: 0,
        cursor: 'pointer',
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
      onClick={() => {
        setCurrentSelected(file);
      }}
    >
      <Box
        component="img"
        sx={{
          display: 'block',
          maxWidth: '100%',
          overflow: 'hidden',
          width: '100%',
          borderRadius: '6px',
          height: '250px',
          objectFit: 'cover',
          border: currentSelected?.id === file.id ? `4px solid ${grey[300]}` : 'none',
        }}
        src={`${CONFIG.bucket.url}/${CONFIG.bucket.name}/${file.path}`}
        alt={file.alt_text || file.name}
      />
      {renderAction}
    </Grid>
  );
}
