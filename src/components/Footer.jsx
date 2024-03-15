/* eslint-disable import/no-unresolved */
/* eslint-disable react/forbid-prop-types */
import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import settings from '@city-assets/settings.json';
import { Footer as HDSFooter, Logo } from 'hds-react';
import logoSwedishWhite from '@city-images/logo-sv-white.svg';
import logoWhite from '@city-images/logo-fi-white.svg';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import classNames from 'classnames';

import { getDataProtectionUrl, getFeedbackEmailUrl, getFeedbackUrl } from '../utils/languageUtils';
import config from '../config';
import getUser from '../selectors/user';
import { isAdmin } from '../utils/user';

const Footer = (props) => {
  const { language, user, intl } = props;

  const userIsAdmin = isAdmin(user);

  return (
    <HDSFooter
      className={classNames(['footer', userIsAdmin && 'footer--is-admin'])}
      title='Kerrokantasi'
      logoLanguage={language}
      korosType={settings.footer.korosType}
      theme={{
        '--footer-background': 'var(--color-black)',
        '--footer-color': 'var(--color-white)',
      }}
    >
      <HDSFooter.Navigation>
        <HDSFooter.Link label={<FormattedMessage id='hearingsHeaderText' />} href='/hearings/list' />
        <HDSFooter.Link label={<FormattedMessage id='hearingMapHeaderText' />} href='/hearings/map' />
        {userIsAdmin && <HDSFooter.Link label={<FormattedMessage id='ownHearings' />} href='/user-hearings' />}
        {user && <HDSFooter.Link label={<FormattedMessage id='userInfo' />} href='/user-profile' />}
      </HDSFooter.Navigation>
      <HDSFooter.Utilities>
        <HDSFooter.Link
          label={<FormattedMessage id='feedbackPrompt' />}
          href={getFeedbackEmailUrl(language)}
          target='_blank'
          rel='noopener noreferrer'
        />
        <HDSFooter.Link
          label={<FormattedMessage id='feedbackLinkText' />}
          href={getFeedbackUrl(language)}
          target='_blank'
          rel='noopener noreferrer'
        />
      </HDSFooter.Utilities>
      <HDSFooter.Base
        copyrightHolder={<FormattedMessage id='copyrightHolder' />}
        copyrightText={<FormattedMessage id='copyrightText' />}
        backToTopLabel={<FormattedMessage id='scrollToTop' />}
        logo={
          <Logo
            src={language === 'sv' ? logoSwedishWhite : logoWhite}
            size='medium'
            alt={intl.formatMessage({ id: 'footerLogoAlt' })}
          />
        }
      >
        <HDSFooter.Link label={<FormattedMessage id='accessibilityLink' />} to={`/accessibility?lang=${language}`} as={Link} />
        <HDSFooter.Link
          label={<FormattedMessage id='dataProtection' />}
          href={getDataProtectionUrl(language)}
          target='_blank'
          rel='noopener noreferrer'
        />
        {config.enableCookies && (
          <HDSFooter.Link label={<FormattedMessage id='cookieManagementLink' />} to={`/cookies?lang=${language}`} as={Link} />
        )}
        <HDSFooter.Link label={<FormattedMessage id='infoHeaderText' />} to={`/info?lang=${language}`} as={Link} />
      </HDSFooter.Base>
    </HDSFooter>
  );
};

Footer.propTypes = {
  language: PropTypes.string,
  user: PropTypes.object,
};

export default 
  connect((state) => ({
    user: getUser(state),
  }))(injectIntl(Footer))
;
