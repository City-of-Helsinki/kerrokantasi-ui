/* eslint-disable react/self-closing-comp */
import cookiebotUtils from './cookiebotUtils';
import config from '../config';
/* eslint-disable import/no-unresolved */
/* eslint-disable import/extensions */
import setupMatomo from '@city-assets/js/piwik';


function getCookie(name) {
  const cookie = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
  return decodeURIComponent(cookie ? cookie.at(2) : '');
}

function cookieOnComponentDidMount() {
  if (cookiebotUtils.isCookiebotEnabled()) {
    cookiebotUtils.cookieBotAddListener();
  } else if (config.enableCookies) {
    checkCookieConsent();
  }
}

function cookieOnComponentWillUnmount() {
  if (cookiebotUtils.isCookiebotEnabled()) {
    cookiebotUtils.cookieBotRemoveListener();
  }
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

export function enableMatomoTracking() {
  window._paq.push(['setConsentGiven']);
}

/**
 * This is the initial setup for trackers that can be disabled on initialization.
 */
function addCookieScripts() {
  setupMatomo();
}

/**
 * Returns a script element based on config settings with src urls.analytics
 * or null when cookies are not enabled.
 * @returns {JSX.Element|null} script element or null
 */
export function getCookieScripts() {
  if (cookiebotUtils.isCookiebotEnabled()) {
    return cookiebotUtils.getCookieBotScripts();
  } else if (config.enableCookies) {
    return addCookieScripts();
  }
  return null;
}


export default {
  cookieOnComponentDidMount,
  cookieOnComponentWillUnmount,
  getCookieScripts,
  checkCookieConsent,
  enableMatomoTracking,
};
