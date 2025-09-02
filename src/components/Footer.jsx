/* eslint-disable import/no-unresolved */
import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
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
  const { user } = props;
  const intl = useIntl();
  const language = intl.locale;
  const userIsAdmin = isAdmin(user);

  const scrollToFn = () => window.scrollTo(0, 0);

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
        <HDSFooter.Link
          label={<FormattedMessage id='hearingsHeaderText' />}
          to='/hearings/list'
          as={Link}
          onClick={scrollToFn}
        />
        <HDSFooter.Link
          label={<FormattedMessage id='hearingMapHeaderText' />}
          to='/hearings/map'
          as={Link}
          onClick={scrollToFn}
        />
        {userIsAdmin && (
          <HDSFooter.Link
            label={<FormattedMessage id='ownHearings' />}
            to='/user-hearings'
            as={Link}
            onClick={scrollToFn}
          />
        )}
        {user && (
          <HDSFooter.Link
            label={<FormattedMessage id='userInfo' />}
            to='/user-profile'
            as={Link}
            onClick={scrollToFn}
          />
        )}
      </HDSFooter.Navigation>
      <HDSFooter.Utilities>
        <HDSFooter.Link label={<FormattedMessage id='feedbackPrompt' />} href={getFeedbackEmailUrl(language)} />
        <HDSFooter.Link label={<FormattedMessage id='feedbackLinkText' />} href={getFeedbackUrl(language)} />
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
        <HDSFooter.Link
          label={<FormattedMessage id='accessibilityLink' />}
          to={`/accessibility?lang=${language}`}
          as={Link}
          onClick={scrollToFn}
        />
        <HDSFooter.Link label={<FormattedMessage id='dataProtection' />} href={getDataProtectionUrl(language)} />
        {config.enableCookies && (
          <HDSFooter.Link
            label={<FormattedMessage id='cookieManagementLink' />}
            to={`/cookies?lang=${language}`}
            as={Link}
            onClick={scrollToFn}
          />
        )}
        <HDSFooter.Link
          label={<FormattedMessage id='infoHeaderText' />}
          to={`/info?lang=${language}`}
          as={Link}
          onClick={scrollToFn}
        />
      </HDSFooter.Base>
    </HDSFooter>
  );
};

Footer.propTypes = {
  user: PropTypes.object,
};

export default connect((state) => ({
  user: getUser(state),
}))(Footer);
