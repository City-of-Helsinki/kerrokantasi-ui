/* eslint-disable react/no-multi-comp */
import React from 'react';
import PropTypes from 'prop-types';
import { Navbar, NavItem, Nav, NavDropdown, MenuItem } from 'react-bootstrap';
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

class Header extends React.Component {
  componentDidMount() {
    if (typeof window !== 'undefined') {
      this._handleNavFix = throttle(() => {
        const scrollY = scrolltop();
        document.body.classList.toggle('nav-fixed', scrollY > 115);
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
        <NavDropdown key="profile" eventKey="profile" id="userMenu" title={<span><Icon name="user-o" className="user-nav-icon"/>{user.displayName} </span>}>
          <MenuItem key="logout" eventKey="logout">
            <FormattedMessage id="logout" />
          </MenuItem>
        </NavDropdown>,
      ];
    }
    return [
      <NavItem key="login" eventKey="login" href="#" className="login-link">
        <Icon name="user-o" className="user-nav-icon"/>
        <FormattedMessage id="login" />
      </NavItem>,
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
    const header = this;
    const onSelect = eventKey => {
      header.onSelect(eventKey);
    };
    const userItems = this.getUserItems();
    return (
      <div>
        <Navbar inverse fluid className="navbar-secondary hidden-xs">
          <LanguageSwitcher currentLanguage={this.props.language} />
        </Navbar>
        <Navbar default fluid collapseOnSelect className="navbar-primary">
          <Navbar.Header>
            <Navbar.Brand>
              <Link to={{path: "/"}} className="navbar-brand">
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
            <Nav pullRight onSelect={onSelect} className="nav-user-menu">
              {userItems}
            </Nav>
            <span className="visible-xs-block">
              <LanguageSwitcher currentLanguage={this.props.language} />
            </span>
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
