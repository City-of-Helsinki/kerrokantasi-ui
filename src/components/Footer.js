import React from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from "prop-types";
// eslint-disable-next-line import/no-unresolved
import urls from '@city-assets/urls.json';
import { getFeedbackUrl } from '../utils/languageUtils';
import { Footer as HDSFooter } from 'hds-react';


const Footer = (props) => {
  const { language } = props;

  return (
    <HDSFooter
      className="footer"
      title="Kerrokantasi"
      logoLanguage={language}
      theme={{
        '--footer-background': 'var(--color-black)',
        '--footer-color': 'var(--color-white)',
      }}
    >
      <HDSFooter.Navigation>
        <HDSFooter.Item
          className="footer-navigation__item"
          label={<FormattedMessage id="hearingsHeaderText" />}
          href="/hearings/list"
        />
        <HDSFooter.Item
          className="footer-navigation__item"
          label={<FormattedMessage id="hearingMapHeaderText" />}
          href="/hearings/map"
        />
        <HDSFooter.Item
          className="footer-navigation__item"
          label={<FormattedMessage id="accessibilityLink" />}
          href="/accessibility"
        />
        <HDSFooter.Item
          className="footer-navigation__item"
          label={<FormattedMessage id="dataProtection" />}
          href={urls.dataProtection}
          target="_blank"
          rel="noopener noreferrer"
        />
        <HDSFooter.Item
          className="footer-navigation__item"
          label={<FormattedMessage id="infoHeaderText" />}
          href="/info"
        />
      </HDSFooter.Navigation>
      <HDSFooter.Utilities backToTopLabel={<FormattedMessage id="scrollToTop" />}>
        <HDSFooter.Item
          className="footer-utilities__item"
          label={<FormattedMessage id="feedbackLinkText" />}
          href={getFeedbackUrl(language)}
          target="_blank"
          rel="noopener noreferrer"
        />
      </HDSFooter.Utilities>
      <HDSFooter.Base
        copyrightHolder={<FormattedMessage id="copyrightHolder" />}
        copyrightText={<FormattedMessage id="copyrightText" />}
      />
    </HDSFooter >
  );
};

Footer.propTypes = {
  language: PropTypes.string
};

export default Footer;
