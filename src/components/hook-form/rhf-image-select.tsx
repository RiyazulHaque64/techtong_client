import { Controller, useFormContext } from 'react-hook-form';

import { grey } from '@mui/material/colors';
import { Box, Grid, IconButton, Typography, FormHelperText } from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';

import { CONFIG } from 'src/config-global';
import { varAlpha } from 'src/theme/styles';

import { Iconify } from '../iconify';
import { ImageSelectModalByRHF } from '../modal/image-select-modal';
import { ImageSelectPlaceholder } from '../upload/components/placeholder';

// ----------------------------------------------------------------------

type Props = {
  name: string;
  modalTitle?: string;
  multiple?: boolean;
  placeholderHeading?: string;
  placeholderSubHeading?: string;
  multipleImageHeader?: string;
  imageReset?: () => void;
};

export function RHFImageSelect({
  name,
  modalTitle = 'Select image',
  multiple = false,
  placeholderHeading,
  placeholderSubHeading,
  multipleImageHeader = 'Selected images',
}: Props) {
  const { control, setValue, watch } = useFormContext();
  const images = watch(name);

  const openImageModal = useBoolean();

  return (
    <>
      <Controller
        name={name}
        control={control}
        render={({ field, fieldState: { error } }) => (
          <>
            {field.value?.length && multiple ? (
              <>
                <Typography>{multipleImageHeader}:</Typography>
                <Grid container spacing={2} sx={{ mt: 1 }}>
                  {field.value.map((image: string) => (
                    <Grid item xs={12} sm={6} md={4} key={image}>
                      <Box sx={{ position: 'relative' }}>
                        <Box
                          component="img"
                          src={`${CONFIG.bucket.url}/${CONFIG.bucket.general_bucket}/${image}`}
                          sx={{
                            width: 1,
                            height: 1,
                            borderRadius: 1,
                            objectFit: 'cover',
                            border: `2px dashed ${grey[400]}`,
                            bgcolor: (theme) =>
                              varAlpha(theme.vars.palette.grey['500Channel'], 0.08),
                          }}
                        />
                        <IconButton
                          size="small"
                          sx={{
                            position: 'absolute',
                            top: 0,
                            right: 0,
                            bgcolor: (theme) =>
                              varAlpha(theme.vars.palette.grey['900Channel'], 0.4),
                            transform: 'translate(36%, -36%)',
                            '&:hover': {
                              bgcolor: (theme) =>
                                varAlpha(theme.vars.palette.grey['900Channel'], 0.6),
                            },
                          }}
                          onClick={() =>
                            setValue(
                              name,
                              field.value.filter((item: string) => item !== image)
                            )
                          }
                        >
                          <Iconify icon="eva:close-fill" sx={{ color: 'white' }} />
                        </IconButton>
                      </Box>
                    </Grid>
                  ))}
                  <Grid item xs={12} sm={6} md={4}>
                    <Box
                      sx={{
                        border: `2px dashed ${grey[400]}`,
                        height: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: 1,
                        cursor: 'pointer',
                      }}
                      onClick={openImageModal.onTrue}
                    >
                      <Iconify
                        icon="majesticons:image-plus-line"
                        sx={{ width: '50%', height: '50%', color: grey[400] }}
                      />
                    </Box>
                  </Grid>
                </Grid>
              </>
            ) : (
              <Box
                {...field}
                onClick={openImageModal.onTrue}
                sx={{
                  bgcolor: (theme) => varAlpha(theme.vars.palette.grey['500Channel'], 0.08),
                  border: (theme) =>
                    `1px dashed ${varAlpha(theme.vars.palette.grey['500Channel'], 0.2)}`,
                  transition: (theme) => theme.transitions.create(['opacity', 'padding']),
                  borderRadius: 1,
                  ...(!!error &&
                    !field.value.length && {
                      color: 'error.main',
                      borderColor: 'error.main',
                      bgcolor: (theme) => varAlpha(theme.vars.palette.error.mainChannel, 0.08),
                    }),
                }}
              >
                {field.value.length && !multiple ? (
                  <Box
                    component="img"
                    src={`${CONFIG.bucket.url}/${CONFIG.bucket.general_bucket}/${field.value[0]}`}
                    sx={{ width: 1, height: 1, borderRadius: 1, objectFit: 'cover' }}
                  />
                ) : (
                  <ImageSelectPlaceholder
                    heading={placeholderHeading}
                    subHeading={placeholderSubHeading}
                  />
                )}
              </Box>
            )}
            {error && !field.value.length && (
              <FormHelperText error={!!error} sx={{ px: 2 }}>
                {error.message}
              </FormHelperText>
            )}
          </>
        )}
      />
      <ImageSelectModalByRHF
        title={modalTitle}
        open={openImageModal.value}
        onClose={openImageModal.onFalse}
        name={name}
        selectedImages={images}
        setSelectedImages={setValue}
        multiple={multiple}
      />
    </>
  );
}
