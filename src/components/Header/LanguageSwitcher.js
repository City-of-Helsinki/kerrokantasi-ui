import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button} from "react-bootstrap";
import config from '../../config';
import { withRouter} from "react-router-dom";
import {stringify} from 'qs';


import getMessage from "../../utils/getMessage";

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
    return (
      <Button
        key={code}
        aria-label={getMessage(`lang-${code}`)}
        lang={code}
        className="language-button"
        onClick={() => {
          this.changeLanguage(history, location, code);
        }}
      >
        <span className="language-title-xs">{code}</span>
        <span className="language-title">{getMessage(`lang-${code}`)}</span>
      </Button>
    );
  }

  render() {
    const {history, location} = this.props;
    return (
      <div
        className="btn-group"
        // eslint-disable-next-line no-return-assign
        ref={node => this.node = node}
      >
        { config.languages
            .map((code) =>
              this.getMenuItem(history, location, code)
            )
        }
      </div>
    );
  }
}


LanguageSwitcher.propTypes = {
  location: PropTypes.object,
  history: PropTypes.object
};
export { LanguageSwitcher as UnconnectedLanguageSwitcher};
export default withRouter(connect()(LanguageSwitcher));
