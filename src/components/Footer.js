import React from 'react';
import {FormattedMessage} from 'react-intl';
import {Link} from 'react-router';

export default class Footer extends React.Component {
  render() {
    return (
      <footer>
        <div className="container">
          <div className="logo">
            <Link to="/">
              <img alt="City of Helsinki" src="/assets/images/helsinki-coat-of-arms-black-big.png"/>
              <span>Kerrokantasi</span>
            </Link>
          </div>
          <div className="links">
            <a href="http://www.hel.fi/rekisteriseloste" target="_blank"><FormattedMessage id="privacyPolicy"/></a>
          </div>
        </div>
      </footer>
    );
  }
}
