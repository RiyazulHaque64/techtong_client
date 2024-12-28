import type { IImage } from 'src/types/image';
import type { Dispatch, SetStateAction } from 'react';
import type { DialogProps } from '@mui/material/Dialog';
import type { TQueryParam, IErrorResponse } from 'src/redux/interfaces/common';

import { useState, useCallback } from 'react';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import { grey } from '@mui/material/colors';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import { Tab, Box, Tabs, Card, Grid, Alert, Stack, IconButton } from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';
import { useDebounce } from 'src/hooks/use-debounce';

import { varAlpha } from 'src/theme/styles';
import { useGetImagesQuery, useUploadImagesMutation } from 'src/redux/features/image/imageApi';

import { Iconify } from 'src/components/iconify';

import { FetchingError } from 'src/sections/error/fetching-error';
import { MEDIA_FILTER_OPTIONS } from 'src/sections/media/media-filters-options';

import { Upload } from '../upload';
import { EmptyContent } from '../empty-content';
import { LoadingScreen } from '../loading-screen';
import { ImageItem } from './components/image-item';
import { ImageDetails } from './components/image-details';
import { ImageFiltersToolbar } from './components/image-filters-toolbar';
import { MultiFilePreview } from '../upload/components/preview-multi-file';

// ----------------------------------------------------------------------

type Props = DialogProps & {
  open: boolean;
  onClose: () => void;
  title?: string;
  selectedImages: string[];
  setSelectedImages: Dispatch<SetStateAction<string[]>>;
  multiple?: boolean;
};

export function ImageSelectModal({
  open,
  onClose,
  title = 'Select Image',
  selectedImages,
  setSelectedImages,
  multiple = true,
  ...other
}: Props) {
  const [uploadImages, { isLoading: uploadImageLoading }] = useUploadImagesMutation();

  const [selectedTab, setSelectedTab] = useState<string>('library');
  const [files, setFiles] = useState<(File | string)[]>([]);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [searchText, setSearchText] = useState<string>('');
  const [types, setTypes] = useState<string[]>([]);
  const [queryParams, setQueryParams] = useState<TQueryParam[]>([]);
  const [currentSelected, setCurrentSelected] = useState<IImage | null>(null);

  const searchTerm = useDebounce(searchText, 500);

  const {
    data: images,
    isLoading: getImagesLoading,
    error: getImagesError,
    isError: isGetImagesError,
  } = useGetImagesQuery([
    { name: 'limit', value: 50 },
    { name: 'searchTerm', value: searchTerm },
    { name: 'type', value: types.join(',') },
    ...queryParams,
  ]);

  const openFromDate = useBoolean();
  const openToDate = useBoolean();

  const onSelectImage = useCallback(
    (inputValue: IImage) => {
      if (multiple) {
        const newSelected = selectedImages.includes(inputValue.path)
          ? selectedImages.filter((value) => value !== inputValue.path)
          : [...selectedImages, inputValue.path];

        setSelectedImages(newSelected);
      } else {
        const path = selectedImages.includes(inputValue.path) ? [] : [inputValue.path];
        setSelectedImages(path);
      }
    },
    [selectedImages, setSelectedImages, multiple]
  );

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
      sx={{
        '& .MuiDialog-paper': { minWidth: '92%', height: 'calc(100vh - 100px)' },
      }}
    >
      <DialogTitle sx={{ p: (theme) => theme.spacing(3, 3, 2, 3) }}> {title}</DialogTitle>
      <IconButton
        aria-label="close"
        onClick={() => {
          onClose();
          setFiles([]);
          setCurrentSelected(null);
          setSearchText('');
          setTypes([]);
          setQueryParams([]);
          if (!multiple) {
            setSelectedImages([]);
          }
        }}
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
        <Stack direction={{ sm: 'column', md: 'row' }}>
          <Tabs
            value={selectedTab}
            onChange={handleChangeTab}
            sx={{
              px: 2.5,
              boxShadow: (theme) =>
                `inset 0 -2px 0 0 ${varAlpha(theme.vars.palette.grey['500Channel'], 0.08)}`,
              width: selectedTab === 'library' ? { sm: '100%', md: '30%' } : '100%',
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
          {selectedTab === 'library' && (
            <Stack
              sx={{
                width: { sm: '100%', md: '70%' },
                borderBottom: `2px solid ${grey[100]}`,
                p: { xs: 2, md: 0 },
              }}
            >
              <ImageFiltersToolbar
                types={types}
                setTypes={setTypes}
                searchText={searchText}
                setSearchText={setSearchText}
                queryParams={queryParams}
                setQueryparams={setQueryParams}
                openFromDate={openFromDate.value}
                onOpenFromDate={openFromDate.onTrue}
                onCloseFromDate={openFromDate.onFalse}
                openToDate={openToDate.value}
                onOpenToDate={openToDate.onTrue}
                onCloseToDate={openToDate.onFalse}
                options={{ types: MEDIA_FILTER_OPTIONS }}
              />
            </Stack>
          )}
        </Stack>
        <Stack direction="row">
          <Box
            sx={{
              width: selectedTab === 'library' && currentSelected ? '75%' : '100%',
              p: 1,
              maxHeight: 'calc(100vh - 356px)',
              overflowY: 'auto',
              mt: 4,
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
                  <Alert
                    severity="error"
                    sx={{ width: { xs: '80%', sm: '90%', md: '95%' }, ml: 4 }}
                  >
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
                      <MultiFilePreview
                        files={files}
                        thumbnail={false}
                        onRemove={handleRemoveFile}
                      />
                    </Box>
                  )}
                </Stack>
              </>
            )}

            {selectedTab === 'library' && (
              <>
                {getImagesLoading && (
                  <Stack sx={{ height: 'calc(100vh - 356px)' }}>
                    <LoadingScreen />
                  </Stack>
                )}
                {!getImagesLoading && isGetImagesError && (
                  <FetchingError errorResponse={(getImagesError as IErrorResponse).data} inModal />
                )}
                {!getImagesLoading && images?.data?.length === 0 && (
                  <Stack sx={{ height: 'calc(100vh - 356px)' }}>
                    <EmptyContent title="No image found" />
                  </Stack>
                )}
                <Grid container spacing={2}>
                  {images?.data?.map((image) => (
                    <ImageItem
                      currentSelected={currentSelected}
                      setCurrentSelected={setCurrentSelected}
                      file={image}
                      key={image.id}
                      onSelect={() => onSelectImage(image)}
                      selected={selectedImages.includes(image.path)}
                    />
                  ))}
                </Grid>
              </>
            )}
          </Box>
          {selectedTab === 'library' && currentSelected && (
            <Card
              sx={{
                width: '25%',
                height: 'calc(100vh - 356px)',
                p: 2,
                mx: 1,
                mt: 4,
              }}
            >
              <ImageDetails currentSelected={currentSelected} />
            </Card>
          )}
        </Stack>
      </DialogContent>
      <DialogActions>
        {selectedTab === 'upload' ? (
          <Button
            variant="contained"
            startIcon={<Iconify icon="eva:cloud-upload-fill" />}
            onClick={handleUpload}
            disabled={uploadImageLoading}
            sx={{
              ...(uploadImageLoading && {
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
            {uploadImageLoading ? 'Uploading' : 'Upload'}
          </Button>
        ) : (
          <Button
            variant="contained"
            startIcon={<Iconify icon="eva:cloud-upload-fill" />}
            onClick={() => {
              onClose();
              setCurrentSelected(null);
              setSearchText('');
              setTypes([]);
              setQueryParams([]);
            }}
          >
            Select
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
