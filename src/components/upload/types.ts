import type { BoxProps } from '@mui/material';
import type { DropzoneOptions } from 'react-dropzone';
import type { Theme, SxProps } from '@mui/material/styles';

import type { FileThumbnailProps } from '../file-thumbnail';

export type FileUploadType = File | string | null;

export type FilesUploadType = (File | string)[];

export type UploadProps = DropzoneOptions & {
  error?: boolean;
  sx?: SxProps<Theme>;
  className?: string;
  thumbnail?: boolean;
  onDelete?: () => void;
  onUpload?: () => void;
  onRemoveAll?: () => void;
  helperText?: React.ReactNode;
  placeholder?: React.ReactNode;
  value?: FileUploadType | FilesUploadType;
  onRemove?: (file: File | string) => void;
  previewMultiFile?: boolean;
  showSubHeading?: boolean;
};

export type MultiFilePreviewProps = BoxProps & {
  files: FilesUploadType;
  lastNode?: React.ReactNode;
  firstNode?: React.ReactNode;
  onRemove: UploadProps['onRemove'];
  thumbnail: UploadProps['thumbnail'];
  slotProps?: {
    thumbnail?: Omit<FileThumbnailProps, 'file'>;
  };
};

export type SingleFilePreviewProps = BoxProps & {
  file: File | string;
};
