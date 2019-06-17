/* eslint-disable react/jsx-no-target-blank */
import React from 'react';
import {FormattedMessage} from 'react-intl';
import {Row, Col} from 'react-bootstrap';
import Link from './LinkWithLang';
// eslint-disable-next-line import/no-unresolved
import logoWhite from '@city-images/logo-fi-white.svg';
// eslint-disable-next-line import/no-unresolved
import logoSwedishWhite from '@city-images/logo-sv-white.svg';
import PropTypes from "prop-types";

export default function Footer(props) {
  const {language} = props;
  return (
    <footer className="site-footer">
      <div className="container">
        <Row>
          <Col md={3} sm={4}>
            <div className="footer-branding footer-branding-helsinki">
              <a href="http://www.hel.fi">
                <FormattedMessage id="footerLogoAlt">
                  {altText => <img
                    alt={altText}
                    src={language === 'sv' ? logoSwedishWhite : logoWhite}
                    className="footer-logo footer-logo-helsinki"
                  />}
                </FormattedMessage>
              </a>
            </div>
          </Col>
          <Col md={3} sm={4}>
            <div className="site-footer-block">
              <div className="footer-header">Kerrokantasi</div>
              <ul className="footer-links">
                <li>
                  <Link to={{path: "/hearings/list"}}>
                    <FormattedMessage id="hearingsHeaderText" />
                  </Link>
                </li>
                <li>
                  <Link to={{path: "/hearings/map"}}>
                    <FormattedMessage id="hearingMapHeaderText" />
                  </Link>
                </li>
                <li>
                  <Link to={{path: "/info"}}>
                    <FormattedMessage id="infoHeaderText" />
                  </Link>
                </li>
              </ul>
            </div>
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <div className="site-footer-small-print">
              <ul className="small-print-nav">
                <li>
                  <a href="http://www.hel.fi/rekisteriseloste" target="_blank">
                    <FormattedMessage id="privacyPolicy" />
                  </a>
                </li>
                <li>
                  <a href="mailto:kerrokantasi@hel.fi?subject=Kerrokantasi-palaute">Palaute</a>
                </li>
                <li>2017 Helsingin kaupunki</li>
              </ul>
            </div>
          </Col>
        </Row>
      </div>
    </footer>
  );
}

Footer.propTypes = {
  language: PropTypes.string,
};
