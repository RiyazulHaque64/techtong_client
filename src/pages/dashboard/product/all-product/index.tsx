import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { AllProductView } from 'src/sections/product/view/all-product-view';

// ----------------------------------------------------------------------

const metadata = { title: `Products - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <AllProductView />
    </>
  );
}
