import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { BrandView } from 'src/sections/brand/view/brand-view';

// ----------------------------------------------------------------------

const metadata = { title: `Brand | ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <BrandView />
    </>
  );
}
