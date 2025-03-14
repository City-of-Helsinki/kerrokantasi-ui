/* eslint-disable import/no-unresolved */
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { CookiePage } from 'hds-react';
import settings from '@city-assets/settings.json';

import { getHDSCookieConfig } from '../../utils/cookieUtils';
import config from '../../config';

const CookieManagement = () => {
  const siteName = settings.meta.title || 'Kerrokantasi';
  const [language, setLanguage] = useState(config.activeLanguage);
  const getCookiePageConfig = () => getHDSCookieConfig(siteName, language, setLanguage, false);
  return (
    <main>
      <Helmet>
        <title>Kerrokantasi</title>
      </Helmet>
      <CookiePage contentSource={getCookiePageConfig()} />
    </main>
  );
};

export default CookieManagement;
