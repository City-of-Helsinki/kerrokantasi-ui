/* eslint-disable react/forbid-prop-types */
import React from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
// eslint-disable-next-line import/no-unresolved
import urls from '@city-assets/urls.json';
import { Footer as HDSFooter, Logo } from 'hds-react';
// eslint-disable-next-line import/no-unresolved
import logoSwedishWhite from '@city-images/logo-sv-white.svg';
// eslint-disable-next-line import/no-unresolved
import logoWhite from '@city-images/logo-fi-white.svg';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import classNames from 'classnames';

import { getFeedbackEmailUrl, getFeedbackUrl } from '../utils/languageUtils';
import config from '../config';
import { getUser } from '../selectors/user';
import { isAdmin } from '../utils/user';

const Footer = (props) => {
  const { language, user } = props;

  const userIsAdmin = isAdmin(user);

  return (
    <HDSFooter
      className={classNames(['footer', userIsAdmin && 'footer--is-admin'])}
      title='Kerrokantasi'
      logoLanguage={language}
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
        logo={<Logo src={language === 'sv' ? logoSwedishWhite : logoWhite} size='medium' />}
      >
        <HDSFooter.Link label={<FormattedMessage id='accessibilityLink' />} href='/accessibility' />
        <HDSFooter.Link
          label={<FormattedMessage id='dataProtection' />}
          href={urls.dataProtection}
          target='_blank'
          rel='noopener noreferrer'
        />
        {config.enableCookies && (
          <HDSFooter.Link label={<FormattedMessage id='cookieManagementLink' />} href='/cookies' />
        )}
        <HDSFooter.Link label={<FormattedMessage id='infoHeaderText' />} href='/info' />
      </HDSFooter.Base>
    </HDSFooter>
  );
};

Footer.propTypes = {
  language: PropTypes.string,
  user: PropTypes.object,
};

export default withRouter(
  connect((state) => ({
    user: getUser(state),
  }))(Footer),
);
