import React from 'react';
import PropTypes from 'prop-types';
import { Select } from 'hds-react';
import { connect } from 'react-redux';
import config from '../../config';
import { withRouter} from "react-router-dom";
import {stringify} from 'qs';


import getMessage from "../../utils/getMessage";
import classNames from 'classnames';

class LanguageSwitcher extends React.Component {
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
  }

  render() {
    const {currentLanguage, history, location} = this.props;
    const {languages} = config;
    const options = languages.map((code) => ({code, label: getMessage(`lang-${code}`)}));
    return (
      <Select
        className={classNames('language-switcher')}
        icon={<span style={{width: '20px', marginRight: '12px'}}>{currentLanguage}</span>}
        defaultValue={options.find((item) => item.code === currentLanguage)}
        options={options}
        onChange={(selected) => this.changeLanguage(history, location, selected.code)}
      />
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
