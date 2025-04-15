import type { IOrder } from 'src/types/order';

import { Button } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { sentenceCase, snakeCase } from 'src/utils/change-case';
import { fDateTime } from 'src/utils/format-time';

import { CONFIG } from 'src/config-global';

import { Iconify } from 'src/components/iconify';
import { Label } from 'src/components/label';

// ----------------------------------------------------------------------

type Props = {
    order: IOrder;
    payment?: any;
    customer?: any;
    delivery?: any;
    shippingAddress?: any;
};

export function OrderDetailsInfo({ customer, delivery, payment, shippingAddress, order }: Props) {
    const { user, customer_info, shipped_info, delivery_method, payment_method, payment_status, comment } = order;

    const handleWhatsAppClick = (phoneNumber: string) => {
        window.open(`https://wa.me/${!phoneNumber.startsWith('+88') && '+88'}${phoneNumber}`, "_blank");
    };

    const renderCustomerInfo = (
        <>
            <CardHeader
                title="Customer info"
                action={
                    <IconButton>
                        <Iconify icon="solar:pen-bold" />
                    </IconButton>
                }
            />
            <Stack direction="row" sx={{ p: 3 }}>
                {
                    user ? (
                        <>
                            <Avatar
                                alt={user.name}
                                src={`${CONFIG.bucket.url}/${CONFIG.bucket.user_bucket}/${user.profile_pic}`}
                                sx={{ width: 48, height: 48, mr: 2 }}
                            />

                            <Stack spacing={0.5} alignItems="flex-start" sx={{ typography: 'body2' }}>
                                <Typography variant="subtitle2">{user.name}</Typography>

                                <Box sx={{ color: 'text.secondary' }}>{user.email}</Box>

                                <div>
                                    Phone:
                                    <Box component="span" sx={{ color: 'text.secondary', ml: 0.25 }}>
                                        {user.contact_number}
                                    </Box>
                                </div>
                                <Stack direction='row' gap={1}>
                                    <Button
                                        variant='outlined'
                                        size="small"
                                        color="primary"
                                        startIcon={<Iconify icon="ic:baseline-whatsapp" />}
                                        sx={{ mt: 1 }}
                                        onClick={() => handleWhatsAppClick(user.contact_number)}
                                    >
                                        Whatsapp
                                    </Button>
                                    <Button
                                        component='a'
                                        variant='contained'
                                        size="small"
                                        color="primary"
                                        startIcon={<Iconify icon="ic:round-call" />}
                                        sx={{ mt: 1 }}
                                        href={`tel:${!user.contact_number.startsWith('+88') && '+88'}${user.contact_number}`}
                                    >
                                        Call
                                    </Button>
                                </Stack>
                            </Stack></>
                    ) : (
                        <>
                            <Avatar
                                alt={customer_info.name}
                                src={customer_info.name}
                                sx={{ width: 48, height: 48, mr: 2 }}
                            />

                            <Stack spacing={0.5} alignItems="flex-start" sx={{ typography: 'body2' }}>
                                <Typography variant="subtitle2">{customer_info.name}</Typography>

                                {customer_info.email && <Box sx={{ color: 'text.secondary' }}>{customer_info.email}</Box>}

                                <div>
                                    Phone:
                                    <Box component="span" sx={{ color: 'text.secondary', ml: 0.25 }}>
                                        {customer_info.contact_number}
                                    </Box>
                                </div>

                                <Stack direction='row' gap={1}>
                                    <Button
                                        variant='outlined'
                                        size="small"
                                        color="primary"
                                        startIcon={<Iconify icon="ic:baseline-whatsapp" />}
                                        sx={{ mt: 1 }}
                                        onClick={() => handleWhatsAppClick(customer_info.contact_number)}
                                    >
                                        Whatsapp
                                    </Button>
                                    <Button
                                        component='a'
                                        variant='contained'
                                        size="small"
                                        color="primary"
                                        startIcon={<Iconify icon="ic:round-call" />}
                                        sx={{ mt: 1 }}
                                        href={`tel:${!customer_info.contact_number.startsWith('+88') && '+88'}${customer_info.contact_number}`}
                                    >
                                        Call
                                    </Button>
                                </Stack>
                            </Stack></>
                    )
                }
            </Stack>
        </>
    );

    const renderDelivery = (
        <>
            <CardHeader
                title="Delivery"
                action={
                    <IconButton>
                        <Iconify icon="solar:pen-bold" />
                    </IconButton>
                }
            />
            <Stack spacing={1.5} sx={{ p: 3, typography: 'body2' }}>
                <Stack direction="row" alignItems="center">
                    <Box component="span" sx={{ color: 'text.secondary', width: 120, flexShrink: 0 }}>
                        Ship by
                    </Box>
                    {shipped_info?.courier.name}
                </Stack>
                <Stack direction="row" alignItems="center">
                    <Box component="span" sx={{ color: 'text.secondary', width: 120, flexShrink: 0 }}>
                        Tracking No.
                    </Box>
                    <Link underline="always" color="inherit">
                        {shipped_info?.tracking_id}
                    </Link>
                </Stack>
                <Stack direction="row" alignItems="center">
                    <Box component="span" sx={{ color: 'text.secondary', width: 120, flexShrink: 0 }}>
                        Date
                    </Box>
                    {fDateTime(shipped_info?.created_at)}
                </Stack>
            </Stack>
        </>
    );

    const renderShipping = (
        <>
            <CardHeader
                title="Shipping"
                action={
                    <IconButton>
                        <Iconify icon="solar:pen-bold" />
                    </IconButton>
                }
            />
            <Stack spacing={1.5} sx={{ p: 3, typography: 'body2' }}>
                <Stack direction="row">
                    <Box component="span" sx={{ color: 'text.secondary', width: 120, flexShrink: 0 }}>
                        Method
                    </Box>
                    {sentenceCase(delivery_method.split('_').join(' ').toLowerCase())}
                </Stack>

                <Stack direction="row">
                    <Box component="span" sx={{ color: 'text.secondary', width: 120, flexShrink: 0 }}>
                        Address
                    </Box>
                    {customer_info.address}
                </Stack>

                <Stack direction="row">
                    <Box component="span" sx={{ color: 'text.secondary', width: 120, flexShrink: 0 }}>
                        City
                    </Box>
                    {customer_info.city}
                </Stack>

                {
                    customer_info.email && (
                        <Stack direction="row">
                            <Box component="span" sx={{ color: 'text.secondary', width: 120, flexShrink: 0 }}>
                                Email
                            </Box>
                            {customer_info.email}
                        </Stack>
                    )
                }

                <Stack direction="row">
                    <Box component="span" sx={{ color: 'text.secondary', width: 120, flexShrink: 0 }}>
                        Phone number
                    </Box>
                    {customer_info.contact_number}
                </Stack>
                <Stack direction='row' gap={1}>
                    <Button
                        variant='outlined'
                        size="small"
                        color="primary"
                        startIcon={<Iconify icon="ic:baseline-whatsapp" />}
                        sx={{ mt: 1 }}
                        onClick={() => handleWhatsAppClick(customer_info.contact_number)}
                    >
                        Whatsapp
                    </Button>
                    <Button
                        component='a'
                        variant='contained'
                        size="small"
                        color="primary"
                        startIcon={<Iconify icon="ic:round-call" />}
                        sx={{ mt: 1 }}
                        href={`tel:${!customer_info.contact_number.startsWith('+88') && '+88'}${customer_info.contact_number}`}
                    >
                        Call
                    </Button>
                </Stack>
            </Stack>
        </>
    );

    const renderPayment = (
        <>
            <CardHeader
                title="Payment"
                action={
                    <IconButton>
                        <Iconify icon="solar:pen-bold" />
                    </IconButton>
                }
            />
            <Stack spacing={1.5} sx={{ p: 3, typography: 'body2' }}>
                <Stack direction="row">
                    <Box component="span" sx={{ color: 'text.secondary', width: 120, flexShrink: 0 }}>
                        Status
                    </Box>
                    <Label variant='soft' color={payment_status === 'PAID' ? 'success' : 'error'}>
                        {snakeCase(payment_status)}
                    </Label>
                </Stack>
                <Stack direction="row">
                    <Box component="span" sx={{ color: 'text.secondary', width: 120, flexShrink: 0 }}>
                        Method
                    </Box>
                    {sentenceCase(payment_method.split('_').join(' ').toLowerCase())}
                </Stack>
            </Stack>
            {/* <Box
                display="flex"
                alignItems="center"
                justifyContent="flex-end"
                sx={{ p: 3, gap: 0.5, typography: 'body2' }}
            >
                5678 1234 1234 1234
                <Iconify icon="logos:mastercard" width={24} />
            </Box> */}
        </>
    );

    const renderAdditionalInfo = (
        <>
            <CardHeader
                title="Additional Information"
                action={
                    <IconButton>
                        <Iconify icon="solar:pen-bold" />
                    </IconButton>
                }
            />
            <Stack spacing={1.5} sx={{ p: 3, typography: 'body2' }}>
                {
                    comment && (
                        <Stack direction="row">
                            <Box component="span" sx={{ color: 'text.secondary', width: 120, flexShrink: 0 }}>
                                Comment
                            </Box>
                            {sentenceCase(comment)}
                        </Stack>
                    )
                }
            </Stack>
        </>
    );

    return (
        <Card>
            {renderCustomerInfo}

            <Divider sx={{ borderStyle: 'dashed' }} />

            {renderShipping}

            {shipped_info && (
                <>
                    <Divider sx={{ borderStyle: 'dashed' }} />
                    {renderDelivery}
                </>
            )}

            <Divider sx={{ borderStyle: 'dashed' }} />

            {renderPayment}

            {comment && (
                <>
                    <Divider sx={{ borderStyle: 'dashed' }} />
                    {renderAdditionalInfo}
                </>
            )}
        </Card>
    );
}
