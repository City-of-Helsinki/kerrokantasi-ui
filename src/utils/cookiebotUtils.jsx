/* eslint-disable no-underscore-dangle */
import config from '../config';

// Track previous consent state to detect changes
let previousConsentState = null;

/**
 * Reset the module state (for testing purposes)
 * @private
 */
export function resetCookiebotState() {
  previousConsentState = null;
}

/**
 * Returns whether Cookiebot is enabled and should be used or not.
 * @returns {boolean} true when Cookiebot is enabled, else false if not.
 */
export function isCookiebotEnabled() {
  return config.enableCookies && config.enableCookiebot;
}

/**
 * Gets the consent status for a specific cookie group from Cookiebot.
 * @param {string} group - Cookie group ('marketing', 'statistics', 'preferences', 'necessary')
 * @returns {boolean} true if consent is given, false otherwise
 */
export function getCookiebotConsent(group) {
  if (!isCookiebotEnabled() || !window?.Cookiebot?.consent) return false;
  return window.Cookiebot.consent[group] ?? false;
}

/**
 * Sets the cookiebot banner's header img src to empty string,
 * so the image specified by the style rules is shown instead.
 */
export function cookieBotImageOverride() {
  document.getElementById('CybotCookiebotDialogPoweredbyImage').src = '';
}

/**
 * Handle Cookiebot consent accept event
 */
export function cookieBotOnAccept() {
  if (!window?.Cookiebot) return;

  // Handle statistics/Matomo consent
  if (window.Cookiebot.consent?.statistics) {
    // Enable Matomo tracking
    if (window._paq) {
      window._paq.push(['setConsentGiven']);
      window._paq.push(['setCookieConsentGiven']);
    }
  }

  // Get preferences adn marketing consent
  const currentPreferences = window.Cookiebot.consent?.preferences || false;
  const currentMarketing = window.Cookiebot.consent?.marketing || false;

  // Determine if we should reload
  let shouldReload = false;

  // If we have previous state, check if relevant consents changed
  if (previousConsentState !== null) {
    const preferencesChanged = previousConsentState.preferences !== currentPreferences;
    const marketingChanged = previousConsentState.marketing !== currentMarketing;

    // Reload only if preferences or marketing consent changed and user just responded
    if (window.Cookiebot.hasResponse && (preferencesChanged || marketingChanged)) {
      shouldReload = true;
    }
  } else if (window.Cookiebot.hasResponse && (currentPreferences || currentMarketing)) {
    // First time accepting - reload if user enabled preferences or marketing
    shouldReload = true;
  }

  // Update stored consent state for next comparison (before reloading)
  previousConsentState = {
    preferences: currentPreferences,
    marketing: currentMarketing,
  };

  // Reload if needed
  if (shouldReload) {
    // Reload page to load/unload external media (YouTube, Vimeo, etc.)
    window.location.reload();
  }
}

/**
 * Handle Cookiebot consent decline event
 */
export function cookieBotOnDecline() {
  // Remove Matomo consent
  if (window._paq) {
    window._paq.push(['forgetConsentGiven']);
  }
}

/**
 * Add event listeners for Cookiebot.
 */
export function cookieBotAddListeners() {
  if (isCookiebotEnabled()) {
    window.addEventListener('CookiebotOnDialogDisplay', cookieBotImageOverride);
    window.addEventListener('CookiebotOnAccept', cookieBotOnAccept);
    window.addEventListener('CookiebotOnDecline', cookieBotOnDecline);
  }
}

/**
 * Remove event listeners for Cookiebot.
 */
export function cookieBotRemoveListeners() {
  if (isCookiebotEnabled()) {
    window.removeEventListener('CookiebotOnDialogDisplay', cookieBotImageOverride);
    window.removeEventListener('CookiebotOnAccept', cookieBotOnAccept);
    window.removeEventListener('CookiebotOnDecline', cookieBotOnDecline);
  }
}

/**
 * Returns the Cookiebot script element
 * @returns {JSX.Element} script element
 */
export function getCookieBotScripts() {
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

export default {
  cookieBotAddListeners,
  cookieBotImageOverride,
  cookieBotOnAccept,
  cookieBotOnDecline,
  cookieBotRemoveListeners,
  getCookieBotScripts,
  getCookiebotConsent,
  isCookiebotEnabled,
};
