import type { DialogProps } from '@mui/material/Dialog';
import type { IErrorResponse } from 'src/redux/interfaces/common';

import { useState, useEffect, useCallback } from 'react';

import { Alert } from '@mui/material';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import TextField from '@mui/material/TextField';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import { useUploadImagesMutation } from 'src/redux/features/image/imageApi';

import { Upload } from 'src/components/upload';
import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

type Props = DialogProps & {
  open: boolean;
  title?: string;
  folderName?: string;
  onClose: () => void;
  onCreate?: () => void;
  onUpdate?: () => void;
  onChangeFolderName?: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export function MediaNewFolderDialog({
  open,
  onClose,
  onCreate,
  onUpdate,
  folderName,
  onChangeFolderName,
  title = 'Upload files',
  ...other
}: Props) {
  const [uploadImages, { isLoading }] = useUploadImagesMutation();
  const [files, setFiles] = useState<(File | string)[]>([]);
  const [errorMsg, setErrorMsg] = useState<string>('');

  useEffect(() => {
    if (!open) {
      setFiles([]);
    }
  }, [open]);

  const handleDrop = useCallback(
    (acceptedFiles: File[]) => {
      setFiles([...files, ...acceptedFiles]);
    },
    [files]
  );

  const handleUpload = async () => {
    try {
      if (!files.length) {
        onClose();
        return;
      }
      const formData = new FormData();
      files.forEach((file) => formData.append('images', file));
      const res = await uploadImages(formData);
      console.log('response: ', res);
      if (res?.error) {
        setErrorMsg((res?.error as IErrorResponse)?.data?.message);
      } else {
        onClose();
      }
    } catch (err) {
      setErrorMsg(typeof err === 'string' ? err : err.message);
    }
  };

  const handleRemoveFile = (inputFile: File | string) => {
    const filtered = files.filter((file) => file !== inputFile);
    setFiles(filtered);
  };

  const handleRemoveAllFiles = () => {
    setFiles([]);
  };

  return (
    <Dialog fullWidth maxWidth="sm" open={open} onClose={onClose} {...other}>
      <DialogTitle sx={{ p: (theme) => theme.spacing(3, 3, 2, 3) }}> {title}</DialogTitle>

      <DialogContent dividers sx={{ pt: 1, pb: 0, border: 'none' }}>
        {(onCreate || onUpdate) && (
          <TextField
            fullWidth
            label="Folder name"
            value={folderName}
            onChange={onChangeFolderName}
            sx={{ mb: 3 }}
          />
        )}
        {!!errorMsg && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {errorMsg}
          </Alert>
        )}

        <Upload
          multiple
          accept={{ 'image/*': [] }}
          value={files}
          onDrop={handleDrop}
          onRemove={handleRemoveFile}
        />
      </DialogContent>

      <DialogActions>
        <Button
          variant="contained"
          startIcon={<Iconify icon="eva:cloud-upload-fill" />}
          onClick={handleUpload}
          disabled={isLoading}
          sx={{
            ...(isLoading && {
              display: 'flex',
              width: '134px',
              justifyContent: 'flex-start',
              '&::after': {
                content: '"."',
                display: 'inline-block',
                ml: '2px',
                letterSpacing: '2px',
                animation: 'dots 1.5s steps(3, end) infinite',
              },
              '@keyframes dots': {
                '0%': { content: '"."' },
                '33%': { content: '".."' },
                '66%': { content: '"..."' },
                '100%': { content: '"."' },
              },
            }),
          }}
        >
          {isLoading ? 'Uploading' : 'Upload'}
        </Button>

        {!!files.length && (
          <Button
            variant="outlined"
            disabled={isLoading}
            color="inherit"
            onClick={handleRemoveAllFiles}
          >
            Remove all
          </Button>
        )}

        {(onCreate || onUpdate) && (
          <Stack direction="row" justifyContent="flex-end" flexGrow={1}>
            <Button variant="soft" onClick={onCreate || onUpdate}>
              {onUpdate ? 'Save' : 'Create'}
            </Button>
          </Stack>
        )}
      </DialogActions>
    </Dialog>
  );
}
