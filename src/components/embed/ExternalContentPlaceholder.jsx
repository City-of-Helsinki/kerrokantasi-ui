import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';
import { Button, Notification, IconLinkExternal } from 'hds-react';

import { convertEmbedToViewUrl } from '../../utils/externalContent';
import { useHDSCookieContext } from '../../hooks/useCookieConsent';
import { isCookiebotEnabled } from '../../utils/cookiebotUtils';

/**
 * Safely extracts hostname from URL, falling back to the raw string if URL is invalid
 */
const getDomainFromUrl = (url) => {
  if (!url) return '';
  try {
    return new URL(url).hostname;
  } catch {
    return url;
  }
};

/**
 * Placeholder component shown when external content (iframe) cannot be displayed
 * due to missing cookie consent.
 * Works with both HDS Cookie Consent and Cookiebot.
 */
const ExternalContentPlaceholder = ({ url }) => {
  const intl = useIntl();
  const viewUrl = convertEmbedToViewUrl(url);
  const domain = getDomainFromUrl(url);
  const cookieConsent = useHDSCookieContext();

  const handleOpenSettings = () => {
    if (isCookiebotEnabled()) {
      window?.Cookiebot?.renew();
    } else {
      cookieConsent?.openBanner();
    }
  };

  return !url ? null :(
    <Notification
      type='info'
      label={<FormattedMessage id='externalContentBlocked' />}
      style={{ marginTop: 0, marginBottom: 'var(--spacing-xs)' }}
    >
      <p style={{ marginBottom: 'var(--spacing-m)' }}>
        <FormattedMessage id='externalContentBlockedDescription' values={{ url: domain }} />
      </p>
      <div style={{ display: 'flex', gap: 'var(--spacing-s)', flexWrap: 'wrap' }}>
        <Button
          variant='secondary'
          size='small'
          onClick={() => window.open(viewUrl, '_blank', 'noopener,noreferrer')}
          iconRight={<IconLinkExternal />}
          aria-label={intl.formatMessage({ id: 'openExternalSiteAriaLabel' }, { domain })}
        >
          <FormattedMessage id='openExternalSite' />
        </Button>
        <Button
          variant='primary'
          size='small'
          onClick={handleOpenSettings}
          aria-label={intl.formatMessage({ id: 'editCookieSettingsAriaLabel' })}
        >
          <FormattedMessage id='editCookieSettings' />
        </Button>
      </div>
    </Notification>
  );
};

ExternalContentPlaceholder.propTypes = {
  url: PropTypes.string,
};

export default ExternalContentPlaceholder;
