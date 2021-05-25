import React from 'react';
import CookieConsent from 'react-cookie-consent';
import getMessage from '../../utils/getMessage';
import {addCookieScript} from "../../utils/cookieUtils";
import CookieManagementModal from "./CookieManagementModal";

export class CookieBar extends React.Component {
  state = {
    showCookieManagementModal: false,
  };

  openCookieManagementModal = () => {
    this.setState({showCookieManagementModal: true});
  };

  closeCookieManagementModal = () => {
    this.setState({showCookieManagementModal: false});
  };

  handleKeyDown = (ev) => {
    if (ev && ev.key === "Enter") {
      this.openCookieManagementModal();
    }
  };

  render() {
    return (
      <React.Fragment>
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
          flipButtons
        >
          <h3 id="cookiebar-title">{getMessage('cookieBar.title')}</h3>
          <p id="cookiebar-content">{getMessage('cookieBar.description')}</p>

          <a
            id="cookiebar-link"
            tabIndex="0"
            role="button"
            onClick={() => this.openCookieManagementModal()}
            onKeyDown={(ev) => this.handleKeyDown(ev)}
          >
            {getMessage('cookieBar.link.text')}
          </a>
        </CookieConsent>
        <CookieManagementModal
          isOpen={this.state.showCookieManagementModal}
          close={this.closeCookieManagementModal}
        />
      </React.Fragment>
    );
  }
}

export default CookieBar;
