import type { ICategory } from 'src/types/category';
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
import {
  useGetCategoriesQuery,
  useAddCategoryMutation,
  useUpdateCategoryMutation,
} from 'src/redux/features/category/categoryApi';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { Form, Field } from 'src/components/hook-form';
import { FileThumbnail } from 'src/components/file-thumbnail';
import { ImageSelectModal } from 'src/components/modal/image-select-modal';

// ----------------------------------------------------------------------

export type NewBrandSchemaType = zod.infer<typeof NewBrandSchema>;

export const NewBrandSchema = zod.object({
  title: zod.string().min(1, { message: 'Title is required!' }),
  description: zod.string().optional(),
  icon: zod.string().optional(),
  parent_id: zod.string().optional(),
});

type Props = DrawerProps & {
  item?: ICategory;
  onClose: () => void;
  currentCategory?: ICategory;
};

export function CategoryManageForm({ item, open, onClose, ...other }: Props) {
  const { id, title, icon, description, parent_id, parent } = item || {};

  const { data: categories } = useGetCategoriesQuery([{ name: 'limit', value: 500 }]);
  const [updateCategory, { isLoading: updateLoading }] = useUpdateCategoryMutation();
  const [addCategory, { isLoading: addLoading }] = useAddCategoryMutation();

  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [errorMsg, setErrorMsg] = useState<string>('');

  const selectImageModal = useBoolean();

  const defaultValues = useMemo(
    () => ({
      title: title || '',
      description: description || '',
      icon: icon || '',
      parent_id: parent_id || '',
    }),
    [title, description, icon, parent_id]
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
      if (data.parent_id === '') {
        delete data.parent_id;
      }
      console.log('new category data: ', data);
      if (selectedImages.length > 0) {
        data.icon = selectedImages[0];
      }
      let res;
      if (id) {
        res = await updateCategory({ id, data });
      } else {
        res = await addCategory(data);
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
          <Typography variant="h6"> {id ? 'Edit Category' : 'Add Category'} </Typography>
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
                  <Typography variant="h6">Select Icon</Typography>
                )}
              </Stack>
              <Field.Text name="title" label="Title" />
              <Field.Text name="description" label="Description" />
              <Field.Select
                native
                name="parent_id"
                label="Parent Category"
                InputLabelProps={{ shrink: true }}
              >
                <option value={parent_id || ''}>
                  {parent_id && parent ? parent.title : 'None'}
                </option>
                {categories?.data.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.title}
                  </option>
                ))}
              </Field.Select>
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
        title="Select icon"
        open={selectImageModal.value}
        onClose={selectImageModal.onFalse}
        selectedImages={selectedImages}
        setSelectedImages={setSelectedImages}
        multiple={false}
      />
    </>
  );
}
