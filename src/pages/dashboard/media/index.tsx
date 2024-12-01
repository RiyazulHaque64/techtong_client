import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { MediaView } from 'src/sections/media/view';

// ----------------------------------------------------------------------

const metadata = { title: `Media | ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <MediaView />
    </>
  );
}
