import type { TErrorData } from 'src/redux/interfaces/common';

import { m } from 'framer-motion';

import { Stack } from '@mui/material';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import { RouterLink } from 'src/routes/components';

import { getErrorName } from 'src/utils/helper';

import { ServerErrorIllustration } from 'src/assets/illustrations';

import { varBounce, MotionContainer } from 'src/components/animate';

export function FetchingError({
  errorResponse,
  statusCode,
}: {
  errorResponse?: TErrorData;
  statusCode?: number;
}) {
  return (
    <Stack
      direction="column"
      alignItems="center"
      component={MotionContainer}
      sx={{ px: 4, py: { xs: 8, sm: 6, lg: 7 } }}
    >
      <m.div variants={varBounce().in}>
        <Typography variant="h3" sx={{ mb: 1 }}>
          {statusCode || 500} {getErrorName(statusCode || 500)}
        </Typography>
      </m.div>

      <m.div variants={varBounce().in}>
        <Typography sx={{ color: 'text.secondary' }}>
          {errorResponse?.message ? errorResponse.message : 'Internal Server Error'}
        </Typography>
      </m.div>

      <m.div variants={varBounce().in}>
        <ServerErrorIllustration sx={{ my: { xs: 4, sm: 6 } }} />
      </m.div>

      <Button component={RouterLink} href="/" size="large" variant="contained">
        Go to home
      </Button>
    </Stack>
  );
}
