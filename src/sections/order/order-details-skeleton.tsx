import type { Grid2Props } from '@mui/material/Unstable_Grid2';

import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';

// ----------------------------------------------------------------------

export function OrderDetailsSkeleton({ ...other }: Grid2Props) {
    return (
        <>
            <Stack direction='row' justifyContent='space-between' sx={{ mb: 5 }}>
                <Skeleton sx={{ height: 40, width: '40%' }} />
                <Skeleton sx={{ height: 40, width: '30%' }} />
            </Stack>
            <Grid container spacing={3}>
                <Grid xs={12} md={8}>
                    <Stack spacing={3} direction={{ xs: 'column-reverse', md: 'column' }}>
                        <Skeleton sx={{ height: 500 }} />

                        <Skeleton sx={{ height: 300 }} />
                    </Stack>
                </Grid>

                <Grid xs={12} md={4}>
                    <Stack direction='column' spacing={3}>
                        <Skeleton sx={{ height: 200 }} />
                        <Skeleton sx={{ height: 180 }} />
                        <Skeleton sx={{ height: 180 }} />
                        <Skeleton sx={{ height: 190 }} />
                    </Stack>
                </Grid>
            </Grid>
        </>
    );
}
