import type { TProductReview } from 'src/types/product';

import Stack from '@mui/material/Stack';
import Rating from '@mui/material/Rating';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';

import { fDate } from 'src/utils/format-time';

import { CONFIG } from 'src/config-global';

// ----------------------------------------------------------------------

type Props = {
  review: TProductReview;
};

export function ProductReviewItem({ review }: Props) {
  const renderInfo = (
    <Stack
      spacing={2}
      alignItems="center"
      direction={{ xs: 'row', md: 'column' }}
      sx={{ width: { md: 240 }, textAlign: { md: 'center' } }}
    >
      <Avatar
        src={`${CONFIG.bucket.url}/${CONFIG.bucket.name}/${review?.user?.profile_pic}`}
        sx={{ width: { xs: 48, md: 64 }, height: { xs: 48, md: 64 } }}
      />

      <ListItemText
        primary={review.user.name}
        secondary={fDate(review.created_at)}
        primaryTypographyProps={{ noWrap: true, typography: 'subtitle2', mb: 0.5 }}
        secondaryTypographyProps={{ noWrap: true, typography: 'caption', component: 'span' }}
      />
    </Stack>
  );

  const renderContent = (
    <Stack spacing={1} flexGrow={1}>
      <Rating size="small" value={review.rating} precision={0.1} readOnly />

      <Typography variant="body2">{review?.comment}</Typography>
    </Stack>
  );

  return (
    <Stack
      spacing={2}
      direction={{ xs: 'column', md: 'row' }}
      sx={{ mt: 5, px: { xs: 2.5, md: 0 } }}
    >
      {renderInfo}

      {renderContent}
    </Stack>
  );
}
