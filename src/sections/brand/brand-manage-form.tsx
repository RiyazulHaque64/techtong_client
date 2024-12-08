import type { IBrand } from 'src/types/brand';
import type { DrawerProps } from '@mui/material/Drawer';

import { z as zod } from 'zod';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';

import { CONFIG } from 'src/config-global';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { Form, Field } from 'src/components/hook-form';
import { FileThumbnail } from 'src/components/file-thumbnail';

// ----------------------------------------------------------------------

export type NewBrandSchemaType = zod.infer<typeof NewBrandSchema>;

export const NewBrandSchema = zod.object({
  name: zod.string().min(1, { message: 'Name is required!' }),
  description: zod.string().optional(),
  icon: zod.string().url().optional(),
});

type Props = DrawerProps & {
  item: IBrand;
  onClose: () => void;
  onDelete: (id: string, close: () => void) => void;
  deleteLoading: boolean;
  currentBrand?: any;
};

export function BrandManageForm({ item, open, onClose, onDelete, deleteLoading, ...other }: Props) {
  const { id, name, icon, description } = item;

  const confirm = useBoolean();

  const router = useRouter();

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
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      reset();
      toast.success(id ? 'Update success!' : 'Create success!');
      router.push(paths.dashboard.root);
      console.info('DATA', data);
    } catch (error) {
      console.error(error);
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
        <IconButton aria-label="edit_name" size="small" onClick={onClose}>
          <Iconify icon="akar-icons:cross" sx={{ width: '14px', height: '14px' }} />
        </IconButton>
      </Stack>
      <Form methods={methods} onSubmit={onSubmit}>
        <Stack direction="column" spacing={2.5} sx={{ p: 2.5, height: 'calc(100vh - 170px)' }}>
          <Stack
            direction="column"
            alignItems="center"
            justifyContent="center"
            sx={{
              borderStyle: 'dashed',
              borderWidth: 2,
              borderColor: 'divider',
              borderRadius: 1,
              ...(icon && { height: '180px' }),
            }}
          >
            {!icon ? (
              <FileThumbnail
                imageView
                file={`${CONFIG.bucket.url}/${CONFIG.bucket.name}/${icon}`}
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
                onClick={() => console.log('click on the image')}
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
            fullWidth
            variant="soft"
            color="primary"
            size="large"
            startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
            onClick={() => {
              confirm.onTrue();
            }}
            disabled={isSubmitting}
          >
            {id ? 'Save Changes' : 'Add Brand'}
          </Button>
        </Box>
      </Form>
    </Drawer>
  );
}
