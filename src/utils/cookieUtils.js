/* eslint-disable react/self-closing-comp */
import React from 'react';
// eslint-disable-next-line import/no-unresolved
import urls from '@city-assets/urls.json';
import cookiebotUtils from './cookiebotUtils';
import config from '../config';

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
 * Returns a script element based on config settings with src urls.analytics
 * or null when cookies are not enabled.
 * @returns {JSX.Element|null} script element or null
 */
export function getCookieScripts() {
  if (cookiebotUtils.isCookiebotEnabled()) {
    return cookiebotUtils.getCookieScripts();
  } else if (config.enableCookies) {
    return getDefaultCookieScripts();
  }
  return null;
}

export default {
  getDefaultCookieScripts,
  getCookieScripts,
};
