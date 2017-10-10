import React from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router';
import Icon from '../utils/Icon';
import {Button, Navbar, Nav, NavItem} from 'react-bootstrap';
import {injectIntl, FormattedMessage, intlShape} from 'react-intl';
import LanguageSwitcher from './Header/LanguageSwitcher';
import {LinkContainer} from 'react-router-bootstrap';

const FullscreenNavigation = ({openDetailPage, onLogin, user, detailURL, headerTitle}) => {
  return (
    <div className="fullscreen-navigation">
      <Navbar inverse fluid className="navbar-secondary hidden-xs">
        <LanguageSwitcher />
      </Navbar>
      <Navbar default fluid collapseOnSelect className="navbar-primary">
        <Navbar.Header>
          <Navbar.Brand>
            <Link to="/">
              <img alt="Helsinki" src="/assets/images/helsinki-logo-black.svg" className="logo" />
            </Link>
          </Navbar.Brand>
          <div className="header-title visible-xs">
            <Link to={detailURL}>{headerTitle}</Link>
          </div>
          <Navbar.Toggle />
        </Navbar.Header>
        <div className="header-title hidden-xs">
          <Link to={detailURL}>{headerTitle}</Link>
        </div>
        <Navbar.Collapse>
          <UserNav onSelect={onLogin} user={user} openDetailPage={openDetailPage} />
          <span className="visible-xs-block">
            <LanguageSwitcher />
          </span>
        </Navbar.Collapse>
      </Navbar>
    </div>
  );

  /*  <div collapseOnSelect className="fullscreen-navigation">
      <div className="logo">
        <Link to="/">
          <img alt="Helsinki" src="/assets/images/helsinki-logo-black.svg" className="logo" />
        </Link>
      </div>
      <div className="header-title">
        <Link to={detailURL}>{headerTitle}</Link>
      </div>
      <div className="minimize">
        <div className="fullscreen-login-link" onClick={() => onLogin()} key="login" eventKey="login" href="#">
          <FormattedMessage id="login" />
        </div>
        <Button onClick={openDetailPage}>
          <Icon name="compress" />
        </Button>
      </div>
  </div>  */
};

FullscreenNavigation.propTypes = {
  detailURL: PropTypes.string.isRequired,
  headerTitle: PropTypes.string,
  openDetailPage: PropTypes.func,
  onLogin: PropTypes.func,
  user: PropTypes.object,
  intl: intlShape.isRequired,
};

export default injectIntl(FullscreenNavigation);

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

const UserNav = ({user, onSelect, openDetailPage}) => {
  return user ? (
    <Nav pullRight onSelect={onSelect} className="user-nav">
      <NavItem key="profile" eventKey="profile" href="#" />
      <NavItem className="login-link" key="logout" eventKey="logout" href="#">
        <FormattedMessage id="logout" />
      </NavItem>
      <NavItem className="minimize">
        <Button onClick={openDetailPage}>
          <Icon name="compress" />
        </Button>
      </NavItem>
    </Nav>
  ) : (
    <Nav pullRight onSelect={onSelect} className="user-nav">
      <NavItem key="login" eventKey="login" href="#" className="login-link">
        <FormattedMessage id="login" />
      </NavItem>
      <NavItem className="minimize">
        <Button onClick={openDetailPage}>
          <Icon name="compress" />
        </Button>
      </NavItem>
    </Nav>
  );
};

UserNav.propTypes = {
  user: PropTypes.object,
  onSelect: PropTypes.func,
  openDetailPage: PropTypes.func,
};
