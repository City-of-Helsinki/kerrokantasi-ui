/* eslint-disable no-underscore-dangle */
/* eslint-disable import/no-unresolved */
import siteSettings from '@city-assets/cookieConfig.json';

import { MAIN_CONTAINER_ID } from '../constants';

export const COOKIE_CONSENT_GROUP = {
  Essential: 'essential',
  Statistics: 'statistics',
};

const useCookieConsentSettings = (locale = 'fi') => {
  const cookieConsentProps = {
    onChange: (changeEvent) => {
      const { acceptedGroups } = changeEvent;

      const hasStatisticsConsent = acceptedGroups.includes(COOKIE_CONSENT_GROUP.Statistics);

      if (hasStatisticsConsent) {
        //  start tracking
        globalThis._paq.push(['setConsentGiven']);
        globalThis._paq.push(['setCookieConsentGiven']);
      } else {
        // tell matomo to forget conset
        globalThis._paq.push(['forgetConsentGiven']);
      }
    },
    siteSettings: siteSettings,
    options: { focusTargetSelector: `#${MAIN_CONTAINER_ID}`, language: locale },
  };

  return cookieConsentProps;
};

export default useCookieConsentSettings;
