import { Stack, Typography } from '@mui/material';

import { EmptyContent } from 'src/components/empty-content';

type Props = {
  video_url?: string;
};
const ProductVideo = ({ video_url }: Props) => {
  if (!video_url || video_url === '')
    return <EmptyContent title="No video found" sx={{ pt: 6, pb: 10 }} />;
  return (
    <Stack direction="row" alignItems="center" justifyContent="center" sx={{ py: 10 }}>
      <Typography variant="caption" sx={{ fontSize: '2rem' }}>
        Product Video
      </Typography>
    </Stack>
  );
};

export default ProductVideo;
