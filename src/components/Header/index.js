/* eslint-disable react/no-multi-comp */
import React from 'react';
import PropTypes from 'prop-types';
import { Navbar, Button, DropdownButton, MenuItem } from 'react-bootstrap';
import Icon from '../../utils/Icon';

import LanguageSwitcher from './LanguageSwitcher';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { LinkContainer } from 'react-router-bootstrap';
import { withRouter } from 'react-router-dom';
import Link from '../../components/LinkWithLang';
import throttle from 'lodash/throttle';
import scrolltop from 'scrolltop';
import {getUser} from '../../selectors/user';
import userManager from "../../utils/userManager";
import { toggleContrast } from "../../actions";

// eslint-disable-next-line import/no-unresolved
import logoBlack from '@city-images/logo-fi-black.svg';

// eslint-disable-next-line import/no-unresolved
import logoSwedishBlack from '@city-images/logo-sv-black.svg';
import config from "../../config";
import { localizedNotifyError } from '../../utils/notify';

class Header extends React.Component {
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
      await userManager.signinRedirect({ ui_locales: this.props.language });
    } catch (error) {
      localizedNotifyError("loginAttemptFailed");
    }
  }

  getUserItems() {
    const {user} = this.props;

    if (user) {
      return [
        <DropdownButton
          pullRight
          key="profile"
          id="userMenu"
          className="user-menu user-menu--logged"
          title={
            <span>
              <Icon name="user" className="user-nav-icon" aria-hidden="true" />
              <span className="user-name">{user.displayName}</span>
            </span>
          }
        >
          <MenuItem
            key="logout"
            eventKey="logout"
            onClick={() => userManager.signoutRedirect()}
          >
            <FormattedMessage id="logout" />
          </MenuItem>
        </DropdownButton>,
      ];
    }
    return [
      <Button
        key="login"
        className="user-menu login-link user-menu--unlogged"
        onClick={() => this.handleLogin()}
      >
        <Icon name="user-o" className="user-nav-icon" aria-hidden="true" />
        <span className="user-name"><FormattedMessage id="login" /></span>
      </Button>,
    ];
  }

  getNavItem(id, url) {
    const {history, language} = this.props;
    const active = history && history.location.pathname === url;
    const navLink = (
      <a href="#">
        <FormattedMessage id={id + 'HeaderText'} />
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
        <Button className="contrast-button" onClick={() => this.props.toggleContrast()}>
          <Icon name="adjust" aria-hidden="true"/>
          <FormattedMessage id="contrastTitle">{text => <span className="contrast-title">{text}</span> }</FormattedMessage>
        </Button>
      );
    }
    return (
      <div />
    );
  }

  render() {
    const {language} = this.props;
    const userItems = this.getUserItems();
    return (
      <div>
        <FormattedMessage id="headerUserNavLabel">
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
                <LanguageSwitcher currentLanguage={this.props.language}/>
                {userItems}
              </div>
            </Navbar>
          )}
        </FormattedMessage>

        <FormattedMessage id="headerPagesNavLabel">
          {headerPagesNavLabel => (
            <Navbar default fluid collapseOnSelect className="navbar-primary" aria-label={headerPagesNavLabel}>
              <Navbar.Header>
                <Navbar.Brand>
                  <Link to={{path: "/"}}>
                    Kerrokantasi
                  </Link>
                </Navbar.Brand>
                <Navbar.Toggle />
              </Navbar.Header>
              <Navbar.Collapse>
                <ul className="nav navbar-nav">
                  {this.getNavItem('hearings', '/hearings/list')}
                  {this.getNavItem('hearingMap', '/hearings/map')}
                  {this.getNavItem('info', '/info')}
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
