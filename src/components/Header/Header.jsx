/* eslint-disable import/no-unresolved */
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { IconUser, IconSignin, Header as HDSHeader, Logo, LoadingSpinner } from 'hds-react';
import { FormattedMessage, useIntl } from 'react-intl';
import { connect, useDispatch } from 'react-redux';
import logoBlack from '@city-images/logo-fi-black.svg';
import logoSwedishBlack from '@city-images/logo-sv-black.svg';
import { NavLink, useLocation, useSearchParams } from 'react-router-dom';

import config from '../../config';
import getUser from '../../selectors/user';
import useAuthHook from '../../hooks/useAuth';
import { addToast } from '../../actions/toast';
import { createLocalizedNotificationPayload, NOTIFICATION_TYPES } from '../../utils/notify';
import { setLanguage } from '../../actions';

const Header = ({ user, onChangeLanguage }) => {
  const { authenticated, login, logout } = useAuthHook();
  const location = useLocation();
  const dispatch = useDispatch();
  const intl = useIntl();
  const [searchParams, setSearchParams] = useSearchParams();

  const language = intl.locale;
  
  const setLocale = (newLanguage) => {
    if (newLanguage !== language) {
      onChangeLanguage(newLanguage);
      dispatch(setLanguage(newLanguage));
    }
  };

  const doLogin = async () => {
    if (config.maintenanceDisableLogin) {
      dispatch(addToast(createLocalizedNotificationPayload(NOTIFICATION_TYPES.error, 'maintenanceNotificationText')));
      return;
    }
    if (!authenticated) {
      try {
        await login();
      } catch {
        dispatch(addToast(createLocalizedNotificationPayload(NOTIFICATION_TYPES.error, 'loginAttemptFailed')));
      }
    } else {
      logout();
    }
  };

  const onLanguageChange = (newLanguage) => {
    setLocale(newLanguage);
    const urlSearchParams = new URLSearchParams(window.location.search);

    urlSearchParams.set('lang', newLanguage);

    setSearchParams(urlSearchParams);
  };

  useEffect(() => {
    const langParam = searchParams.get('lang');

    if (langParam && langParam !== language) {
      setLocale(langParam);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const getNavItem = (id, url, addSuffix = true) => {
    const active = location.pathname === url;
    let messageId = id;
    if (id === 'ownHearings' && (!user || user.adminOrganizations.length === 0)) {
      return null;
    }
    if (id === 'userInfo' && !user) {
      return null;
    }
    if (addSuffix) {
      messageId += 'HeaderText';
    }

    return (
      <FormattedMessage id={messageId} key={messageId}>
        {url
          ? (text) => <HDSHeader.Link as={<NavLink />} to={`${url}?lang=${language}`} label={text} active={active} />
          : (text) => <p>{text}</p>}
      </FormattedMessage>
    );
  };

  const languages = [
    { label: 'Suomi', value: 'fi', isPrimary: true },
    { label: 'Svenska', value: 'sv', isPrimary: true },
    { label: 'English', value: 'en', isPrimary: true },
  ];

  const logo = (
    <FormattedMessage id='headerLogoAlt'>
      {(altText) => <Logo src={language === 'sv' ? logoSwedishBlack : logoBlack} alt={altText} />}
    </FormattedMessage>
  );

  const navigationItems = [
    getNavItem('hearings', '/hearings/list'),
    getNavItem('hearingMap', '/hearings/map'),
    getNavItem('info', '/info'),
    getNavItem('ownHearings', '/user-hearings', false),
    getNavItem('userInfo', '/user-profile', false),
  ];

  return (
    <HDSHeader onDidChangeLanguage={onLanguageChange} languages={languages} defaultLanguage={language} key={language}>
      <HDSHeader.ActionBar
        title='Kerrokantasi'
        titleAriaLabel='Kerrokantasi'
        frontPageLabel='Kerrokantasi'
        titleHref='/'
        logoHref='/'
        openFrontPageLinksAriaLabel={<FormattedMessage id='headerOpenFrontPageLinks' />}
        logo={logo}
      >
        <HDSHeader.LanguageSelector />
        <HDSHeader.ActionBarItem
          fixedRightPosition
          label={user ? user.displayName : <FormattedMessage id='login' />}
          aria-label={user ? user.displayName : intl.formatMessage({ id: 'login' })}
          icon={user ? <IconUser /> : <IconSignin />}
          closeIcon={user ? <IconUser /> : <IconSignin />}
          closeLabel={user?.displayName}
          onClick={user ? () => {} : doLogin}
          id='action-bar-login'
          className={user ? 'logout-button' : 'login-button'}
        >
          {user && (
            <HDSHeader.ActionBarItem
              label={<FormattedMessage id='logout' />}
              closeLabel=''
              closeIcon={<LoadingSpinner small />}
              onClick={doLogin}
              id='action-bar-login'
              className='logout-button'
            />
          )}
        </HDSHeader.ActionBarItem>
      </HDSHeader.ActionBar>
      <HDSHeader.NavigationMenu>{navigationItems}</HDSHeader.NavigationMenu>
    </HDSHeader>
  );
};

Header.propTypes = {
  user: PropTypes.object,
  onChangeLanguage: PropTypes.func,
};

export default connect((state) => ({
  user: getUser(state),
}))(Header);
