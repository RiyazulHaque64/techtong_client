import type { TOrderHistory } from 'src/types/order';

import Timeline from '@mui/lab/Timeline';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import TimelineItem, { timelineItemClasses } from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { snakeCase } from 'src/utils/change-case';
import { fDateTime } from 'src/utils/format-time';

// ----------------------------------------------------------------------

type Props = {
    history: TOrderHistory[];
};

export function OrderDetailsHistory({ history }: Props) {
    const renderSummary = (
        <Paper
            variant="outlined"
            sx={{
                p: 2.5,
                gap: 2,
                minWidth: 260,
                flexShrink: 0,
                borderRadius: 2,
                display: 'flex',
                typography: 'body2',
                borderStyle: 'dashed',
                flexDirection: 'column',
            }}
        >
            <Stack spacing={0.5}>
                <Box sx={{ color: 'text.disabled' }}>Order time</Box>
                {fDateTime(history.find((item) => item.status === 'PENDING')?.created_at)}
            </Stack>
            {
                history.find((item) => item.status === 'CONFIRMED') && (
                    <Stack spacing={0.5}>
                        <Box sx={{ color: 'text.disabled' }}>Confirmed time</Box>
                        {fDateTime(history.find((item) => item.status === 'CONFIRMED')?.created_at)}
                    </Stack>
                )
            }
            {
                history.find((item) => item.status === 'SHIPPED') && (
                    <Stack spacing={0.5}>
                        <Box sx={{ color: 'text.disabled' }}>Shipping time</Box>
                        {fDateTime(history.find((item) => item.status === 'SHIPPED')?.created_at)}
                    </Stack>
                )
            }
            {
                history.find((item) => item.status === 'DELIVERED') && (
                    <Stack spacing={0.5}>
                        <Box sx={{ color: 'text.disabled' }}>Delivery time</Box>
                        {fDateTime(history.find((item) => item.status === 'DELIVERED')?.created_at)}
                    </Stack>
                )
            }
        </Paper>
    );

    const renderTimeline = (
        <Timeline
            sx={{ p: 0, m: 0, [`& .${timelineItemClasses.root}:before`]: { flex: 0, padding: 0 } }}
        >
            {history.map((item, index) => {
                const firstTimeline = index === 0;

                const lastTimeline = index === history.length - 1;

                return (
                    <TimelineItem key={item.id}>
                        <TimelineSeparator>
                            <TimelineDot color={(firstTimeline && 'primary') || 'grey'} />
                            {lastTimeline ? null : <TimelineConnector />}
                        </TimelineSeparator>

                        <TimelineContent>
                            <Typography variant="subtitle2">{item.remark || snakeCase(item.status)}</Typography>

                            <Box sx={{ color: 'text.disabled', typography: 'caption', mt: 0.5 }}>
                                by {item.created_by ? item.created_by.name : 'Customer'} at {fDateTime(item.created_at)}
                            </Box>
                        </TimelineContent>
                    </TimelineItem>
                );
            })}
        </Timeline>
    );

    return (
        <Card>
            <CardHeader title="History" />
            <Stack
                spacing={3}
                alignItems={{ md: 'flex-start' }}
                direction={{ xs: 'column-reverse', md: 'row' }}
                sx={{ p: 3 }}
            >
                {renderTimeline}

                {renderSummary}
            </Stack>
        </Card>
    );
}
