import React, { useState } from 'react';
import { CookieModal } from 'hds-react';

import { getHDSCookieConfig } from '../../utils/cookieUtils';
import config from '../../config';

function CookieBar() {
  const siteName = document.querySelector("meta[property='og:title']").getAttribute('content');
  const [language, setLanguage] = useState(config.activeLanguage);
  const getCookieModalConfig = () => getHDSCookieConfig(siteName, language, setLanguage);

  return <CookieModal contentSource={getCookieModalConfig()} />;
}

export default CookieBar;
