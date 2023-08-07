/* eslint-disable react/jsx-no-target-blank */
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Row, Col } from 'react-bootstrap';
import Link from './LinkWithLang';
// eslint-disable-next-line import/no-unresolved
import logoWhite from '@city-images/logo-fi-white.svg';
// eslint-disable-next-line import/no-unresolved
import logoSwedishWhite from '@city-images/logo-sv-white.svg';
import PropTypes from "prop-types";
// eslint-disable-next-line import/no-unresolved
import urls from '@city-assets/urls.json';
import config from '../config';
import { getFeedbackUrl } from '../utils/languageUtils';

const getCurrentYear = () => {
  const today = new Date();
  return (today.getFullYear());
};

export default function Footer(props) {
  const { language } = props;

  return (
    <footer className="site-footer">
      <div className="container">
        <Row>
          <Col md={3} sm={4}>
            <div className="footer-branding">
              <FormattedMessage id="footerLogoAlt">
                {altText => <img
                  alt={altText}
                  src={language === 'sv' ? logoSwedishWhite : logoWhite}
                  className="footer-logo"
                />}
              </FormattedMessage>
              <div className="footer-city-link">
                <a href={urls.city}>
                  <FormattedMessage id="footerCityLink" />
                </a>
              </div>
            </div>
          </Col>
          <Col md={3} sm={4}>
            <div className="site-footer-block">
              <div className="footer-header">Kerrokantasi</div>
              <ul className="footer-links">
                <li>
                  <Link to={{ path: "/hearings/list" }}>
                    <FormattedMessage id="hearingsHeaderText" />
                  </Link>
                </li>
                <li>
                  <Link to={{ path: "/hearings/map" }}>
                    <FormattedMessage id="hearingMapHeaderText" />
                  </Link>
                </li>
                <li>
                  <Link to={{ path: "/info" }}>
                    <FormattedMessage id="infoHeaderText" />
                  </Link>
                </li>
                <li>
                  <Link to={{ path: getFeedbackUrl(language) }} rel="noopener noreferrer" target="_blank">
                    <FormattedMessage id="feedbackPrompt" />
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
                {config.showAccessibilityInfo && (
                  <li>
                    <Link to={{ path: "/accessibility" }}>
                      <FormattedMessage id="accessibilityLink" />
                    </Link>
                  </li>
                )}
                <li>
                  <a href={urls.dataProtection} target="_blank" rel="noopener noreferrer">
                    <FormattedMessage id="dataProtection" />
                  </a>
                </li>
                {config.enableCookies && (
                  <li>
                    <Link to={{ path: "/cookies" }}>
                      <FormattedMessage id="cookieManagementLink" />
                    </Link>
                  </li>
                )}
                <li>
                  <a href={getFeedbackUrl(language)} target="_blank" rel="noopener noreferrer">
                    <FormattedMessage id="feedbackLinkText" />
                  </a>
                </li>
                <li>
                  {getCurrentYear()} <FormattedMessage id="copyrightText" />
                </li>
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
