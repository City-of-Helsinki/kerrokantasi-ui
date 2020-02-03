import React from 'react';
import CookieConsent from 'react-cookie-consent';
import getMessage from '../../utils/getMessage';
// eslint-disable-next-line import/no-unresolved
import urls from '@city-assets/urls.json';

function CookieBar() {
  return (
    <CookieConsent
      buttonId="cookie-accept-button"
      buttonText={getMessage('cookieBar.accept')}
      contentClasses="cookie-content"
      declineButtonId="cookie-decline-button"
      declineButtonText={getMessage('cookieBar.decline')}
      disableStyles
      enableDeclineButton
      expires={90}
      onDecline={() => { window.location.replace(urls.city); }}
      setDeclineCookie={false}
    >
      {getMessage('cookieBar.description')}
      <div>
        <a
          id="cookiebar-link"
          href={getMessage('cookieBar.link.href')}
        >
          {getMessage('cookieBar.link.text')}
        </a>
      </div>
    </CookieConsent>
  );
}

export default CookieBar;
