import type { DialogProps } from '@mui/material/Dialog';
import type { IErrorResponse } from 'src/redux/interfaces/common';
import type { IOrder } from 'src/types/order';

import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { z as zod } from 'zod';

import LoadingButton from '@mui/lab/LoadingButton';
import { Grid, MenuItem, MenuList, Stack, Typography } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

import { snakeCase } from 'src/utils/change-case';

import { useGetCouriersQuery } from 'src/redux/features/courier/courier-api';
import { useUpdateOrderMutation } from 'src/redux/features/order/order-api';

import { CustomPopover, usePopover } from 'src/components/custom-popover';
import { Field, Form } from 'src/components/hook-form';
import { Iconify } from 'src/components/iconify';
import { toast } from 'src/components/snackbar';

import { disabledChangeStatusOptions, filteredStatusOptions } from './utils';

// ----------------------------------------------------------------------

export type ReviewSchemaType = zod.infer<typeof CancelFormSchema>;

export const CancelFormSchema = zod.object({
    order_status: zod.string(),
    remark: zod.string().optional(),
    courier: zod
        .object({
            label: zod.string(),
            value: zod.string(),
        })
        .nullable()
        .optional(),
    tracking_id: zod.string().optional()
});

// ----------------------------------------------------------------------

type Props = DialogProps & {
    onClose: () => void;
    order: IOrder;
};

export function ChangeStatusModal({ onClose, order, ...other }: Props) {
    const [updateOrder, { isLoading }] = useUpdateOrderMutation();
    const { data: couriers } = useGetCouriersQuery([
        { name: 'limit', value: 500 },
        { name: 'sortBy', value: 'name' },
        { name: 'sortOrder', value: 'asc' },
    ]);

    const courierOptions =
        couriers?.data?.map((courier) => ({ label: courier.name, value: courier.id })) || [];

    const popover = usePopover();

    const defaultValues = {
        order_status: '',
        remark: '',
        courier: null,
        tracking_id: ''
    };

    const methods = useForm<ReviewSchemaType>({
        mode: 'all',
        resolver: zodResolver(CancelFormSchema),
        defaultValues,
    });

    const {
        reset,
        handleSubmit,
        formState: { isSubmitting },
        setValue,
        watch
    } = methods;

    const changedStatus = watch('order_status');

    const onSubmit = handleSubmit(async (data) => {
        try {
            const changeStatusInfo: { order_status: string; order_history: any; shipped_info?: Record<string, any> } = { order_status: data.order_status, order_history: { remark: data.remark } }
            if (changedStatus === 'SHIPPED') {
                changeStatusInfo.shipped_info = {
                    courier_id: data.courier?.value,
                    tracking_id: data.tracking_id
                }
            }

            const res = await updateOrder({ id: order.id, data: changeStatusInfo });
            if (res?.error) {
                toast.error((res?.error as IErrorResponse)?.data?.message || 'Update failed!');
            } else {
                toast.success('Update success!');
                onCancel();
            }
        } catch (error) {
            toast.error((typeof error === 'string' ? error : error.message) || 'Update failed!');
        }
    });

    const onCancel = useCallback(() => {
        onClose();
        reset();
    }, [onClose, reset]);

    return (
        <Dialog onClose={onClose} {...other} sx={{ '& .MuiDialog-paper': { width: { xs: '95%', md: '60%', lg: '40%' } } }}>
            <Form methods={methods} onSubmit={onSubmit}>
                <DialogTitle>
                    <Stack direction='row' justifyContent='space-between' gap={5} alignItems='center'>
                        <Typography variant='subtitle1'>Change order status</Typography>
                        <Button
                            size='small'
                            color="inherit"
                            disabled={isSubmitting || isLoading || disabledChangeStatusOptions.includes(order.order_status)}
                            variant="outlined"
                            endIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}
                            onClick={popover.onOpen}
                            sx={{ textTransform: 'capitalize' }}
                        >
                            {snakeCase(changedStatus.length > 0 ? changedStatus : order.order_status)}
                        </Button>
                    </Stack>
                </DialogTitle>

                <DialogContent>
                    <Grid container spacing={2} sx={{ pt: 1 }}>
                        {
                            changedStatus.length === 0 ? (
                                <Grid item xs={12} sx={{ textAlign: 'center' }}>
                                    <Typography variant='caption' color='error' sx={{ fontSize: '0.9rem' }}>
                                        {
                                            disabledChangeStatusOptions.includes(order.order_status) ? `Can't change the status of ${snakeCase(order.order_status)} order` : `Change status to ${snakeCase(order.order_status)}!`
                                        }
                                    </Typography>
                                </Grid>
                            ) : (
                                <>
                                    {
                                        changedStatus === 'SHIPPED' && (
                                            <>
                                                <Grid item xs={6}>
                                                    <Field.AutoComplete name="courier" options={courierOptions} label="Courier" />
                                                </Grid>
                                                <Grid item xs={6}>
                                                    <Field.Text name="tracking_id" label="Tracking ID" />
                                                </Grid>
                                            </>
                                        )
                                    }
                                    <Grid item xs={12}>
                                        <Field.Text name="remark" label="Remark" multiline />
                                    </Grid>
                                </>
                            )
                        }
                    </Grid>
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
                <CustomPopover
                    open={popover.open}
                    anchorEl={popover.anchorEl}
                    onClose={popover.onClose}
                    slotProps={{ arrow: { placement: 'top-right' } }}
                >
                    <MenuList>
                        {filteredStatusOptions(order.order_status).map((option) => (
                            <MenuItem
                                key={option.value}
                                selected={option.value === changedStatus}
                                onClick={() => {
                                    popover.onClose();
                                    setValue('order_status', option.value);
                                }}
                            >
                                {option.label}
                            </MenuItem>
                        ))}
                    </MenuList>
                </CustomPopover>
            </Form>
        </Dialog>
    );
}
