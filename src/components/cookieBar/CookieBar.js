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
      buttonWrapperClasses="cookie-buttons"
      declineButtonId="cookie-decline-button"
      declineButtonText={getMessage('cookieBar.decline')}
      disableStyles
      enableDeclineButton
      setDeclineCookie
      expires={90}
      onAccept={addCookieScript}
      flipButtons={true}
    >
      <h3 id="cookiebar-title">{getMessage('cookieBar.title')}</h3>
      <p id="cookiebar-content">{getMessage('cookieBar.description')}</p>

      <a
        id="cookiebar-link"
        href={getMessage('cookieBar.link.href')}
      >
        {getMessage('cookieBar.link.text')}
      </a>
    </CookieConsent>
  );
}

export default CookieBar;
