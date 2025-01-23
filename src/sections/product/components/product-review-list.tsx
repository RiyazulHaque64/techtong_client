import type { TProductReview } from 'src/types/product';

import Pagination, { paginationClasses } from '@mui/material/Pagination';

import { ProductReviewItem } from './product-review-item';

// ----------------------------------------------------------------------

type Props = {
  reviews: TProductReview[];
};

export function ProductReviewList({ reviews }: Props) {
  return (
    <>
      {reviews.map((review) => (
        <ProductReviewItem key={review.id} review={review} />
      ))}

      {reviews.length !== 0 && (
        <Pagination
          count={10}
          sx={{
            mx: 'auto',
            [`& .${paginationClasses.ul}`]: { my: 5, mx: 'auto', justifyContent: 'center' },
          }}
        />
      )}
    </>
  );
}
