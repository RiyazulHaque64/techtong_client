import type { DialogProps } from '@mui/material/Dialog';
import type { IProduct } from 'src/types/product';

import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { z as zod } from 'zod';

import LoadingButton from '@mui/lab/LoadingButton';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

import { useUpdateProductMutation } from 'src/redux/features/product/product-api';

import { Form } from 'src/components/hook-form';
import { toast } from 'src/components/snackbar';

import { PriceInformationForm } from '../add-product/price-information-form';

// ----------------------------------------------------------------------

export type ReviewSchemaType = zod.infer<typeof QuickUpdateFormSchema>;

export const QuickUpdateFormSchema = zod.object({
  price: zod.number().optional(),
  discount_price: zod.number().optional(),
  retailer_price: zod.number().optional(),
  stock: zod.number().optional(),
});

// ----------------------------------------------------------------------

type Props = DialogProps & {
  onClose: () => void;
  product: IProduct;
};

export function QuickUpdateForm({ onClose, product, ...other }: Props) {
  const [updateProduct, { isLoading }] = useUpdateProductMutation();
  const defaultValues = {
    price: product?.price,
    discount_price: product?.discount_price || 0,
    retailer_price: product?.retailer_price || 0,
    stock: product?.stock || 0,
  };

  const methods = useForm<ReviewSchemaType>({
    mode: 'all',
    resolver: zodResolver(QuickUpdateFormSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      const res = await updateProduct({ id: product?.id, data });
      if (res?.error) {
        toast.error('Update failed!');
      } else {
        toast.success('Update success!');
        onClose();
      }
    } catch (error) {
      toast.error('Update failed!');
    }
  });

  const onCancel = useCallback(() => {
    onClose();
    reset();
  }, [onClose, reset]);

  return (
    <Dialog onClose={onClose} {...other}>
      <Form methods={methods} onSubmit={onSubmit}>
        <DialogTitle>{product?.name}</DialogTitle>

        <DialogContent>
          <PriceInformationForm sx={{ pt: 1 }} />
        </DialogContent>

        <DialogActions>
          <Button
            color="inherit"
            variant="outlined"
            onClick={onCancel}
            disabled={isLoading || isSubmitting}
          >
            Cancel
          </Button>

          <LoadingButton type="submit" variant="contained" loading={isLoading || isSubmitting}>
            Update
          </LoadingButton>
        </DialogActions>
      </Form>
    </Dialog>
  );
}
