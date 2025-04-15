import type { TProductReview } from 'src/types/product';

import { LinearProgress } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Rating from '@mui/material/Rating';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { useBoolean } from 'src/hooks/use-boolean';

import { selectCurrentUser } from 'src/redux/features/auth/authSlice';
import { useAppSelector } from 'src/redux/hooks';

import { Iconify } from 'src/components/iconify';

import { RATINGS } from '../../utils';
import { ProductReviewList } from './product-review-list';
import { ProductReviewNewForm } from './product-review-new-form';

// ----------------------------------------------------------------------

type Props = {
  avg_rating?: number;
  reviews?: TProductReview[];
};

export function ProductDetailsReview({ avg_rating, reviews = [] }: Props) {
  const currentUser = useAppSelector(selectCurrentUser);
  const review = useBoolean();

  const groupByRating: Record<string, TProductReview[]> = reviews.reduce<
    Record<number, TProductReview[]>
  >((group, item) => {
    const rating = Math.round(item.rating);
    if (!group[rating]) group[rating] = [];
    group[rating].push(item);
    return group;
  }, {});

  console.log('group by rating: ', groupByRating);

  const renderSummary = (
    <Stack spacing={1} alignItems="center" justifyContent="center">
      <Typography variant="subtitle2">Average rating</Typography>

      <Typography variant="h2">
        {avg_rating || 0}
        /5
      </Typography>

      <Rating readOnly value={avg_rating} precision={0.1} />

      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
        {reviews.length} reviews
      </Typography>
    </Stack>
  );

  const renderProgress = (
    <Stack
      spacing={1.5}
      sx={{
        py: 5,
        px: { xs: 3, md: 5 },
        borderLeft: (theme) => ({ md: `dashed 1px ${theme.vars.palette.divider}` }),
        borderRight: (theme) => ({ md: `dashed 1px ${theme.vars.palette.divider}` }),
      }}
    >
      {RATINGS.map((item) => (
        <Stack key={item.value} direction="row" alignItems="center">
          <Typography variant="subtitle2" component="span" sx={{ width: 42 }}>
            {item.title}
          </Typography>

          <LinearProgress
            color="inherit"
            variant="determinate"
            value={
              groupByRating[item.value]?.length
                ? (groupByRating['5'].length / reviews.length) * 100
                : 0
            }
            sx={{ mx: 2, flexGrow: 1 }}
          />

          <Typography
            variant="body2"
            component="span"
            sx={{ minWidth: 48, color: 'text.secondary' }}
          >
            {groupByRating[item.value]?.length || 0}
          </Typography>
        </Stack>
      ))}
    </Stack>
  );

  const renderReviewButton = (
    <Stack alignItems="center" justifyContent="center">
      <Button
        size="large"
        variant="soft"
        color="inherit"
        onClick={review.onTrue}
        startIcon={<Iconify icon="solar:pen-bold" />}
        disabled={currentUser?.role === 'ADMIN' || currentUser?.role === 'SUPER_ADMIN'}
      >
        Write your review
      </Button>
    </Stack>
  );

  return (
    <>
      <Box
        display="grid"
        gridTemplateColumns={{ xs: 'repeat(1, 1fr)', md: 'repeat(3, 1fr)' }}
        sx={{ py: { xs: 5, md: 0 } }}
      >
        {renderSummary}

        {renderProgress}

        {renderReviewButton}
      </Box>

      <Divider sx={{ borderStyle: 'dashed' }} />

      <ProductReviewList reviews={reviews} />

      <ProductReviewNewForm open={review.value} onClose={review.onFalse} />
    </>
  );
}
