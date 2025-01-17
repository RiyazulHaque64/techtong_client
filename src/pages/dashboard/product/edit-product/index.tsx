import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { ProductEditView } from 'src/sections/product/view';

// ----------------------------------------------------------------------

const metadata = { title: `Edit Product | ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <ProductEditView />
    </>
  );
}
