/* eslint-disable react/no-multi-comp */
import React from 'react';
import Nav from 'react-bootstrap/lib/Nav';
import NavItem from 'react-bootstrap/lib/NavItem';
import LanguageSwitcher from './LanguageSwitcher';
import {FormattedMessage} from 'react-intl';
import {connect} from 'react-redux';
import {login, logout} from '../../actions';
import {LinkContainer} from 'react-router-bootstrap';
import {Link} from 'react-router';
import throttle from 'lodash/throttle';
import scrolltop from 'scrolltop';
import cx from 'classnames';

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {mobileVisible: false};
  }

  toggleMobileNav() {
    this.setState({mobileVisible: !this.state.mobileVisible});
  }

  componentDidMount() {
    if (typeof window !== 'undefined') {
      this._handleNavFix = throttle(() => {
        const scrollY = scrolltop();
        document.body.classList.toggle("nav-fixed", scrollY > 115);
      }, 25);
      window.addEventListener("scroll", this._handleNavFix, false);
    }
  }

  componentWillUnmount() {
    if (this._handleNavFix) {
      window.removeEventListener("scroll", this._handleNavFix);
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
        <FormattedMessage id={id + "HeaderText"}/>
        <FormattedMessage tagName="div" className="desc" id={id + "HeaderDescription"}/>
      </NavItem>
    );
    if (url) {
      return <LinkContainer to={url}>{navItem}</LinkContainer>;
    }
    return navItem;
  }

  render() {
    const header = this;
    const onSelect = (eventKey) => {
      header.onSelect(eventKey);
    };
    const userItems = this.getUserItems();
    const toggleMobile = this.toggleMobileNav.bind(this);
    return (
      <div className={cx({"site-navigation": true, "mobile-on": this.state.mobileVisible})}>
        <div className="navigation-wrapper">
          <div className="container">
            <div className="logo">
              <Link to="/">
                <img alt="City of Helsinki" src="/assets/images/helsinki-coat-of-arms-white-big.png"/>
                <span>Kerrokantasi</span>
              </Link>
            </div>
            <button className="nav-toggler" onClick={toggleMobile}>
              <span className="hamburger" />
              <span className="sr-only">Menu</span>
            </button>
            <div className="nav-wrap">
              <Nav className="nav-items" onSelect={onSelect}>
                {this.getNavItem("hearings", "/hearings")}
                {this.getNavItem("hearingMap", "/map")}
                {this.getNavItem("info", "/info")}
              </Nav>
              <Nav className="actions" onSelect={onSelect}>
                {userItems}
                <LanguageSwitcher currentLanguage={this.props.language}/>
              </Nav>
            </div>
          </div>
        </div>
      </div>
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
