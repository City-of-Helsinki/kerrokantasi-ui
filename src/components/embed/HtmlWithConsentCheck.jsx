import React from 'react';
import PropTypes from 'prop-types';

import ExternalContentPlaceholder from './ExternalContentPlaceholder';
import SanitizedHtml from './SanitizedHtml';
import {
  extractIframes,
  replaceIframesWithPlaceholders,
} from '../../utils/externalContent';
import { useHasConsentGroup } from '../../hooks/useCookieConsent';
import { COOKIE_CONSENT_GROUP } from '../../utils/cookieUtils';

/**
 * Component that renders HTML content with consent-aware iframe handling.
 * Re-renders automatically when cookie consent changes (HDS or Cookiebot).
 */
const HtmlWithConsentCheck = ({ htmlString }) => {
  const hasMarketingConsent = useHasConsentGroup(COOKIE_CONSENT_GROUP.Marketing);

  const content = React.useMemo(() => {
    if (!htmlString) return null;

    const iframes = extractIframes(htmlString);
    const shouldRenderContentAsIs = iframes.length === 0 || hasMarketingConsent;

    return shouldRenderContentAsIs
      ? <SanitizedHtml html={htmlString} allowIframes={hasMarketingConsent} />
      : <>{replaceIframesWithPlaceholders(htmlString, iframes, ExternalContentPlaceholder)}</>;
  }, [htmlString, hasMarketingConsent]);

  return content;
};

HtmlWithConsentCheck.propTypes = {
  htmlString: PropTypes.string,
};

export default HtmlWithConsentCheck;
