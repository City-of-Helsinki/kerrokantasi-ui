import React from 'react';
import PropTypes from 'prop-types';
import Icon from '../../utils/Icon';
import { connect } from 'react-redux';
import { Button} from "react-bootstrap";
import config from '../../config';
import { withRouter} from "react-router-dom";
import { stringifyQuery} from "../../utils/urlQuery";


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
    history.push({
      path: location.pathname,
      search: stringifyQuery({ lang: nextLang })
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
          aria-label={getMessage(`lang-${code}`)}
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
    return (
      // eslint-disable-next-line no-return-assign
      <div className={classNames('dropdown', {open: this.state.openDropdown}, 'btn-group')} ref={node => this.node = node} >
        <Button className="language-switcher" onClick={() => this.toggleDropdown()} aria-label={getMessage('languageSwitchLabel')} id="language">
          <span>
            <Icon name="globe" className="user-nav-icon" aria-hidden="true" />
            {currentLanguage}
            <span className="caret" />
          </span>
        </Button>
        <ul className={classNames('dropdown-menu dropdown-menu-right')} aria-labelledby="language">
          { config.languages
            .map((code) =>
              this.getMenuItem(history, location, code)
            )
          }
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
