import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { CookiePage } from 'hds-react';
import { getHDSCookieConfig} from '../../utils/cookieUtils';
import config from '../../config';

const CookieManagement = () => {
    const siteName = document.querySelector("meta[property='og:title']").getAttribute('content');
    const [language, setLanguage] = useState(config.activeLanguage);
    const getCookiePageConfig = () => {
        return getHDSCookieConfig(siteName, language, setLanguage, false);
      };
    return (
        <main>
            <Helmet>
                <title>Kerrokantasi</title>
            </Helmet>
            <CookiePage contentSource={getCookiePageConfig()} />
        </main>
    );
}

export default CookieManagement;