/* eslint-disable react/no-multi-comp */
import React from 'react';
import PropTypes from 'prop-types';
import {Navbar, NavItem, Nav} from 'react-bootstrap';
import LanguageSwitcher from './LanguageSwitcher';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { login, logout } from '../../actions';
import { LinkContainer } from 'react-router-bootstrap';
import { Link, withRouter } from 'react-router-dom';
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

  render() {
    const header = this;
    const onSelect = eventKey => {
      header.onSelect(eventKey);
    };
    const {history, user} = this.props;
    return (
      <div>
        <Navbar inverse fluid className="navbar-secondary hidden-xs">
          <LanguageSwitcher currentLanguage={this.props.language} />
        </Navbar>
        <Navbar default fluid collapseOnSelect className="navbar-primary">
          <Navbar.Header>
            <Navbar.Brand>
              <Link to="/" className="navbar-brand">
                Kerrokantasi
              </Link>
            </Navbar.Brand>
            <Navbar.Toggle />
          </Navbar.Header>
          <Navbar.Collapse>
            <Nav>
              <NavigationItem
                isActive={history && history.location.pathname === '/hearings/list'}
                url={'/hearings/list'}
                id={'hearings'}
              />
              <NavigationItem
                isActive={history && history.location.pathname === '/hearings/map'}
                url={'/hearings/map'}
                id={'hearingMap'}
              />
              <NavigationItem isActive={history && history.location.pathname === '/info'} url={'/info'} id={'info'} />
            </Nav>
            <UserNav onSelect={onSelect} user={user} />
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
};

Header.contextTypes = {
  history: PropTypes.object,
};

export default withRouter(connect(state => ({
  user: state.user.data, // User dropdown requires this state
  language: state.language, // Language switch requires this state
  router: state.router, // Navigation activity requires this state
}))(Header));

const NavigationItem = ({id, url, isActive}) => {
  return url ? (
    <LinkContainer to={url}>
      <NavItem key={id} eventKey={id} href="#" active={isActive}>
        <FormattedMessage id={id + 'HeaderText'} />
      </NavItem>
    </LinkContainer>
  ) : (
    <NavItem key={id} eventKey={id} href="#" active={isActive}>
      <FormattedMessage id={id + 'HeaderText'} />
    </NavItem>
  );
};

NavigationItem.propTypes = {
  id: PropTypes.string,
  url: PropTypes.string,
  isActive: PropTypes.bool,
};

const UserNav = ({user, onSelect}) => {
  return user ? (
    <Nav pullRight onSelect={onSelect} className="nav-user-menu">
      <NavItem key="profile" eventKey="profile" href="#">
        {user.displayName}
      </NavItem>
      <NavItem key="logout" eventKey="logout" href="#">
        <FormattedMessage id="logout" />
      </NavItem>
    </Nav>
  ) : (
    <Nav pullRight onSelect={onSelect} className="nav-user-menu">
      <NavItem key="login" eventKey="login" href="#" className="login-link">
        <FormattedMessage id="login" />
      </NavItem>
    </Nav>
  );
};

UserNav.propTypes = {
  user: PropTypes.object,
  onSelect: PropTypes.func,
};
