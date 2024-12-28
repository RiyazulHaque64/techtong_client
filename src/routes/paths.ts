export const paths = {
  faqs: '/faqs',
  minimalStore: 'https://mui.com/store/items/minimal-dashboard/',
  // AUTH
  auth: {
    login: '/login',
    forgot_password: `/forgot-password`,
    change_password: '/change-password',
    update_profile: '/update-profile',
  },
  // DASHBOARD
  dashboard: {
    root: '/',
    media: `/media`,
    brand: `/brand`,
    category: `/category`,
    product: `/product`,
    add_product: `/product/add`,
    edit_product: (id: string) => `/product/${id}/edit`,
    details_product: (id: string) => `/product/${id}`,
    attribute: `/attribute`,
    three: `/three`,
    group: {
      root: `/group`,
      five: `/group/five`,
      six: `/group/six`,
    },
  },
};
