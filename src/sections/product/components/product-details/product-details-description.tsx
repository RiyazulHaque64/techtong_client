import type { Theme, SxProps } from '@mui/material/styles';

import { Markdown } from 'src/components/markdown';
import { EmptyContent } from 'src/components/empty-content';

// ----------------------------------------------------------------------

type Props = {
  description?: string;
  sx?: SxProps<Theme>;
};

export function ProductDetailsDescription({ description, sx }: Props) {
  if (!description || description === '')
    return <EmptyContent title="No description found" sx={{ pt: 6, pb: 10 }} />;
  return (
    <Markdown
      children={description}
      sx={{
        p: 3,
        '& p, li, ol, table': {
          typography: 'body2',
        },
        '& table': {
          mt: 2,
          maxWidth: 640,
          '& td': { px: 2 },
          '& td:first-of-type': { color: 'text.secondary' },
          'tbody tr:nth-of-type(odd)': { bgcolor: 'transparent' },
        },
        ...sx,
      }}
    />
  );
}
