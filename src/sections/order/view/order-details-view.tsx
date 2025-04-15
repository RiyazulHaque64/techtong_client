import type { IOrder } from 'src/types/order';

import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';

import { DashboardContent } from 'src/layouts/dashboard';

import { OrderDetailsHistory } from '../order-details-history';
import { OrderDetailsInfo } from '../order-details-info';
import { OrderDetailsItems } from '../order-details-item';
import { OrderDetailsToolbar } from '../order-details-toolbar';

// ----------------------------------------------------------------------

type Props = {
    order: IOrder;
};

export function OrderDetailsView({ order }: Props) {
    console.log("order: ", order);

    return (
        <DashboardContent>
            <OrderDetailsToolbar
                order={order}
            />

            <Grid container spacing={3}>
                <Grid xs={12} md={8}>
                    <Stack spacing={3} direction={{ xs: 'column-reverse', md: 'column' }}>
                        <OrderDetailsItems order={order} />

                        <OrderDetailsHistory history={order.history} />
                    </Stack>
                </Grid>

                <Grid xs={12} md={4}>
                    <OrderDetailsInfo order={order} />
                </Grid>
            </Grid>
        </DashboardContent>
    );
}
