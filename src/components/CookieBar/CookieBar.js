import React from 'react';
import getMessage from '../../utils/getMessage';
import { CookieModal } from 'hds-react';
import { enableMatomoTracking } from "../../utils/cookieUtils";
import config from '../../config';

export class CookieBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = { language: config.activeLanguage };
  }

  onLanguageChange = (newLang) => this.setState({language: newLang});

  getCookieModalConfig = () => {
    return {
      siteName: getMessage('cookieBar.title'),
      currentLanguage: this.state.language,
      optionalCookies: {
        groups: [
          {
            commonGroup: 'statistics',
            cookies: [{
              commonCookie: 'matomo'
            }],
          },
        ],
      },
      language: {
        onLanguageChange: this.onLanguageChange,
      },
      focusTargetSelector: '#focused-element-after-cookie-consent-closed',
      onAllConsentsGiven: (consents) => {
        // called when consents are saved
        // handle changes like:
        if (consents.matomo) {
          enableMatomoTracking();
        }
      },
    };
  };

  render() {
    return (
      <React.Fragment>
        <CookieModal contentSource={this.getCookieModalConfig()} />
      </React.Fragment>
    );
  }
}

export default CookieBar;
