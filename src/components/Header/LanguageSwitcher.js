import React from 'react';
import PropTypes from 'prop-types';
import Icon from '../../utils/Icon';
import { connect } from 'react-redux';
import { Button} from "react-bootstrap";
import config from '../../config';
import { withRouter} from "react-router-dom";
import {stringify} from 'qs';


import getMessage from "../../utils/getMessage";
import classNames from 'classnames';

class LanguageSwitcher extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      openDropdown: false,
    };
  }

  componentDidMount() {
    document.addEventListener('click', this.handleClick, false);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.handleClick, false);
  }

  changeLanguage(history, location, nextLang) {
    const languageParam = stringify({lang: nextLang});
    let searchParams;
    if (location.search.includes('lang=')) {
      searchParams = location.search.replace(/lang=\w{2}/, languageParam);
    } else if (location.search) {
      searchParams = location.search + `&${languageParam}`;
    }
    history.push({
      pathname: location.pathname,
      search: searchParams || languageParam
    });
    this.toggleDropdown();
  }

  handleClick = (event) => {
    if (!this.node.contains(event.target)) {
      this.handleOutsideClick();
    }
  }

  handleOutsideClick() {
    if (this.state.openDropdown) {
      this.setState({openDropdown: false});
    }
  }

  toggleDropdown() {
    this.setState({openDropdown: !this.state.openDropdown});
  }

  getMenuItem(history, location, code) {
    const { currentLanguage } = this.props;
    return (
      <li key={code} className={classNames({active: code === currentLanguage})}>
        <a
          href="#"
          aria-current={code === currentLanguage}
          aria-label={getMessage(`lang-${code}`)}
          lang={code}
          onClick={(event) => {
            event.preventDefault();
            this.changeLanguage(history, location, code);
          }}
        >
          {getMessage(`lang-${code}`)}
        </a>
      </li>
    );
  }

  render() {
    const {currentLanguage, history, location} = this.props;
    const {openDropdown} = this.state;
    const {languages} = config;
    return (
      <div
        className={classNames('dropdown', {open: openDropdown}, 'btn-group')}
        // eslint-disable-next-line no-return-assign
        ref={node => this.node = node}
      >
        <Button
          aria-expanded={openDropdown}
          aria-haspopup
          className="language-switcher"
          id="language"
          onClick={() => this.toggleDropdown()}
        >
          <span>
            <Icon name="globe" className="user-nav-icon" aria-hidden="true" />
            {currentLanguage}
            <span className="caret" aria-hidden="true"/>
          </span>
          { languages.map((code) =>
            <span className="sr-only" key={`${code}-key`} lang={code}>
              {`, ${getMessage('languageSwitchLabel', code)}`}
            </span>
          )}
        </Button>
        <ul className={classNames('dropdown-menu dropdown-menu-right')}>
          { languages.map((code) =>
            this.getMenuItem(history, location, code)
          )}
        </ul>
      </div>
    );
  }
}


LanguageSwitcher.propTypes = {
  currentLanguage: PropTypes.string,
  location: PropTypes.object,
  history: PropTypes.object
};
export { LanguageSwitcher as UnconnectedLanguageSwitcher};
export default withRouter(connect()(LanguageSwitcher));
