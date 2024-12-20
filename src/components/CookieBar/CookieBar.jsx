/* eslint-disable import/no-unresolved */
import React, { useState } from 'react';
import { CookieModal } from 'hds-react';
import settings from '@city-assets/settings.json';

import { getHDSCookieConfig } from '../../utils/cookieUtils';
import config from '../../config';

function CookieBar() {
  const siteName = settings.meta.title || 'Kerrokantasi';
  const [language, setLanguage] = useState(config.activeLanguage);
  const getCookieModalConfig = () => getHDSCookieConfig(siteName, language, setLanguage);

  return <CookieModal contentSource={getCookieModalConfig()} />;
}

export default CookieBar;
