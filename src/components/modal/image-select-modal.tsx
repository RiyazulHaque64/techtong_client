import type { DialogProps } from '@mui/material/Dialog';
import type { IErrorResponse } from 'src/redux/interfaces/common';

import { useState, useCallback } from 'react';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import { grey } from '@mui/material/colors';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import { Tab, Box, Tabs, Alert, Stack, IconButton } from '@mui/material';

import { varAlpha } from 'src/theme/styles';
import { useUploadImagesMutation } from 'src/redux/features/image/imageApi';

import { Iconify } from 'src/components/iconify';

import { Upload } from '../upload';
import { MultiFilePreview } from '../upload/components/preview-multi-file';

// ----------------------------------------------------------------------

type Props = DialogProps & {
  open: boolean;
  onClose: () => void;
  title?: string;
};

export function ImageSelectModal({ open, onClose, title = 'Select Image', ...other }: Props) {
  const [uploadImages, { isLoading }] = useUploadImagesMutation();

  const [selectedTab, setSelectedTab] = useState<string>('library');
  const [files, setFiles] = useState<(File | string)[]>([]);
  const [errorMsg, setErrorMsg] = useState<string>('');

  const handleChangeTab = useCallback((event: React.SyntheticEvent, newValue: string) => {
    setSelectedTab(newValue);
  }, []);

  const handleDrop = useCallback(
    (acceptedFiles: File[]) => {
      setFiles([...files, ...acceptedFiles]);
    },
    [files]
  );

  const handleRemoveFile = (inputFile: File | string) => {
    const filtered = files.filter((file) => file !== inputFile);
    setFiles(filtered);
  };

  const handleUpload = async () => {
    try {
      if (!files.length) {
        setSelectedTab('library');
        return;
      }
      const formData = new FormData();
      files.forEach((file) => formData.append('images', file));
      const res = await uploadImages(formData);
      if (res?.error) {
        setErrorMsg((res?.error as IErrorResponse)?.data?.message);
      } else {
        setSelectedTab('library');
      }
    } catch (err) {
      setErrorMsg(typeof err === 'string' ? err : err.message);
    }
  };

  return (
    <Dialog
      fullWidth
      open={open}
      onClose={onClose}
      {...other}
      sx={{ '& .MuiDialog-paper': { minWidth: '94%', height: 'calc(100vh - 120px)' } }}
    >
      <DialogTitle sx={{ p: (theme) => theme.spacing(3, 3, 2, 3) }}> {title}</DialogTitle>
      <IconButton
        aria-label="close"
        onClick={onClose}
        sx={(theme) => ({
          position: 'absolute',
          right: 8,
          top: 8,
          color: theme.palette.grey[500],
        })}
      >
        <Iconify icon="line-md:close" sx={{ color: 'text.secondary' }} />
      </IconButton>
      <DialogContent dividers sx={{ pt: 1, pb: 0, border: 'none' }}>
        <Tabs
          value={selectedTab}
          onChange={handleChangeTab}
          sx={{
            px: 2.5,
            boxShadow: (theme) =>
              `inset 0 -2px 0 0 ${varAlpha(theme.vars.palette.grey['500Channel'], 0.08)}`,
          }}
        >
          <Tab
            iconPosition="start"
            value="library"
            label="Library"
            icon={<Iconify icon="ic:round-perm-media" />}
          />
          <Tab
            iconPosition="start"
            value="upload"
            label="Upload"
            icon={<Iconify icon="eva:cloud-upload-fill" />}
          />
        </Tabs>
        <Box
          sx={{
            maxHeight: 'calc(100vh - 380px)',
            overflowY: 'auto',
            my: 3,
            '&::-webkit-scrollbar': {
              width: '6px',
            },
            '&::-webkit-scrollbar-track': {
              backgroundColor: '#ffffff',
              borderRadius: '8px',
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: grey[400],
              borderRadius: '8px',
            },
            '&::-webkit-scrollbar-thumb:hover': {
              backgroundColor: grey[500],
            },
          }}
        >
          {selectedTab === 'upload' && (
            <>
              {!!errorMsg && (
                <Alert severity="error" sx={{ width: { xs: '90%', sm: '95%', md: '97%' }, ml: 2 }}>
                  {errorMsg}
                </Alert>
              )}
              <Stack direction={{ xs: 'column', md: 'row' }} gap={2} sx={{ p: 2 }}>
                <Box sx={{ width: { xs: '100%', md: `${files.length > 0 ? '30%' : '100%'}` } }}>
                  <Upload
                    multiple
                    accept={{ 'image/*': [] }}
                    value={files}
                    onDrop={handleDrop}
                    onRemove={handleRemoveFile}
                    previewMultiFile={false}
                    showSubHeading={false}
                  />
                </Box>
                {files.length > 0 && (
                  <Box sx={{ width: { xs: '100%', md: '70%' } }}>
                    <MultiFilePreview files={files} thumbnail={false} onRemove={handleRemoveFile} />
                  </Box>
                )}
              </Stack>
            </>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        {selectedTab === 'upload' ? (
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
        ) : (
          <Button variant="contained" startIcon={<Iconify icon="eva:cloud-upload-fill" />}>
            Select
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
