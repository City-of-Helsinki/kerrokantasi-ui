/* eslint-disable import/no-unresolved */

import React from 'react';
import urls from '@city-assets/urls.json';

import config from '../config';

/**
 * Returns whether Cookiebot is enabled and should be used or not.
 * @returns {boolean} true when Cookiebot is enabled, else false if not.
 */
export function isCookiebotEnabled() {
  return config.enableCookies && config.enableCookiebot;
}

/**
 * Sets the cookiebot banner's header img src to empty string,
 * so the image specified by the style rules is shown instead.
 */
export function cookieBotImageOverride() {
  document.getElementById('CybotCookiebotDialogPoweredbyImage').src = '';
}

/**
 * Add event listener that overrides the image served by cookiebot.
 */
export function cookieBotAddListener() {
  if (isCookiebotEnabled()) {
    window.addEventListener('CookiebotOnDialogDisplay', cookieBotImageOverride);
  }
}

/**
 * Remove event listener that overrides the image served by cookiebot.
 */
export function cookieBotRemoveListener() {
  if (isCookiebotEnabled()) {
    window.removeEventListener('CookiebotOnDialogDisplay', cookieBotImageOverride);
  }
}

/**
 * Returns the Cookiebot script element
 * @returns {JSX.Element} script element
 */
export function getCookieBotConsentScripts() {
  return (
    <script
      data-blockingmode='auto'
      data-cbid={config.cookiebotDataCbid}
      id='Cookiebot'
      src='https://consent.cookiebot.com/uc.js'
      type='text/javascript'
    ></script>
  );
}

/**
 * Returns a script element with src urls.analytics
 * @returns {JSX.Element} script element
 */
export function getCookieBotScripts() {
  return <script data-cookieconsent='statistics' src={urls.analytics} type='text/plain'></script>;
}

export default {
  cookieBotAddListener,
  cookieBotImageOverride,
  cookieBotRemoveListener,
  getCookieBotConsentScripts,
  getCookieBotScripts,
  isCookiebotEnabled,
};
