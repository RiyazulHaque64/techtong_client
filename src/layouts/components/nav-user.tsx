import type { StackProps } from '@mui/material/Stack';

import { m } from 'framer-motion';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { useTheme, alpha as hexAlpha } from '@mui/material/styles';

import { formatRole } from 'src/utils/helper';

import { CONFIG } from 'src/config-global';
import { useAppSelector } from 'src/redux/hooks';
import avatar from 'src/assets/images/avatar-17.webp';
import { varAlpha, bgGradient } from 'src/theme/styles';
import { selectCurrentUser } from 'src/redux/features/auth/authSlice';

// ----------------------------------------------------------------------

export function NavUser({ sx, ...other }: StackProps) {
  const user = useAppSelector(selectCurrentUser);
  const theme = useTheme();

  return (
    <Stack sx={{ px: 2, py: 5, textAlign: 'center', ...sx }} {...other}>
      <Stack alignItems="center">
        <Box>
          <Avatar src={user?.profile_pic || avatar} alt={user?.name} sx={{ width: 48, height: 48 }}>
            {user?.name?.charAt(0).toUpperCase()}
          </Avatar>
        </Box>

        <Stack spacing={0.5} sx={{ mb: 2, mt: 1.5, width: 1 }}>
          <Typography
            variant="subtitle2"
            noWrap
            sx={{ color: 'var(--layout-nav-text-primary-color)' }}
          >
            {user?.name}
          </Typography>

          <Typography
            variant="body2"
            noWrap
            sx={{ color: 'var(--layout-nav-text-disabled-color)' }}
          >
            {user?.email}
          </Typography>
          <Typography
            variant="body2"
            noWrap
            sx={{ color: 'var(--layout-nav-text-disabled-color)' }}
          >
            {user?.contact_number}
          </Typography>
        </Stack>
        <Typography
          noWrap
          component="span"
          sx={{
            backgroundColor: theme.palette.primary.lighter,
            color: theme.palette.primary.main,
            padding: '8px 20px',
            fontSize: 14,
            borderRadius: 8,
            fontWeight: 600,
          }}
        >
          {formatRole(user?.role || 'USER')}
        </Typography>
      </Stack>
    </Stack>
  );
}

// ----------------------------------------------------------------------

export function UpgradeBlock({ sx, ...other }: StackProps) {
  return (
    <Stack
      sx={{
        ...bgGradient({
          color: `135deg, ${hexAlpha('#F7BB95', 0.92)}, ${hexAlpha('#5B2FF3', 0.92)}`,
          imgUrl: `${CONFIG.assetsDir}/assets/background/background-7.webp`,
        }),
        px: 3,
        py: 4,
        borderRadius: 2,
        position: 'relative',
        ...sx,
      }}
      {...other}
    >
      <Box
        sx={{
          top: 0,
          left: 0,
          width: 1,
          height: 1,
          borderRadius: 2,
          position: 'absolute',
          border: (theme) => `solid 3px ${varAlpha(theme.vars.palette.common.whiteChannel, 0.16)}`,
        }}
      />

      <Box
        component={m.img}
        animate={{ y: [12, -12, 12] }}
        transition={{
          duration: 8,
          ease: 'linear',
          repeat: Infinity,
          repeatDelay: 0,
        }}
        alt="Small Rocket"
        src={`${CONFIG.assetsDir}/assets/illustrations/illustration-rocket-small.webp`}
        sx={{ right: 0, width: 112, height: 112, position: 'absolute' }}
      />

      <Stack alignItems="flex-start" sx={{ position: 'relative' }}>
        <Box component="span" sx={{ typography: 'h5', color: 'common.white' }}>
          35% OFF
        </Box>

        <Box
          component="span"
          sx={{ mb: 2, mt: 0.5, color: 'common.white', typography: 'subtitle2' }}
        >
          Power up Productivity!
        </Box>

        <Button variant="contained" size="small" color="warning">
          Upgrade to Pro
        </Button>
      </Stack>
    </Stack>
  );
}
