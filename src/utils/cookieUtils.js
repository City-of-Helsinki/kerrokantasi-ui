/* eslint-disable react/self-closing-comp */
import config from '../config';
import React from 'react';
// eslint-disable-next-line import/no-unresolved
import urls from '@city-assets/urls.json';
/**
 * Add event listener that overrides the image served by cookiebot.
 */
export function cookieBotAddListener() {
  if (config.enableCookies) {
    window.addEventListener('CookiebotOnDialogDisplay', cookieBotImageOverride);
  }
}

/**
 * Remove event listener that overrides the image served by cookiebot.
 */
export function cookieBotRemoveListener() {
  if (config.enableCookies) {
    window.removeEventListener('CookiebotOnDialogDisplay', cookieBotImageOverride);
  }
}

/**
 * Sets the cookiebot banner's header <img> src to empty string,
 * so the image specified by the style rules is shown instead.
 */
export function cookieBotImageOverride() {
  document.getElementById('CybotCookiebotDialogPoweredbyImage').src = '';
}

/**
 * Returns the Cookiebot <script> element
 * @returns {JSX.Element}
 */
export function getConsentScripts() {
  return (
    <script
      data-blockingmode="auto"
      data-cbid="92860cd1-d931-4496-8621-2adb011dafb0"
      id="Cookiebot"
      src="https://consent.cookiebot.com/uc.js"
      type="text/javascript"
    >
    </script>
  );
}

/**
 * Returns a <script> element with src urls.analytics
 * @returns {JSX.Element}
 */
export function getCookieScripts() {
  return (
    <script
      type="text/plain"
      src={urls.analytics}
      data-cookieconsent="statistics"
    >
    </script>
  );
}

export default {
  cookieBotAddListener,
  cookieBotRemoveListener,
  cookieBotImageOverride,
  getConsentScripts,
  getCookieScripts
};
