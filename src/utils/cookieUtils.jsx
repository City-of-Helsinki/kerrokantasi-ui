/* eslint-disable no-underscore-dangle */
/* eslint-disable import/no-unresolved */
import urls from '@city-assets/urls.json';
import siteSettings from '@city-assets/cookieConfig.json';

import { MAIN_CONTAINER_ID } from '../constants';

export const COOKIE_CONSENT_GROUP = {
  Essential: 'essential',
  Statistics: 'statistics',
  Marketing: 'marketing',
};

export const getCookieConsentSettings = (locale = 'fi') => {
  const cookieConsentProps = {
    onChange: (changeEvent) => {
      const { acceptedGroups } = changeEvent;

      const hasStatisticsConsent = acceptedGroups.includes(COOKIE_CONSENT_GROUP.Statistics);

      if (hasStatisticsConsent) {
        //  start tracking
        if (globalThis._paq) {
          globalThis._paq.push(['setConsentGiven']);
          globalThis._paq.push(['setCookieConsentGiven']);
        }
      } else {
        // tell matomo to forget consent
        if (globalThis._paq) {
          globalThis._paq.push(['forgetConsentGiven']);
        }
      }
    },
    siteSettings: siteSettings,
    options: { focusTargetSelector: `#${MAIN_CONTAINER_ID}`, language: locale },
  };

  return cookieConsentProps;
};

/**
 * Returns a script element with src urls.analytics if configured
 * This is for loading additional analytics scripts (e.g., Google Analytics,
 * legacy Piwik, etc. - not needed for Matomo which uses MatomoTracker)
 * @returns {JSX.Element|null} script element or null
 */
export function getLegacyAnalyticsScript() {
  if (urls.analytics && urls.analytics !== false) {
    return <script data-cookieconsent='statistics' src={urls.analytics} type='text/plain'></script>;
  }
  return null;
}

export default {
  getCookieConsentSettings,
  getLegacyAnalyticsScript,
};

