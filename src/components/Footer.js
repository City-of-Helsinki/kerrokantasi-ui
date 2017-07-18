/* eslint-disable react/jsx-no-target-blank */
import React from 'react';
import {FormattedMessage} from 'react-intl';
import {Row, Col} from 'react-bootstrap';
import {Link} from 'react-router';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <Row>
          <Col md={3} sm={4}>
            <div className="footer-branding footer-branding-helsinki">
              <a href="http://www.hel.fi">
                <img alt="Helsingin kaupunki" src="/assets/images/helsinki-logo-white.svg" className="footer-logo footer-logo-helsinki" aria-hidden="true" />
              </a>
            </div>
          </Col>
          <Col md={3} sm={4}>
            <div className="site-footer-block">
              <div className="footer-header">Kerro kantasi</div>
              <ul className="footer-links">
                <li><Link to={"hearings"}><FormattedMessage id={"hearingsHeaderText"}/></Link></li>
                <li><Link to={"hearingMap"}><FormattedMessage id={"hearingMapHeaderText"}/></Link></li>
                <li><Link to={"info"}><FormattedMessage id={"infoHeaderText"}/></Link></li>
              </ul>
            </div>
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <div className="site-footer-small-print">
              <ul className="small-print-nav">
                <li>
                  <a href="http://www.hel.fi/rekisteriseloste" target="_blank"><FormattedMessage id="privacyPolicy"/></a>
                </li>
                <li><a href="mailto:dev@hel.fi?subject=Kerro kantasi -palaute">Palaute</a></li>
                <li>2017 Helsingin kaupunki</li>
              </ul>
            </div>
          </Col>
        </Row>
      </div>
    </footer>
  );
}
