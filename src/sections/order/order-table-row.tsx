
import type { IOrder } from 'src/types/order';

import { useCallback } from 'react';

import {
    Avatar,
    Box,
    Collapse,
    Link,
    ListItemText,
    Paper,
    Stack,
    Typography,
} from '@mui/material';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';

import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';

import { useBoolean } from 'src/hooks/use-boolean';

import { paramCase } from 'src/utils/change-case';
import { fDate, fTime } from 'src/utils/format-time';

import { CONFIG } from 'src/config-global';

import { ConfirmDialog } from 'src/components/custom-dialog';
import { Iconify } from 'src/components/iconify';
import { Label } from 'src/components/label';

// ----------------------------------------------------------------------

type Props = {
    row: IOrder;
    selected: boolean;
    onSelectRow: () => void;
    onDeleteRow: (id: string, close: () => void) => void;
    deleteLoading: boolean;
};

export function OrderTableRow({ row, selected, onSelectRow, onDeleteRow, deleteLoading }: Props) {
    const {
        id,
        order_id,
        order_items,
        order_status,
        payment_status,
        payable_amount,
        user,
        customer_info,
        created_at,
    } = row;

    const confirm = useBoolean();
    const collapse = useBoolean();

    const router = useRouter();

    const handleViewRow = useCallback(
        (i: string) => {
            router.push(paths.dashboard.order_details(i));
        },
        [router]
    );

    const renderPrimary = (
        <TableRow hover selected={selected}>
            <TableCell padding="checkbox">
                <Checkbox
                    checked={selected}
                    onClick={onSelectRow}
                    inputProps={{ id: `row-checkbox-${id}`, 'aria-label': `Row checkbox` }}
                />
            </TableCell>
            <TableCell align='center'>
                <Link color="inherit" onClick={() => handleViewRow(id)} underline="always" sx={{ cursor: 'pointer' }}>
                    {order_id}
                </Link>
            </TableCell>
            <TableCell>
                <Stack spacing={2} direction="row" alignItems="center">
                    {
                        user ? (
                            <>
                                <Avatar alt={user.name} src={user.profile_pic || ''} />
                                <Stack sx={{ typography: 'body2', flex: '1 1 auto', alignItems: 'flex-start' }}>
                                    <Box component="span">{user.name}</Box>
                                    <Box component="span" sx={{ color: 'text.disabled' }}>
                                        {user.contact_number}
                                    </Box>
                                </Stack>
                            </>
                        ) : (
                            <>
                                <Avatar alt={customer_info.name} src='' />
                                <Stack sx={{ typography: 'body2', flex: '1 1 auto', alignItems: 'flex-start' }}>
                                    <Box component="span">{customer_info.name}</Box>
                                    <Box component="span" sx={{ color: 'text.disabled' }}>
                                        {customer_info.contact_number}
                                    </Box>
                                </Stack>
                            </>
                        )
                    }
                </Stack>
            </TableCell>
            <TableCell>
                <Stack spacing={0.5}>
                    <Box component="span">{fDate(created_at)}</Box>
                    <Box component="span" sx={{ typography: 'caption', color: 'text.secondary' }}>
                        {fTime(created_at)}
                    </Box>
                </Stack>
            </TableCell>
            <TableCell align="center"> {order_items.length} </TableCell>
            <TableCell align='center'>
                <Stack direction="row" justifyContent='center'>
                    <Iconify
                        icon="tabler:currency-taka"
                        sx={{ width: 20, height: 20, mr: '-2px', mt: '3px' }}
                    />
                    <Typography>
                        {new Intl.NumberFormat('en-US').format(payable_amount)}
                    </Typography>

                </Stack>
            </TableCell>
            <TableCell align="center">
                <Label
                    variant="outlined"
                    color={payment_status === 'PAID' ? 'success' : 'error'}
                    sx={{ textTransform: 'capitalize' }}
                >
                    {paramCase(payment_status)}
                </Label>
            </TableCell>
            <TableCell align="center">
                <Label
                    variant="soft"
                    color={
                        (order_status === 'DELIVERED' && 'success') ||
                        ((order_status === 'PENDING' || order_status === 'PROCESSING' || order_status === 'SHIPPED') && 'warning') ||
                        (order_status === 'CANCELLED' && 'error') ||
                        'default'
                    }
                    sx={{ textTransform: 'capitalize' }}
                >
                    {paramCase(order_status)}
                </Label>
            </TableCell>
            <TableCell align="right" sx={{ px: 1, whiteSpace: 'nowrap' }}>
                <IconButton
                    color={collapse.value ? 'inherit' : 'default'}
                    onClick={collapse.onToggle}
                    sx={{ ...(collapse.value && { bgcolor: 'action.hover' }) }}
                >
                    <Iconify icon="eva:arrow-ios-downward-fill" />
                </IconButton>
                <IconButton onClick={() => handleViewRow(order_id)} title="View Details">
                    <Iconify icon="solar:eye-bold" />
                </IconButton>
                <IconButton onClick={confirm.onTrue} sx={{ color: 'error.main' }} title="Delete">
                    <Iconify icon="solar:trash-bin-trash-bold" />
                </IconButton>
            </TableCell>
        </TableRow>
    )

    const renderSecondary = (
        <TableRow>
            <TableCell sx={{ p: 0, border: 'none' }} colSpan={8}>
                <Collapse
                    in={collapse.value}
                    timeout="auto"
                    unmountOnExit
                    sx={{ bgcolor: 'background.neutral' }}
                >
                    <Paper sx={{ m: 1.5 }}>
                        {order_items.map((item) => (
                            <Stack
                                key={item.product.code}
                                direction="row"
                                alignItems="center"
                                sx={{
                                    p: (theme) => theme.spacing(1.5, 2, 1.5, 1.5),
                                    '&:not(:last-of-type)': {
                                        borderBottom: (theme) => `solid 2px ${theme.vars.palette.background.neutral}`,
                                    },
                                }}
                            >
                                <Avatar
                                    src={`${CONFIG.bucket.url}/${CONFIG.bucket.general_bucket}/${item.product.thumbnail}`}
                                    variant="rounded"
                                    sx={{ width: 48, height: 48, mr: 2 }}
                                />

                                <ListItemText
                                    primary={item.product.name}
                                    secondary={item.product.code}
                                    primaryTypographyProps={{ typography: 'body2' }}
                                    secondaryTypographyProps={{ component: 'span', color: 'text.disabled', mt: 0.5 }}
                                />

                                <div>{item.price} x {item.quantity} </div>

                                {/* <Box sx={{ width: 110, textAlign: 'right' }}>{item.price * item.quantity}</Box> */}
                                <Stack direction="row" justifyContent='right' sx={{ width: 110 }}>
                                    <Iconify
                                        icon="tabler:currency-taka"
                                        sx={{ width: 17, height: 17, mr: '-2px', mt: '3px' }}
                                    />
                                    <div>
                                        {new Intl.NumberFormat('en-US').format(item.price * item.quantity)}
                                    </div>

                                </Stack>
                            </Stack>
                        ))}
                    </Paper>
                </Collapse>
            </TableCell>
        </TableRow>
    );

    return (
        <>
            {renderPrimary}
            {renderSecondary}
            <ConfirmDialog
                open={confirm.value}
                onClose={confirm.onFalse}
                title="Delete"
                content="Are you sure want to delete?"
                action={
                    <Button
                        variant="contained"
                        color="error"
                        onClick={() => onDeleteRow(id, confirm.onFalse)}
                        disabled={deleteLoading}
                    >
                        Delete
                    </Button>
                }
            />
        </>
    );
}
