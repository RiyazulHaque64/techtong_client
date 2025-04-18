import { paths } from 'src/routes/paths';

import { CONFIG } from 'src/config-global';

import { SvgColor } from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name: string) => (
  <SvgColor src={`${CONFIG.assetsDir}/assets/icons/navbar/${name}.svg`} />
);

const ICONS = {
  media: icon('ic-media'),
  job: icon('ic-job'),
  blog: icon('ic-blog'),
  chat: icon('ic-chat'),
  mail: icon('ic-mail'),
  user: icon('ic-user'),
  file: icon('ic-file'),
  lock: icon('ic-lock'),
  tour: icon('ic-tour'),
  order: icon('ic-order'),
  label: icon('ic-label'),
  blank: icon('ic-blank'),
  kanban: icon('ic-kanban'),
  folder: icon('ic-folder'),
  course: icon('ic-course'),
  banking: icon('ic-banking'),
  booking: icon('ic-booking'),
  invoice: icon('ic-invoice'),
  product: icon('ic-product'),
  calendar: icon('ic-calendar'),
  disabled: icon('ic-disabled'),
  external: icon('ic-external'),
  menuItem: icon('ic-menu-item'),
  ecommerce: icon('ic-ecommerce'),
  analytics: icon('ic-analytics'),
  dashboard: icon('ic-dashboard'),
  parameter: icon('ic-parameter'),
  brand: icon('ic-brand'),
  category: icon('ic-category'),
  attribute: icon('ic-attribute'),
  utils: icon('ic-utils'),
};

// ----------------------------------------------------------------------

export const navData = [
  /**
   * Overview
   */
  {
    subheader: 'Overview 6.0.0',
    items: [
      { title: 'One', path: paths.dashboard.root, icon: ICONS.dashboard },
      { title: 'Media', path: paths.dashboard.media, icon: ICONS.media },
    ],
  },
  {
    subheader: 'Business Management',
    items: [
      {
        title: 'Order',
        path: paths.dashboard.order,
        icon: ICONS.order,
      },
      {
        title: 'Utils',
        path: paths.dashboard.utils,
        icon: ICONS.utils,
      }
    ],
  },
  {
    subheader: 'Product Management',
    items: [
      {
        title: 'Product',
        path: paths.dashboard.product,
        icon: ICONS.product,
        children: [
          { title: 'All Products', path: paths.dashboard.product },
          { title: 'Add Product', path: paths.dashboard.add_product },
        ],
      },
      {
        title: 'Brand',
        path: paths.dashboard.brand,
        icon: ICONS.brand,
      },
      {
        title: 'Category',
        path: paths.dashboard.category,
        icon: ICONS.category,
      },
      {
        title: 'Attribute',
        path: paths.dashboard.attribute,
        icon: ICONS.attribute,
      },
    ],
  },
];
