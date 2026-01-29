import {
  isCookiebotEnabled,
  cookieBotAddListener,
  cookieBotRemoveListener,
  getCookieBotScripts,
} from './cookiebotUtils';

function cookieOnComponentDidMount() {
  if (isCookiebotEnabled()) {
    cookieBotAddListener();
  }
}

export function cookieOnComponentWillUnmount() {
  if (isCookiebotEnabled()) {
    cookieBotRemoveListener();
  }
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

  return null;
}

export default {
  cookieOnComponentDidMount,
  cookieOnComponentWillUnmount,
  getCookieScripts,
};
