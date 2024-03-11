import React from 'react';
import PropTypes from 'prop-types';
import {
  IconUser,
  IconSignin,
  Header as HDSHeader,
  Logo,
  LoadingSpinner,
} from 'hds-react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
// eslint-disable-next-line import/order
import { NavLink, withRouter } from 'react-router-dom';

// eslint-disable-next-line import/no-unresolved, import/order
import logoBlack from '@city-images/logo-fi-black.svg';

// eslint-disable-next-line import/no-unresolved
import logoSwedishBlack from '@city-images/logo-sv-black.svg';

import { localizedNotifyError } from '../../utils/notify';
import config from '../../config';
import { getUser } from '../../selectors/user';
import useAuthHook from '../../hooks/useAuth';

const Header = ({ history, language, user }) => {
  const { authenticated, login, logout } = useAuthHook();

  const doLogin = async () => {
    if (config.maintenanceDisableLogin) {
      localizedNotifyError("maintenanceNotificationText");
      return;
    }
    if (!authenticated) {
      try {
        await login();
      }
      catch {
        localizedNotifyError("loginAttemptFailed");
      }
    } else {
      logout();
    }
  }

  const onLanguageChange = (newLanguage) => {
    const urlSearchParams = new URLSearchParams(window.location.search);
    urlSearchParams.set('lang', newLanguage);

    history.push({
      pathname: window.location.pathname,
      search: urlSearchParams.toString()
    });
  };

  const getNavItem = (id, url, addSuffix = true) => {
    const active = history && history.location.pathname === url;
    let messageId = id;
    if (id === 'ownHearings' && (!user || user.adminOrganizations.length === 0)) {
      return null;
    }
    if (id === 'userInfo' && !user) { return null; }
    if (addSuffix) { messageId += 'HeaderText'; }

    return (
      <FormattedMessage id={messageId} key={messageId}>
      {url 
        ?
            (text) => (<HDSHeader.Link as={<NavLink />} to={`${url}?lang=${language}`} label={text} active={active}  />)
        : 
          (text) => ( <p>{ text }</p>)
      }
      </FormattedMessage>
    );
  };

  const languages = [
    { label: 'Suomi', value: 'fi', isPrimary: true },
    { label: 'Svenska', value: 'sv', isPrimary: true },
    { label: 'English', value: 'en', isPrimary: true },
  ];

  const logo = (
    <FormattedMessage id="headerLogoAlt">
      {altText => <Logo src={language === 'sv' ? logoSwedishBlack : logoBlack} alt={altText} />}
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
        titleHref="/"
        logoHref="/"
        openFrontPageLinksAriaLabel={<FormattedMessage id="headerOpenFrontPageLinks" />}
        logo={logo}
      >
        <HDSHeader.LanguageSelector />
        <HDSHeader.ActionBarItem
          fixedRightPosition
          label={user ? user.displayName : <FormattedMessage key="login" id="login" />}
          icon={user ? <IconUser /> : <IconSignin />}
          closeIcon={user ? <IconUser /> : <IconSignin />}
          closeLabel={user?.displayName}
          onClick={user ?  () => {  } : doLogin }
          id="action-bar-login"
          className={user ? "logout-button" : "login-button"}
        >{user &&
          <HDSHeader.ActionBarItem 
            label={<FormattedMessage key="logout" id="logout" />}
            closeLabel=''
            closeIcon={<LoadingSpinner small />}
            onClick={doLogin}
            id="action-bar-login"
            className="logout-button"
          />
        }
        </HDSHeader.ActionBarItem>
      </HDSHeader.ActionBar>
      <HDSHeader.NavigationMenu>{navigationItems}</HDSHeader.NavigationMenu>
    </HDSHeader>
  );
};

Header.propTypes = {
  // eslint-disable-next-line react/no-unused-prop-types
  dispatch: PropTypes.func,
  // eslint-disable-next-line react/forbid-prop-types
  history: PropTypes.object,
  language: PropTypes.string,
  // eslint-disable-next-line react/forbid-prop-types
  user: PropTypes.object,
};

const mapDispatchToProps = () => ({});


export {Header as UnconnectedHeader};
export default withRouter(connect(state => ({
  user: getUser(state),
  language: state.language,
  router: state.router,
}), mapDispatchToProps)(Header));