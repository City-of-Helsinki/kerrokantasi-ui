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

class Header extends React.Component {
  onSelect(eventKey) {
    switch (eventKey) {
    case 'home':
      this.context.history.pushState(null, '/');
      break;
    case 'info':
      this.context.history.pushState(null, '/info');
      break;
    case 'hearings':
      this.context.history.pushState(null, '/hearings');
      break;
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

  getNavItem(id, active) {
    return (
      <NavItem key={id} eventKey={id} href="#" active={active}>
        <FormattedMessage id={id + "HeaderText"} />
        {!(this.props.slim) ? <FormattedMessage tagName="div" className="desc" id={id + "HeaderDescription"}/> : null}
      </NavItem>
    );
  }

  render() {
    const header = this;
    const onSelect = (eventKey) => { header.onSelect(eventKey); };
    const userItems = this.getUserItems();
    const {history} = this.props;
    return (
      <Navbar id="header">
        <NavbarBrand><a href="#" onClick={onSelect.bind(this, 'home')}>Kerro Kantasi</a></NavbarBrand>
        <Nav onSelect={onSelect}>
          {this.getNavItem("hearings", history && history.isActive("/hearings"))}
          {this.getNavItem("info", history && history.isActive("/info"))}
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

export default connect((state) => ({user: state.user, language: state.language}))(Header);
