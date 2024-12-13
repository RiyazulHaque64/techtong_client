import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { AttributeView } from 'src/sections/attribute/view';

// ----------------------------------------------------------------------

const metadata = { title: `Attribute | ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <AttributeView />
    </>
  );
}
