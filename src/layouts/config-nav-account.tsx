import { paths } from 'src/routes/paths';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export const _account = [
  {
    label: 'Home',
    href: paths.dashboard.root,
    icon: <Iconify icon="tabler:home-filled" />,
  },
  {
    label: 'Update profile',
    href: paths.auth.update_profile,
    icon: <Iconify icon="fa6-solid:user-pen" />,
  },
  {
    label: 'Change password',
    href: paths.auth.change_password,
    icon: <Iconify icon="mdi:password-reset" />,
  },
];
