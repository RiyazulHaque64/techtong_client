import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { ProductListView } from 'src/sections/product/view/product-list-view';

// ----------------------------------------------------------------------

const metadata = { title: `Products - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <ProductListView />
    </>
  );
}
