import type { BoxProps } from '@mui/material/Box';
import type { Theme, SxProps } from '@mui/material/styles';

// ----------------------------------------------------------------------

export interface ExtendFile extends File {
  path?: string;
  preview?: string;
  lastModifiedDate?: Date;
}

export type FileThumbnailProps = BoxProps & {
  tooltip?: boolean;
  file: File | string;
  type?: 'icon' | undefined | null;
  imageView?: boolean;
  sx?: SxProps<Theme>;
  onDownload?: () => void;
  onRemove?: () => void;
  slotProps?: {
    img?: SxProps<Theme>;
    icon?: SxProps<Theme>;
    removeBtn?: SxProps<Theme>;
    downloadBtn?: SxProps<Theme>;
  };
};
