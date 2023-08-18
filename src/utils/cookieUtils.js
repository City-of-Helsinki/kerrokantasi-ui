import { isCookiebotEnabled, cookieBotAddListener, cookieBotRemoveListener, getCookieBotScripts } from './cookiebotUtils';
import config from '../config';
import setupMatomo from './matomo';


function getCookie(name) {
  const cookie = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
  return decodeURIComponent(cookie ? cookie.at(2) : '');
}

export function enableMatomoTracking() {
  // eslint-disable-next-line no-underscore-dangle
  window._paq.push(['setConsentGiven']);
}

/**
 * Initial check on page load to enable cookies if
 * consent has been given on previous visit to page
 * Expects consents to be stored in format of {consentName: Boolean, consentName: Boolean}
 */
export function checkCookieConsent() {
  const cookies = getCookie('city-of-helsinki-cookie-consents');
  let consents = {};
  if (cookies) {
    consents = JSON.parse(cookies);
  }
  if (consents.matomo === true) {
    enableMatomoTracking();
  }
}

function cookieOnComponentDidMount() {
  if (isCookiebotEnabled()) {
    cookieBotAddListener();
  } else if (config.enableCookies) {
    checkCookieConsent();
  }
}

export function cookieOnComponentWillUnmount() {
  if (isCookiebotEnabled()) {
    cookieBotRemoveListener();
  }
}

/**
 * This is the initial setup for trackers that can be disabled on initialization.
 */
function addCookieScripts() {
  setupMatomo();
  return true;
}

/**
 * Returns a script element based on config settings with src urls.analytics
 * or null when cookies are not enabled.
 * @returns {JSX.Element|null} script element or null
 */
export function getCookieScripts() {
  if (isCookiebotEnabled()) {
    return getCookieBotScripts();
  }

  if (config.enableCookies) {
    return addCookieScripts();
  }
  return null;
}

export function getHDSCookieConfig(siteName, language, setLanguage, modal = true) {
  const cookieConfig = {
    siteName,
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
    onAllConsentsGiven: (consents) => {
      // called when consents are saved
      // handle changes like:
      if (consents.matomo) {
        enableMatomoTracking();
      }
    },
  };
  if (modal) {
    config.focusTargetSelector = '#focused-element-after-cookie-consent-closed';
  }
  return cookieConfig;
}

export default {
  cookieOnComponentDidMount,
  cookieOnComponentWillUnmount,
  getCookieScripts,
  checkCookieConsent,
  enableMatomoTracking,
  getHDSCookieConfig,
};
