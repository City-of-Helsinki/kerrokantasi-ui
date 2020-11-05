import React from 'react';
import CookieConsent from 'react-cookie-consent';
import getMessage from '../../utils/getMessage';
import {addCookieScript} from "../../utils/cookieUtils";

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
      setDeclineCookie
      expires={90}
      onAccept={addCookieScript}
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
