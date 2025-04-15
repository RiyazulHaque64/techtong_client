import type { IOrder } from 'src/types/order';

import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';

import { CONFIG } from 'src/config-global';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';

// ----------------------------------------------------------------------

type Props = {
    order: IOrder;
};

export function OrderDetailsItems({
    order
}: Props) {
    const { order_items, sub_amount, discount_amount, delivery_charge, payable_amount, tax, percentage_of_tax } = order;

    const renderTotal = (
        <Stack spacing={2} alignItems="flex-end" sx={{ p: 3, textAlign: 'right', typography: 'body2' }}>
            <Stack direction="row">
                <Box sx={{ color: 'text.secondary' }}>Subtotal</Box>
                <Box sx={{ width: 160, typography: 'subtitle2' }}>{
                    new Intl.NumberFormat("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                    }).format(sub_amount)
                    || '-'}</Box>
            </Stack>

            <Stack direction="row">
                <Box sx={{ color: 'text.secondary' }}>Delivery charge</Box>
                <Box sx={{ width: 160 }}>
                    {delivery_charge ? `${new Intl.NumberFormat("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                    }).format(delivery_charge)
                        }` : '0.00'}
                </Box>
            </Stack>

            <Stack direction="row">
                <Box sx={{ color: 'text.secondary' }}>Discount</Box>
                <Box sx={{ width: 160, ...(discount_amount && { color: 'error.main' }) }}>
                    {discount_amount ? `- ${new Intl.NumberFormat("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                    }).format(discount_amount)
                        }` : '0.00'}
                </Box>
            </Stack>

            <Stack direction="row">
                <Box sx={{ color: 'text.secondary' }}>Taxes ({percentage_of_tax}%)</Box>
                <Box sx={{ width: 160 }}>{new Intl.NumberFormat("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                }).format(tax) || '0.00'}</Box>
            </Stack>

            <Stack direction="row" sx={{ typography: 'subtitle1' }}>
                <div>Total</div>
                <Box sx={{ width: 160 }}>{
                    new Intl.NumberFormat("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                    }).format(payable_amount)
                    || '-'}</Box>
            </Stack>
        </Stack>
    );

    return (
        <Card>
            <CardHeader
                title="Details"
                action={
                    <IconButton>
                        <Iconify icon="solar:pen-bold" />
                    </IconButton>
                }
            />

            <Scrollbar>
                {order_items.map((item) => (
                    <Stack
                        key={item.product.code}
                        direction="row"
                        alignItems="center"
                        sx={{
                            p: 3,
                            minWidth: 640,
                            borderBottom: (theme) => `dashed 2px ${theme.vars.palette.background.neutral}`,
                        }}
                    >
                        <Avatar src={`${CONFIG.bucket.url}/${CONFIG.bucket.general_bucket}/${item.product.thumbnail}`} variant="rounded" sx={{ width: 48, height: 48, mr: 2 }} />

                        <ListItemText
                            primary={item.product.name}
                            secondary={item.product.code}
                            primaryTypographyProps={{ typography: 'body2' }}
                            secondaryTypographyProps={{ component: 'span', color: 'text.disabled', mt: 0.5 }}
                        />

                        <Box sx={{ typography: 'body2' }}>{item.price} x {item.quantity}</Box>

                        <Stack direction="row" justifyContent='right' sx={{ width: 110, typography: 'subtitle2' }}>
                            <Iconify
                                icon="tabler:currency-taka"
                                sx={{ width: 17, height: 17, mr: '-2px', mt: '3px' }}
                            />
                            <div>
                                {
                                    new Intl.NumberFormat("en-US", {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                    }).format(item.price * item.quantity)
                                }
                            </div>

                        </Stack>
                    </Stack>
                ))}
            </Scrollbar>

            {renderTotal}
        </Card>
    );
}
