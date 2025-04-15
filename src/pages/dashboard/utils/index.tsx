
import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { UtilsView } from 'src/sections/utils/view/utils-view';

// ----------------------------------------------------------------------

const metadata = { title: `Utils - ${CONFIG.appName}` };

export default function Page() {

    return (
        <>
            <Helmet>
                <title>{metadata.title}</title>
            </Helmet>

            <UtilsView />
        </>
    );
}
