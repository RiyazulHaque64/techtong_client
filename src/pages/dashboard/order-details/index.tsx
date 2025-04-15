import type { IErrorResponse } from 'src/redux/interfaces/common';

import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';

import { Button } from '@mui/material';

import { RouterLink } from 'src/routes/components';
import { paths } from 'src/routes/paths';

import { CONFIG } from 'src/config-global';
import { DashboardContent } from 'src/layouts/dashboard';
import { useGetSingleOrderQuery } from 'src/redux/features/order/order-api';

import { EmptyContent } from 'src/components/empty-content';
import { Iconify } from 'src/components/iconify';

import { FetchingError } from 'src/sections/error/fetching-error';
import { OrderDetailsSkeleton } from 'src/sections/order/order-details-skeleton';
import { OrderDetailsView } from 'src/sections/order/view';

// ----------------------------------------------------------------------

export default function Page() {
    const { order_id } = useParams();

    const { data: order, isLoading, isError, error } = useGetSingleOrderQuery(order_id || '');

    if (isLoading) {
        return (
            <DashboardContent sx={{ pt: 5 }}>
                <OrderDetailsSkeleton />
            </DashboardContent>
        );
    }

    if (isError || !order) {
        return (
            <FetchingError
                errorResponse={(error as IErrorResponse)?.data}
                statusCode={(error as IErrorResponse)?.status}
            />
        );
    }

    if (!order?.data) {
        return (
            <DashboardContent sx={{ pt: 5 }}>
                <EmptyContent
                    filled
                    title="Order not found!"
                    action={
                        <Button
                            variant="outlined"
                            component={RouterLink}
                            href={paths.dashboard.order}
                            startIcon={<Iconify width={16} icon="eva:arrow-ios-back-fill" />}
                            sx={{ mt: 3 }}
                        >
                            Back to order list
                        </Button>
                    }
                    sx={{ py: 10, height: 'auto', flexGrow: 'unset' }}
                />
            </DashboardContent>
        );
    }

    const metadata = { title: `${order.data.order_id} - ${CONFIG.appName}` };

    return (
        <>
            <Helmet>
                <title>{metadata.title}</title>
            </Helmet>

            <OrderDetailsView order={order.data} />
        </>
    );
}
