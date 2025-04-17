import type { IOrder } from 'src/types/order';

import React from 'react';
import dayjs from 'dayjs';

import {
  Box,
  Grid,
  Table,
  Stack,
  Divider,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  Typography,
} from '@mui/material';

import { CONFIG } from 'src/config-global';

type Props = {
  order: IOrder;
};

const OrderInvoice = React.forwardRef<HTMLDivElement, Props>(({ order }, ref) => {
  const {
    customer_info,
    created_at,
    order_id,
    order_items,
    sub_amount,
    payable_amount,
    delivery_charge,
    tax,
    discount_amount,
    payment_status,
    comment,
    history,
  } = order;
  const {
    company: { name, email, primary_contact_number, secondary_contact_number, address },
  } = CONFIG;

  return (
    <Box
      ref={ref}
      sx={{
        width: '210mm',
        minHeight: '297mm',
        padding: 4,
        backgroundColor: '#fff',
        color: '#000',
        fontSize: '12px',
      }}
      className="invoice"
    >
      {/* Header */}
      <Typography variant="h5" gutterBottom>
        {name}
      </Typography>
      {email && <Typography sx={{ fontSize: '14px' }}>Email: {email}</Typography>}
      <Typography sx={{ fontSize: '14px' }}>
        Phone: {primary_contact_number}{' '}
        {secondary_contact_number && `, ${secondary_contact_number}`}
      </Typography>
      <Typography sx={{ fontSize: '14px' }}>{address}</Typography>

      <Divider sx={{ my: 2 }} />

      {/* Invoice Info */}
      <Grid container spacing={2}>
        <Grid item xs={7}>
          <Typography sx={{ fontSize: '14px' }}>
            <Typography component="span" sx={{ fontWeight: 'medium', mr: 0.5 }}>
              Customer Name:
            </Typography>
            <Typography component="span" sx={{ textTransform: 'uppercase', fontSize: '14px' }}>
              MR. {customer_info.name}
            </Typography>
          </Typography>
          <Typography sx={{ fontSize: '14px' }}>
            <Typography component="span" sx={{ fontWeight: 'medium', mr: 0.5 }}>
              Mobile:
            </Typography>
            {customer_info.contact_number}
          </Typography>
          <Typography sx={{ fontSize: '14px' }}>
            <Typography component="span" sx={{ fontWeight: 'medium', mr: 0.5 }}>
              Address:
            </Typography>
            {customer_info.address}
          </Typography>
        </Grid>
        <Grid item xs={5}>
          <Typography>
            <Typography component="span" sx={{ fontWeight: 'medium', mr: 0.5 }}>
              Date:
            </Typography>
            {dayjs(created_at).format('DD/MM/YYYY')}
          </Typography>
          <Typography>
            <Typography component="span" sx={{ fontWeight: 'medium', mr: 0.5 }}>
              Time:
            </Typography>
            {dayjs(created_at).format('hh:mm A')}
          </Typography>
          <Typography>
            <Typography component="span" sx={{ fontWeight: 'medium', mr: 0.5 }}>
              Sold By:
            </Typography>
            {history.find((item) => item.status === 'SHIPPED')?.created_by?.name}
          </Typography>
          <Typography>
            <Typography component="span" sx={{ fontWeight: 'medium', mr: 0.5 }}>
              Order No:
            </Typography>
            {order_id}
          </Typography>
        </Grid>
      </Grid>

      <Divider sx={{ my: 2 }} />

      {/* Table */}
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell align="center">SL</TableCell>
            <TableCell>Description</TableCell>
            <TableCell align="center">Warranty</TableCell>
            <TableCell align="center">Sold Qty</TableCell>
            <TableCell align="right">Unit Price</TableCell>
            <TableCell align="right">Amount</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {order_items.map((item, index) => (
            <TableRow key={index}>
              <TableCell align="center">{index + 1}</TableCell>
              <TableCell>{item.product.name}</TableCell>
              <TableCell align="center">{item.product.warranty || 'N/A'}</TableCell>
              <TableCell align="center">{item.quantity}</TableCell>
              <TableCell align="right">{item.price}</TableCell>
              <TableCell align="right">{(item.price * item.quantity).toFixed(2)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Divider sx={{ my: 2 }} />

      {/* Totals */}
      <Stack direction="row">
        <Stack direction="column" alignItems="center" justifyContent="center" sx={{ width: '60%' }}>
          <Box
            sx={{
              border: '1px solid #000',
              px: 2,
              py: 0.5,
              borderRadius: 1,
              fontWeight: 'bold',
              fontSize: '18px',
            }}
          >
            {payment_status}
          </Box>
          <Typography sx={{ fontWeight: 'medium', fontSize: '14px', mt: 4 }}>
            Amount in words:{' '}
            <Typography component="span" sx={{ textTransform: 'uppercase', fontSize: '12px' }}>
              Two thousand only
            </Typography>
          </Typography>
        </Stack>
        <Stack direction="column" sx={{ width: '40%' }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            sx={{ borderBottom: '1px solid #000', pb: 1 }}
          >
            <Stack direction="column" alignItems="flex-start">
              <Typography>Subtotal</Typography>
              <Typography>Delivery charge</Typography>
              <Typography>Discount</Typography>
              <Typography>TAX (5%)</Typography>
            </Stack>
            <Stack direction="column" alignItems="flex-end">
              <Typography>{sub_amount.toFixed(2)}</Typography>
              <Typography>{delivery_charge.toFixed(2)}</Typography>
              <Typography>{discount_amount.toFixed(2)}</Typography>
              <Typography>{tax.toFixed(2)}</Typography>
            </Stack>
          </Stack>
          <Stack direction="row" justifyContent="space-between">
            <Typography sx={{ fontWeight: 'bold' }}>Net payable</Typography>
            <Typography sx={{ fontWeight: 'bold' }}>{payable_amount.toFixed(2)}</Typography>
          </Stack>
        </Stack>
      </Stack>

      <Divider sx={{ my: 2 }} />

      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 8 }}>
        <Typography sx={{ fontSize: '12px', borderTop: '1px solid #000', px: 1 }}>
          Received with good condition by
        </Typography>
        <Typography sx={{ fontSize: '12px', borderTop: '1px solid #000', px: 1 }}>
          For {name}
        </Typography>
      </Stack>

      {/* Footer */}
      <Box sx={{ mt: 3 }}>
        <Typography sx={{ fontSize: '12px', fontWeight: 'medium' }}>Remarks: {comment}</Typography>
        <Typography sx={{ fontSize: '12px', mt: 2 }}>
          NB: Goods not returnable after delivery. Warranty void if sticker removed, burned, broken
          or any physical damage.
        </Typography>
      </Box>
    </Box>
  );
});

export default OrderInvoice;
