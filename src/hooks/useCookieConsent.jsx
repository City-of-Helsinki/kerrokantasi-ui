import { useState, useEffect } from 'react';
import { useCookieConsentContext, useGroupConsent } from 'hds-react';

import { getCookiebotConsent, isCookiebotEnabled } from '../utils/cookiebotUtils';

/**
 * Safe wrappers for HDS cookie consent hooks.
 * When Cookiebot is enabled, the HDS CookieConsentContextProvider is not rendered,
 * so calling HDS hooks would throw errors. These wrappers catch those errors and provide fallback values.
 */

/**
 * Safely get cookie consent context
 * @returns {Object|null} Cookie consent context or null if provider not available
 */
export const useHDSCookieContext = () => {
  try {
    return useCookieConsentContext();
  } catch {
    return null;
  }
};

/**
 * Safely get group consent status
 * @param {string} group - Cookie group to check
 * @returns {boolean} Consent status or false if provider not available
 */
export const useHDSGroupConsent = (group) => {
  try {
    return useGroupConsent(group);
  } catch {
    return false;
  }
};

/**
 * Hook that checks if user has given consent for a specific cookie group.
 * Works with both HDS Cookie Consent and Cookiebot.
 *
 * @param {string} group - Cookie group to check ('marketing', 'statistics', 'preferences', 'essential')
 * @returns {boolean} True if consent is given for the specified group
 *
 * @example
 * const hasMarketing = useHasConsentGroup('marketing');
 * const hasStatistics = useHasConsentGroup('statistics');
 */
export const useHasConsentGroup = (group) => {
  const hasHdsGroupConsent = useHDSGroupConsent(group);
  const [cookiebotConsent, setCookiebotConsent] = useState(() => getCookiebotConsent(group));

  useEffect(() => {
    if (!isCookiebotEnabled()) return;

    const updateConsent = () => {
      setCookiebotConsent(getCookiebotConsent(group));
    };

    // Listen to Cookiebot consent events
    window.addEventListener('CookiebotOnAccept', updateConsent);
    window.addEventListener('CookiebotOnDecline', updateConsent);
    window.addEventListener('CookiebotOnLoad', updateConsent);

    // Initial check
    updateConsent();

    return () => {
      window.removeEventListener('CookiebotOnAccept', updateConsent);
      window.removeEventListener('CookiebotOnDecline', updateConsent);
      window.removeEventListener('CookiebotOnLoad', updateConsent);
    };
  }, [group]);

  if (isCookiebotEnabled()) {
    return cookiebotConsent;
  }

  return hasHdsGroupConsent;
};

export default {
  useHDSCookieContext,
  useHDSGroupConsent,
  useHasConsentGroup,
};
