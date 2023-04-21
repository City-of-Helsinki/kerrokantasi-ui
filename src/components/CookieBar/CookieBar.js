import React from 'react';
import { CookieModal } from 'hds-react';
import { enableMatomoTracking } from "../../utils/cookieUtils";
import { useState } from 'react';
import config from '../../config';

function CookieBar(props) {
  //state = { language: config.activeLanguage };

  const [language, setLanguage] = useState(config.activeLanguage);

  
  const getCookieModalConfig = () => {
    return {
      siteName: document.querySelector("meta[property='og:title']").getAttribute('content'),
      currentLanguage: language,
      optionalCookies: {
        groups: [
          {
            commonGroup: 'statistics',
            cookies: [{
              commonCookie: 'matomo'
            }],
          },
        ],
      },
      language: {
        onLanguageChange: setLanguage,
      },
      focusTargetSelector: '#focused-element-after-cookie-consent-closed',
      onAllConsentsGiven: (consents) => {
        // called when consents are saved
        // handle changes like:
        if (consents.matomo) {
          enableMatomoTracking();
        }
      },
    };
  };

  return (
    <CookieModal contentSource={getCookieModalConfig()} />
  );
}

export default CookieBar;
