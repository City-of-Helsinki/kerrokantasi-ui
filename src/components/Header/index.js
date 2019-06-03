/* eslint-disable react/no-multi-comp */
import React from 'react';
import PropTypes from 'prop-types';
import { Navbar, Nav, NavItem, Button, DropdownButton, MenuItem } from 'react-bootstrap';
import Icon from '../../utils/Icon';
import LanguageSwitcher from './LanguageSwitcher';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { login, logout } from '../../actions';
import { LinkContainer } from 'react-router-bootstrap';
import { withRouter } from 'react-router-dom';
import Link from '../../components/LinkWithLang';
import throttle from 'lodash/throttle';
import scrolltop from 'scrolltop';
import helsinkiLogo from 'hel-bootstrap-3/src/assets/helsinki-logo-black.svg';
import helsinkiSwedishLogo from 'hel-bootstrap-3/src/assets/helsinki-logo-black-sv.svg';

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

  onSelect(eventKey) {
    switch (eventKey) {
      case 'login':
        // TODO: Actual login flow
        this.props.dispatch(login());
        break;
      case 'logout':
        // TODO: Actual logout flow
        this.props.dispatch(logout());
        break;
      default:
      // Not sure what to do here
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
              <Icon name="user" className="user-nav-icon"/><span className="user-name">{user.displayName}</span>
            </span>
          }
        >
          <MenuItem
            key="logout"
            eventKey="logout"
            onClick={() => this.onSelect('logout')}
          >
            <FormattedMessage id="logout" />
          </MenuItem>
        </DropdownButton>,
      ];
    }
    return [
      <Button
        key="login"
        href=""
        className="user-menu login-link user-menu--unlogged"
        onClick={() => this.onSelect('login')}
      >
        <Icon name="user-o" className="user-nav-icon"/>
        <span className="user-name"><FormattedMessage id="login" /></span>
      </Button>,
    ];
  }

  getNavItem(id, url) {
    const {history, language} = this.props;
    const active = history && history.location.pathname === url;
    const navItem = (
      <NavItem key={id} eventKey={id} href="#" active={active}>
        <FormattedMessage id={id + 'HeaderText'} />
      </NavItem>
    );
    if (url) {
      // Can't use custom link component here because it will break the navigation, so LinkContainer must contain same logic
      return <LinkContainer to={url + '?lang=' + language}>{navItem}</LinkContainer>;
    }
    return navItem;
  }

  render() {
    const {language} = this.props;
    const header = this;
    const onSelect = eventKey => {
      header.onSelect(eventKey);
    };
    const userItems = this.getUserItems();
    return (
      <div>
        <Navbar fluid staticTop defaultExpanded className="navbar-kerrokantasi">
          <Navbar.Header>
            <Navbar.Brand>
              <Link to={{path: "/"}}>
                <img
                  src={language === 'sv' ? helsinkiSwedishLogo : helsinkiLogo}
                  className="navbar-logo"
                  alt="Helsinki"
                />
              </Link>
            </Navbar.Brand>
          </Navbar.Header>

          <div onSelect={onSelect} className="nav-user-menu navbar-right">
            <LanguageSwitcher currentLanguage={this.props.language} />
            {userItems}
          </div>
        </Navbar>
        <Navbar default fluid collapseOnSelect className="navbar-primary">
          <Navbar.Header>
            <Navbar.Brand>
              <Link to={{path: "/"}}>
                Kerrokantasi
              </Link>
            </Navbar.Brand>
            <Navbar.Toggle />
          </Navbar.Header>
          <Navbar.Collapse>
            <Nav>
              {this.getNavItem('hearings', '/hearings/list')}
              {this.getNavItem('hearingMap', '/hearings/map')}
              {this.getNavItem('info', '/info')}
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      </div>
    );
  }
}

Header.propTypes = {
  dispatch: PropTypes.func,
  history: PropTypes.object,
  language: PropTypes.string,
  user: PropTypes.object,
  location: PropTypes.object
};

Header.contextTypes = {
  history: PropTypes.object,
};

export default withRouter(connect(state => ({
  user: state.user.data, // User dropdown requires this state
  language: state.language, // Language switch requires this state
  router: state.router, // Navigation activity requires this state
}))(Header));
