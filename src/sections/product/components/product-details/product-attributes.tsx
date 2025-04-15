import type { TProductAttributeItem } from 'src/types/product';

import { startCase } from 'lodash';

import { Box, Stack, Typography } from '@mui/material';

import { EmptyContent } from 'src/components/empty-content';

type Props = {
  attributes?: TProductAttributeItem[];
};

const ProductAttributes = ({ attributes }: Props) => {
  if (!attributes || attributes.length === 0)
    return <EmptyContent title="No attributes found" sx={{ pt: 6, pb: 10 }} />;
  return (
    <Box sx={{ p: 5 }}>
      {attributes.map((attribute) => (
        <Stack direction="row" alignItems="center" gap={1} key={attribute.title}>
          <Typography variant="caption" sx={{ fontSize: '1rem' }}>
            {startCase(attribute.title)}:
          </Typography>
          <Typography variant="caption" sx={{ fontSize: '1rem', color: 'text.secondary' }}>
            {attribute.value.map((v) => startCase(v)).join(', ')}
          </Typography>
        </Stack>
      ))}
    </Box>
  );
};

export default ProductAttributes;
