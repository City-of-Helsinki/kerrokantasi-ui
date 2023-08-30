/* eslint-disable react/no-multi-comp */
import React from 'react';
import PropTypes from 'prop-types';
import { Navbar } from 'react-bootstrap';
import { Button, IconUser, IconSignin, Select } from 'hds-react';
import Icon from '../../utils/Icon';
import classNames from 'classnames';

import LanguageSwitcher from './LanguageSwitcher';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { LinkContainer } from 'react-router-bootstrap';
import { withRouter } from 'react-router-dom';
import Link from '../../components/LinkWithLang';
import throttle from 'lodash/throttle';
import scrolltop from 'scrolltop';
import { getUser } from '../../selectors/user';
import userManager from "../../utils/userManager";
import { toggleContrast } from "../../actions";

// eslint-disable-next-line import/no-unresolved
import logoBlack from '@city-images/logo-fi-black.svg';

// eslint-disable-next-line import/no-unresolved
import logoSwedishBlack from '@city-images/logo-sv-black.svg';
import config from "../../config";
import { localizedNotifyError } from '../../utils/notify';

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      navbarExpanded: false,
    };
  }
  toggleNavbar() {
    this.setState({ navbarExpanded: !this.state.navbarExpanded });
  }

  componentDidMount() {
    if (typeof window !== 'undefined') {
      this._handleNavFix = throttle(() => {
        const scrollY = scrolltop();
        if (scrollY > 115) {
          document.body.classList.add('nav-fixed');
        } else {
          document.body.classList.remove('nav-fixed');
        }
      }, 25);
      window.addEventListener('scroll', this._handleNavFix, false);
    }
  }

  componentWillUnmount() {
    if (this._handleNavFix) {
      window.removeEventListener('scroll', this._handleNavFix);
    }
  }

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

  getUserItems() {
    const { user } = this.props;

    if (user) {
      return [
        <FormattedMessage key="logout" id="logout">
          {logout => (
            <Select
              id="userMenu"
              className={classNames('user-menu', 'user-menu--logged')}
              icon={
                <span>
                  <IconUser />
                  <span className="user-name">{user.displayName}</span>
                </span>
              }
              options={[{ label: logout }]}
              onChange={() => userManager.signoutRedirect()}
            />
          )}
        </FormattedMessage>
      ];
    }
    return [
      <FormattedMessage key="login" id="login">
        {login => (
          <Button
            variant="supplementary"
            theme="black"
            iconLeft={<IconSignin />}
            className={classNames('user-menu', 'login-link', 'user-menu--unlogged')}
            onClick={() => this.handleLogin()}
          >
            <span className="user-name">{login}</span>
          </Button>
        )}
      </FormattedMessage>
    ];
  }

  getNavItem(id, url, addSuffix = true) {
    const { history, language, user } = this.props;
    const active = history && history.location.pathname === url;
    let messageId = id;
    if (id === 'ownHearings' && (!user || user.adminOrganizations.length === 0)) {
      return null;
    }
    if (id === 'userInfo' && !user) { return null; }
    if (addSuffix) { messageId += 'HeaderText'; }
    const navLink = (
      <a href="#">
        <FormattedMessage id={messageId} />
      </a>
    );
    if (url) {
      // Can't use custom link component here because it will break the navigation
      // so LinkContainer must contain same logic
      return (
        <li className={`nav-item ${active ? 'active' : ''}`}>
          <LinkContainer to={url + '?lang=' + language} className="nav-link">
            {navLink}
          </LinkContainer>
        </li>
      );
    }
    return (
      <li className={`nav-item ${active && 'active'}`}>
        {navLink}
      </li>
    );
  }

  contrastToggle() {
    if (config.enableHighContrast) {
      return (
        <FormattedMessage key="contrastTitle" id="contrastTitle">
          {text => (
            <Button
              key="text"
              aria-label={text}
              className="contrast-button"
              onClick={() => this.props.toggleContrast()}
            >
              <Icon name="adjust" />
              <span className="contrast-title">{text}</span>
            </Button>
          )}
        </FormattedMessage>
      );
    }
    return (
      <div />
    );
  }

  render() {
    const { language } = this.props;
    const userItems = this.getUserItems();
    return (
      <div>
        <FormattedMessage key="headerUserNavLabel" id="headerUserNavLabel">
          {headerUserNavLabel => (
            <Navbar fluid staticTop defaultExpanded className="navbar-kerrokantasi" aria-label={headerUserNavLabel}>
              <Navbar.Header>
                <Navbar.Brand>
                  <Link to={{ path: "/" }}>
                    <FormattedMessage id="headerLogoAlt">
                      {altText => <img
                        src={language === 'sv' ? logoSwedishBlack : logoBlack}
                        className="navbar-logo"
                        alt={altText}
                      />}
                    </FormattedMessage>
                  </Link>
                </Navbar.Brand>
              </Navbar.Header>

              <div className="nav-user-menu navbar-right">
                {this.contrastToggle()}
                {userItems}
                <LanguageSwitcher currentLanguage={this.props.language} />
              </div>
            </Navbar>
          )}
        </FormattedMessage>

        <FormattedMessage id="headerPagesNavLabel">
          {headerPagesNavLabel => (
            <Navbar
              default
              fluid
              collapseOnSelect
              className="navbar-primary"
              aria-label={headerPagesNavLabel}
              onToggle={this.toggleNavbar.bind(this)}
            >
              <Navbar.Header>
                <Navbar.Brand>
                  <Link to={{ path: "/" }}>
                    Kerrokantasi
                  </Link>
                </Navbar.Brand>
                <FormattedMessage id="navigationMenu">
                  {navigationMenu => (
                    <Navbar.Toggle aria-label={navigationMenu} aria-expanded={this.state.navbarExpanded} />
                  )}
                </FormattedMessage>
              </Navbar.Header>
              <Navbar.Collapse>
                <ul className="nav navbar-nav">
                  {this.getNavItem('hearings', '/hearings/list')}
                  {this.getNavItem('hearingMap', '/hearings/map')}
                  {this.getNavItem('info', '/info')}
                  {this.getNavItem('ownHearings', '/user-hearings', false)}
                  {this.getNavItem('userInfo', '/user-profile', false)}
                </ul>
              </Navbar.Collapse>
            </Navbar>
          )}
        </FormattedMessage>
      </div>
    );
  }
}

Header.propTypes = {
  // eslint-disable-next-line react/no-unused-prop-types
  dispatch: PropTypes.func,
  history: PropTypes.object,
  language: PropTypes.string,
  user: PropTypes.object,
  toggleContrast: PropTypes.func,
};

Header.contextTypes = {
  history: PropTypes.object,
};

const mapDispatchToProps = dispatch => ({
  toggleContrast: () => dispatch(toggleContrast())
});

export default withRouter(connect(state => ({
  user: getUser(state), // User dropdown requires this state
  language: state.language, // Language switch requires this state
  router: state.router, // Navigation activity requires this state
}), mapDispatchToProps)(Header));
