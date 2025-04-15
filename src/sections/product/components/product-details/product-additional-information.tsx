import type { Theme, SxProps } from '@mui/material/styles';

import { Markdown } from 'src/components/markdown';
import { EmptyContent } from 'src/components/empty-content';

// ----------------------------------------------------------------------

type Props = {
  additional_information?: string;
  sx?: SxProps<Theme>;
};

export function ProductAdditionalInformation({ additional_information, sx }: Props) {
  if (!additional_information || additional_information === '')
    return <EmptyContent title="No additional information found" sx={{ pt: 6, pb: 10 }} />;
  return (
    <Markdown
      children={additional_information}
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
