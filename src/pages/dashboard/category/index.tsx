import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { CategoryView } from 'src/sections/category/view';

// ----------------------------------------------------------------------

const metadata = { title: `Category | ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <CategoryView />
    </>
  );
}
