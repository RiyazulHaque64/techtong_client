import type { DialogProps } from '@mui/material/Dialog';
import type { IErrorResponse } from 'src/redux/interfaces/common';

import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z as zod } from 'zod';

import LoadingButton from '@mui/lab/LoadingButton';
import { Grid, Stack, Typography } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

import { useAddCourierMutation, useGetCouriersQuery, useUpdateCourierMutation } from 'src/redux/features/courier/courier-api';

import { Field, Form } from 'src/components/hook-form';
import { toast } from 'src/components/snackbar';

// ----------------------------------------------------------------------

export type ReviewSchemaType = zod.infer<typeof CancelFormSchema>;

export const CancelFormSchema = zod.object({
    name: zod.string().min(1, { message: 'Name is required!' }),
    email: zod.string()
        .optional()
        .refine((value) => !value || zod.string().email().safeParse(value).success, {
            message: 'Invalid email!',
        }),
    contact_number: zod.string()
        .optional()
        .refine((value) => !value || zod.string().regex(/^01\d{9}$/).safeParse(value).success, {
            message: 'Valid format like as "01511111111"',
        }),
    address: zod.string().optional(),
});

// ----------------------------------------------------------------------

type Props = DialogProps & {
    courierID?: string;
    onClose: () => void;
};

export function CourierFormModal({ courierID, onClose, ...other }: Props) {

    const { data: courier } = useGetCouriersQuery([], {
        selectFromResult: ({ data }) => ({
            data: data?.data?.find((c) => c.id === courierID),
        }),
    });

    const [addCourier, { isLoading }] = useAddCourierMutation();
    const [updateCourier, { isLoading: updateLoading }] = useUpdateCourierMutation();

    const defaultValues = {
        name: '',
        email: '',
        contact_number: '',
        address: ''
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
    } = methods;

    const onSubmit = handleSubmit(async (data) => {
        try {
            let res;
            if (courier?.id) {
                res = await updateCourier({ id: courier.id, data });
            } else {
                res = await addCourier(data);
            }
            if (res?.error) {
                toast.error((res?.error as IErrorResponse)?.data?.message || 'Operation failed!');
            } else {
                toast.success(courier?.id ? 'Update success' : 'Add success!');
                onCancel();
            }
        } catch (error) {
            toast.error((typeof error === 'string' ? error : error.message) || 'Operation failed');
        }
    });

    const onCancel = useCallback(() => {
        onClose();
        reset();
    }, [onClose, reset]);

    useEffect(() => {
        reset(courier)
    }, [courier, reset])

    return (
        <Dialog onClose={onClose} {...other} sx={{ '& .MuiDialog-paper': { width: { xs: '95%', md: '60%', lg: '40%' } } }}>
            <Form methods={methods} onSubmit={onSubmit}>
                <DialogTitle>
                    <Stack direction='row' justifyContent='space-between' gap={5} alignItems='center'>
                        <Typography variant='subtitle1'>{courier ? 'Update' : 'Add'} Courier</Typography>
                    </Stack>
                </DialogTitle>

                <DialogContent>
                    <Grid container spacing={2} sx={{ pt: 1 }}>
                        <Grid item xs={12} md={6}>
                            <Field.Text name="name" label="Name*" />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Field.Text name="email" label="Email" />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Field.Text name="contact_number" label="Contact Number" />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Field.Text name="address" label="Address" />
                        </Grid>
                    </Grid>
                </DialogContent>

                <DialogActions>
                    <Button
                        color="inherit"
                        variant="outlined"
                        onClick={onCancel}
                        disabled={isLoading || updateLoading || isSubmitting}
                    >
                        Cancel
                    </Button>

                    <LoadingButton type="submit" variant="contained" loading={isLoading || updateLoading || isSubmitting}>
                        {courier ? 'Update' : 'Add'}
                    </LoadingButton>
                </DialogActions>
            </Form>
        </Dialog>
    );
}
