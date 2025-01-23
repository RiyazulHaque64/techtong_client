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

import { useAddBrandMutation, useUpdateBrandMutation } from 'src/redux/features/brand/brandApi';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { Form, Field } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export type NewBrandSchemaType = zod.infer<typeof NewBrandSchema>;

export const NewBrandSchema = zod.object({
  name: zod.string().min(1, { message: 'Name is required!' }),
  description: zod.string().optional(),
  icon: zod.array(zod.string()).optional(),
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

  const [errorMsg, setErrorMsg] = useState<string>('');

  const defaultValues = useMemo(
    () => ({
      name: name || '',
      description: description || '',
      icon: icon ? [icon] : [],
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
    formState: { isSubmitting, errors },
    reset,
  } = methods;

  console.log(errors);

  const onSubmit = handleSubmit(async (data) => {
    try {
      const brandInfo: { name: string; description?: string; icon?: string } = {
        name: data.name,
      };
      if (data.description) brandInfo.description = data.description;
      if (data.icon) brandInfo.icon = data.icon[0];
      let res;
      if (id) {
        res = await updateBrand({ id, data: brandInfo });
      } else {
        res = await addBrand(brandInfo);
      }
      if (res?.error) {
        setErrorMsg((res?.error as IErrorResponse)?.data?.message);
      } else {
        toast.success(id ? 'Update success!' : 'Add success!');
        onClose();
      }
    } catch (err) {
      setErrorMsg(typeof err === 'string' ? err : err.message);
    }
  });

  return (
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
            <Field.ImageSelect
              name="icon"
              modalTitle="Select Icon"
              placeholderHeading="Select or upload icon"
            />
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
  );
}
