/* eslint-disable react/no-multi-comp */
import React from 'react';
import PropTypes from 'prop-types';
import {
  IconUser,
  IconSignin,
  Header as HDSHeader,
  Logo,
  LoadingSpinner
} from 'hds-react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
// eslint-disable-next-line import/order
import { withRouter } from 'react-router-dom';

// eslint-disable-next-line import/no-unresolved, import/order
import logoBlack from '@city-images/logo-fi-black.svg';

// eslint-disable-next-line import/no-unresolved
import logoSwedishBlack from '@city-images/logo-sv-black.svg';

import userManager from "../../utils/userManager";
import { getUser } from '../../selectors/user';
import config from "../../config";
import { localizedNotifyError } from '../../utils/notify';

class Header extends React.Component {
  async handleLogin() {
    try {
      if (config.maintenanceDisableLogin) {
        localizedNotifyError("maintenanceNotificationText");
        return;
      }
      await userManager.signinRedirect({ ui_locales: this.props.language });
    } catch (error) {
      localizedNotifyError("loginAttemptFailed");
    }
  }

  onLanguageChange = (newLanguage) => {
    if (newLanguage !== this.props.language) {
      const languageParam = `lang=${newLanguage}`;
      let searchParams;
      if (window.location.search.includes('lang=')) {
        searchParams = window.location.search.replace(/lang=\w{2}/, languageParam);
      } else if (window.location.search) {
        searchParams = `${window.location.search}&${languageParam}`;
      }
      this.props.history.push({
        pathname: window.location.pathname,
        search: searchParams || languageParam
      });
    }
  };

  getNavItem(id, url, addSuffix = true) {
    const { history, language, user } = this.props;
    const active = history && history.location.pathname === url;
    let messageId = id;
    if (id === 'ownHearings' && (!user || user.adminOrganizations.length === 0)) {
      return null;
    }
    if (id === 'userInfo' && !user) { return null; }
    if (addSuffix) { messageId += 'HeaderText'; }

    const styleFix = {flexGrow: "1", padding: "17px 16px", position: "relative", margin: "0", outlineOffset: "-3px"}
    return (
      <FormattedMessage id={messageId}>
        {(text) => (<HDSHeader.Link href={`${url}?lang=${language}`} label={text} active={active} style={styleFix} />)}
      </FormattedMessage>
    );
  }

  render() {
    const { language, user } = this.props;

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

    return (
      <HDSHeader onDidChangeLanguage={this.onLanguageChange} languages={languages} defaultLanguage={language}>
        <HDSHeader.ActionBar
          title='Kerrokantasi'
          titleAriaLabel='Kerrokantasi'
          frontPageLabel='Kerrokantasi'
          titleHref="/"
          logoHref="/"
          openFrontPageLinksAriaLabel="Avaa Etusivun linkkivalikko"
          logo={logo}
        >
          <HDSHeader.LanguageSelector />
          <HDSHeader.ActionBarItem
            fixedRightPosition
            label={user ? <FormattedMessage key="logout" id="logout" /> : <FormattedMessage key="login" id="login" />}
            icon={this.props.user ? <IconUser /> : <IconSignin />}
            closeLabel=''
            closeIcon={<LoadingSpinner small />}
            onClick={user ? () => userManager.signoutRedirect() : () => this.handleLogin()}
            id="action-bar-login"
            className={user ? "logout-button" : "login-button"}
          />
        </HDSHeader.ActionBar>

        <HDSHeader.NavigationMenu>
          {this.getNavItem('hearings', '/hearings/list')}
          {this.getNavItem('hearingMap', '/hearings/map')}
          {this.getNavItem('info', '/info')}
          {this.getNavItem('ownHearings', '/user-hearings', false)}
          {this.getNavItem('userInfo', '/user-profile', false)}
        </HDSHeader.NavigationMenu>

      </HDSHeader>
    );
  }
}

Header.propTypes = {
  // eslint-disable-next-line react/no-unused-prop-types
  dispatch: PropTypes.func,
  // eslint-disable-next-line react/forbid-prop-types
  history: PropTypes.object,
  language: PropTypes.string,
  // eslint-disable-next-line react/forbid-prop-types
  user: PropTypes.object,
};

Header.contextTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  history: PropTypes.object,
};

const mapDispatchToProps = () => ({});

export default withRouter(connect(state => ({
  user: getUser(state), // User dropdown requires this state
  language: state.language, // Language switch requires this state
  router: state.router, // Navigation activity requires this state
}), mapDispatchToProps)(Header));
