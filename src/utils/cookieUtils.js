/* eslint-disable react/self-closing-comp */
import React from 'react';
// eslint-disable-next-line import/no-unresolved
import urls from '@city-assets/urls.json';
import cookiebotUtils from './cookiebotUtils';
import config from '../config';

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
 * Returns a default cookie script element with src urls.analytics
 * @returns {JSX.Element} script element
 */
export function getDefaultCookieScripts() {
  return (
    <script
      type="text/javascript"
      src={urls.analytics}
    >
    </script>
  );
}

/**
 * Checks if cookie with the name 'CookieConsent' exists.
 * If it exists and its value is 'true' -> addCookieScript() is called.
 * @example
 * const consentValue = document.cookie.split('; ')
 * .find(row => row.startsWith('CookieConsent')).split('=')[1];
 * if (consentValue === 'true') { addCookieScript(); }
 */
function checkCookieConsent() {
  if (document.cookie.split('; ').find(row => row.startsWith('CookieConsent'))) {
    const consentValue = document.cookie.split('; ').find(row => row.startsWith('CookieConsent')).split('=')[1];
    if (consentValue === 'true') {
      addCookieScript();
    }
  }
}

/**
 * Creates new script element with src from urls.analytics.
 *
 * Checks if a script element with that src already exists, if not then the element is appended to <head> .
 */
function addCookieScript() {
  const scriptElements = Object.values(document.getElementsByTagName('head')[0].getElementsByTagName('script'));
  if (!scriptElements.find(element => element.src.includes(urls.analytics))) {
    const cookieScript = document.createElement('script');
    cookieScript.type = 'text/javascript';
    cookieScript.src = `${urls.analytics}`;
    document.getElementsByTagName('head')[0].appendChild(cookieScript);
  }
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
    return getDefaultCookieScripts();
  }
  return null;
}

export default {
  cookieOnComponentDidMount,
  cookieOnComponentWillUnmount,
  getDefaultCookieScripts,
  getCookieScripts,
  checkCookieConsent,
};
