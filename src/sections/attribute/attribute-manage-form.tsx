import type { IAttribute } from 'src/types/attribute';
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

import { useGetCategoriesQuery } from 'src/redux/features/category/categoryApi';
import {
  useAddAttributeMutation,
  useUpdateAttributeMutation,
} from 'src/redux/features/attribute/attributeApi';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { Form, Field } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export type NewAttributeSchemaType = zod.infer<typeof NewAttributeSchema>;

export const NewAttributeSchema = zod.object({
  name: zod.string().min(1, { message: 'Name is required!' }),
  value: zod.array(zod.string()),
  category_id: zod.string().optional(),
});

type Props = DrawerProps & {
  item?: IAttribute;
  onClose: () => void;
  open: boolean;
};

export function AttributeManageForm({ item, open, onClose, ...other }: Props) {
  const { id, name, value, category_id, category } = item || {};

  const { data: categories } = useGetCategoriesQuery([{ name: 'limit', value: 500 }]);
  const [addAttribute, { isLoading: addLoading }] = useAddAttributeMutation();
  const [updateAttribute, { isLoading: updateLoading }] = useUpdateAttributeMutation();

  const [errorMsg, setErrorMsg] = useState<string>('');

  const defaultValues = useMemo(
    () => ({
      name: name || '',
      value: value || [],
      category_id: category_id || '',
    }),
    [name, category_id, value]
  );

  const methods = useForm<NewAttributeSchemaType>({
    mode: 'onSubmit',
    resolver: zodResolver(NewAttributeSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (data.category_id === '') delete data.category_id;
      let res;
      if (id) {
        res = await updateAttribute({ id, data });
      } else {
        res = await addAttribute(data);
      }
      if (res?.error) {
        setErrorMsg((res?.error as IErrorResponse)?.data?.message);
      } else {
        toast.success(id ? 'Update success!' : 'Add success!');
        onClose();
        reset();
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
        <Typography variant="h6"> {id ? 'Edit Attribute' : 'Add Attribute'} </Typography>
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
            <Field.Text name="name" label="Name" />
            <Field.ChipText
              name="value"
              placeholder="Value"
              helperText="Separate values with comma(,) or press enter"
            />
            <Field.Select
              native
              name="category_id"
              label="Category"
              InputLabelProps={{ shrink: true }}
            >
              <option value={category_id || ''}>
                {category_id && category ? category.title : 'None'}
              </option>
              {categories?.data.map((ctg) => (
                <option key={ctg.id} value={ctg.id}>
                  {ctg.title}
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
              {id ? 'Save Changes' : 'Add Attribute'}
            </Button>
          </Box>
        </Stack>
      </Form>
    </Drawer>
  );
}
