/* eslint-disable react/no-multi-comp */
import React from 'react';
import Navbar from 'react-bootstrap/lib/Navbar';
import Nav from 'react-bootstrap/lib/Nav';
import NavbarBrand from 'react-bootstrap/lib/NavbarBrand';
import NavItem from 'react-bootstrap/lib/NavItem';
import {FormattedMessage} from 'react-intl';
import LanguageDropdown from './LanguageDropdown';
import {connect} from 'react-redux';
import {login, logout} from 'actions';
import {LinkContainer} from 'react-router-bootstrap';
import {Link} from 'react-router';

class Header extends React.Component {
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
    if (user !== null) {
      return [
        <NavItem key="profile" eventKey="profile" href="#">{user.displayName}</NavItem>,
        <NavItem key="logout" eventKey="logout" href="#"><FormattedMessage id="logout"/></NavItem>
      ];
    }
    return [
      <NavItem key="login" eventKey="login" href="#" className="login-link"><FormattedMessage id="login"/></NavItem>
    ];
  }

  getNavItem(id, url) {
    const {history} = this.props;
    const active = history && history.isActive(url);
    const navItem = (
      <NavItem key={id} eventKey={id} href="#" active={active}>
        <FormattedMessage id={id + "HeaderText"} />
        {!(this.props.slim) ? <FormattedMessage tagName="div" className="desc" id={id + "HeaderDescription"}/> : null}
      </NavItem>
    );
    if (url) {
      return <LinkContainer to={url}>{navItem}</LinkContainer>;
    }
    return navItem;
  }

  render() {
    const header = this;
    const onSelect = (eventKey) => { header.onSelect(eventKey); };
    const userItems = this.getUserItems();
    return (
      <Navbar id="header">
        <NavbarBrand><Link to="/">Kerro Kantasi</Link></NavbarBrand>
        <Nav onSelect={onSelect}>
          {this.getNavItem("hearings", "/hearings")}
          {this.getNavItem("info", "/info")}
        </Nav>
        <Nav pullRight onSelect={onSelect}>
          {userItems}
          <LanguageDropdown currentLanguage={this.props.language}/>
        </Nav>
      </Navbar>
    );
  }
}

Header.propTypes = {
  dispatch: React.PropTypes.func,
  history: React.PropTypes.object,
  language: React.PropTypes.string,
  slim: React.PropTypes.bool,
  user: React.PropTypes.object,
};

Header.contextTypes = {
  history: React.PropTypes.object
};

export default connect((state) => ({
  user: state.user,  // User dropdown requires this state
  language: state.language,  // Language switch requires this state
  router: state.router, // Navigation activity requires this state
}))(Header);
