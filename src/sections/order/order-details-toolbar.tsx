import type { IOrder } from 'src/types/order';
import type { IErrorResponse } from 'src/redux/interfaces/common';

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { useBoolean } from 'src/hooks/use-boolean';

import { snakeCase } from 'src/utils/change-case';
import { fDateTime } from 'src/utils/format-time';

import { useUpdateOrderMutation } from 'src/redux/features/order/order-api';

import { Label } from 'src/components/label';
import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';

import OrderPrintButton from './order-print-button';
import { ChangeStatusModal } from './change-status-modal';

// ----------------------------------------------------------------------

type Props = {
  order: IOrder;
};

export function OrderDetailsToolbar({ order }: Props) {
  const { id, order_status, payment_status, order_id, created_at } = order;

  const [updateOrder, { isLoading: updateLoading }] = useUpdateOrderMutation();

  const openModal = useBoolean();
  const confirmPayment = useBoolean();

  const updatePaymentStatus = async () => {
    try {
      const res = await updateOrder({ id, data: { payment_status: 'PAID' } });
      if (res?.error) {
        toast.error((res?.error as IErrorResponse)?.data?.message || 'Update failed!');
      } else {
        toast.success('Payment success!');
        confirmPayment.onFalse();
      }
    } catch (error) {
      toast.error((typeof error === 'string' ? error : error.message) || 'Update failed!');
    }
  };

  return (
    <>
      <Stack spacing={3} direction={{ xs: 'column', md: 'row' }} sx={{ mb: { xs: 3, md: 5 } }}>
        <Stack spacing={1} direction="row" alignItems="flex-start">
          <IconButton component={RouterLink} href={paths.dashboard.order}>
            <Iconify icon="eva:arrow-ios-back-fill" />
          </IconButton>

          <Stack spacing={0.5}>
            <Stack spacing={1} direction="row" alignItems="center">
              <Typography variant="h4"> Order #{order_id} </Typography>
              <Label
                variant="soft"
                color={
                  (order_status === 'PENDING' && 'warning') ||
                  (order_status === 'CANCELLED' && 'error') ||
                  (order_status === 'DELIVERED' && 'success') ||
                  'default'
                }
                sx={{ textTransform: 'capitalize' }}
              >
                {snakeCase(order_status)}
              </Label>
              {payment_status === 'PAID' && (
                <Label variant="soft" color="success" sx={{ textTransform: 'capitalize' }}>
                  {snakeCase(payment_status)}
                </Label>
              )}
            </Stack>

            <Typography variant="body2" sx={{ color: 'text.disabled' }}>
              {fDateTime(created_at)}
            </Typography>
          </Stack>
        </Stack>

        <Stack
          flexGrow={1}
          spacing={1.5}
          direction="row"
          alignItems="center"
          justifyContent="flex-end"
        >
          <Button
            color={
              (order_status === 'PENDING' && 'warning') ||
              (order_status === 'CANCELLED' && 'error') ||
              (order_status === 'DELIVERED' && 'success') ||
              'inherit'
            }
            variant="outlined"
            onClick={openModal.onTrue}
            sx={{ textTransform: 'capitalize' }}
            disabled={order_status === 'DELIVERED'}
          >
            {snakeCase(order_status)}
          </Button>

          <OrderPrintButton order={order} />

          {payment_status === 'DUE' && (
            <Button
              color="error"
              variant="contained"
              startIcon={<Iconify icon="tabler:coin-taka" />}
              sx={{ textTransform: 'capitalize' }}
              onClick={confirmPayment.onTrue}
            >
              {snakeCase(payment_status)}
            </Button>
          )}

          {/* <Button color="inherit" variant="contained" startIcon={<Iconify icon="solar:pen-bold" />}>
                        Edit
                    </Button> */}
        </Stack>
      </Stack>

      <ChangeStatusModal open={openModal.value} onClose={openModal.onFalse} order={order} />

      <ConfirmDialog
        open={confirmPayment.value}
        onClose={confirmPayment.onFalse}
        title="Payment"
        content="Are you sure want to pay?"
        action={
          <Button
            variant="contained"
            color="success"
            onClick={updatePaymentStatus}
            disabled={updateLoading}
          >
            Paid
          </Button>
        }
      />
    </>
  );
}
