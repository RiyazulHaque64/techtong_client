import type { IBrand } from 'src/types/brand';
import type { DrawerProps } from '@mui/material/Drawer';
import type { IErrorResponse } from 'src/redux/interfaces/common';

import { z as zod } from 'zod';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import { Alert } from '@mui/material';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import { useBoolean } from 'src/hooks/use-boolean';

import { CONFIG } from 'src/config-global';
import { useAddBrandMutation, useUpdateBrandMutation } from 'src/redux/features/brand/brandApi';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { Form, Field } from 'src/components/hook-form';
import { FileThumbnail } from 'src/components/file-thumbnail';
import { ImageSelectModal } from 'src/components/modal/image-select-modal';

// ----------------------------------------------------------------------

export type NewBrandSchemaType = zod.infer<typeof NewBrandSchema>;

export const NewBrandSchema = zod.object({
  name: zod.string().min(1, { message: 'Name is required!' }),
  description: zod.string().optional(),
  icon: zod.string().optional(),
});

type Props = DrawerProps & {
  item?: IBrand;
  onClose: () => void;
  currentBrand?: any;
};

export function BrandManageForm({ item, open, onClose, ...other }: Props) {
  const { id, name, icon, description } = item || {};

  const [updateBrand, { isLoading: updateLoading }] = useUpdateBrandMutation();
  const [addBrand, { isLoading: addLoading }] = useAddBrandMutation();

  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [errorMsg, setErrorMsg] = useState<string>('');

  const selectImageModal = useBoolean();

  const defaultValues = useMemo(
    () => ({
      name: name || '',
      description: description || '',
      icon: icon || '',
    }),
    [name, description, icon]
  );

  const methods = useForm<NewBrandSchemaType>({
    mode: 'onSubmit',
    resolver: zodResolver(NewBrandSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (selectedImages.length > 0) {
        data.icon = selectedImages[0];
      }
      let res;
      if (id) {
        res = await updateBrand({ id, data });
      } else {
        res = await addBrand(data);
      }
      if (res?.error) {
        setErrorMsg((res?.error as IErrorResponse)?.data?.message);
      } else {
        toast.success(id ? 'Update success!' : 'Create success!');
        onClose();
      }
    } catch (err) {
      setErrorMsg(typeof err === 'string' ? err : err.message);
    }
  });

  return (
    <>
      <Drawer
        open={open}
        onClose={onClose}
        anchor="right"
        slotProps={{ backdrop: { invisible: true } }}
        PaperProps={{ sx: { width: 320 } }}
        {...other}
      >
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ p: 2.5 }}>
          <Typography variant="h6"> {id ? 'Edit Brand' : 'Add Brand'} </Typography>
          <IconButton
            aria-label="edit_name"
            size="small"
            onClick={() => {
              onClose();
              reset();
              setSelectedImages([]);
            }}
          >
            <Iconify icon="akar-icons:cross" sx={{ width: '14px', height: '14px' }} />
          </IconButton>
        </Stack>
        <Form methods={methods} onSubmit={onSubmit}>
          <Stack sx={{ height: 'calc(100vh - 68px)' }}>
            {!!errorMsg && (
              <Alert severity="error" sx={{ mx: 2.5, mb: 1 }}>
                {errorMsg}
              </Alert>
            )}
            <Stack direction="column" spacing={2.5} flexGrow={1} sx={{ p: 2.5 }}>
              <Stack
                direction="column"
                alignItems="center"
                justifyContent="center"
                sx={{
                  borderStyle: 'dashed',
                  borderWidth: 2,
                  borderColor: 'divider',
                  borderRadius: 1,
                  height: '180px',
                  mb: 2,
                  cursor: 'pointer',
                }}
                onClick={selectImageModal.onTrue}
              >
                {icon || selectedImages.length > 0 ? (
                  <FileThumbnail
                    imageView
                    file={`${CONFIG.bucket.url}/${CONFIG.bucket.name}/${selectedImages.length > 0 ? selectedImages[0] : icon}`}
                    sx={{
                      width: '100%',
                      height: 'auto',
                      alignSelf: 'flex-start',
                    }}
                    slotProps={{
                      img: {
                        width: 320,
                        height: 'auto',
                        aspectRatio: '4/3',
                        objectFit: 'cover',
                      },
                      icon: { width: 64, height: 64 },
                    }}
                  />
                ) : (
                  <Typography variant="h6">Select Logo</Typography>
                )}
              </Stack>
              <Field.Text name="name" label="Name" />
              <Field.Text name="description" label="Description" />
            </Stack>
            <Box sx={{ p: 2.5 }}>
              <Button
                type="submit"
                fullWidth
                variant="soft"
                color="primary"
                size="large"
                startIcon={
                  <Iconify icon={id ? 'material-symbols:save-rounded' : 'f7:plus-app-fill'} />
                }
                disabled={isSubmitting || updateLoading || addLoading}
              >
                {id ? 'Save Changes' : 'Add Brand'}
              </Button>
            </Box>
          </Stack>
        </Form>
      </Drawer>
      <ImageSelectModal
        open={selectImageModal.value}
        onClose={selectImageModal.onFalse}
        selectedImages={selectedImages}
        setSelectedImages={setSelectedImages}
        multiple={false}
      />
    </>
  );
}
// calc(100vh - 170px)
