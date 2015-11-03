import React from 'react';
import {FormattedMessage} from 'react-intl';

class Footer extends React.Component {
  render() {
    const footer = this;
    return (
      <footer>
        <hr/>
        <div className="container">
          <a href="http://www.hel.fi/rekisteriseloste" target="_blank"><FormattedMessage id="privacyPolicy" /></a>
        </div>
      </footer>
    );
  }

}

export default Footer;
