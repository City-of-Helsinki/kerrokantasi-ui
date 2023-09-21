/* eslint-disable react/forbid-prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import { Select } from 'hds-react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { stringify } from 'qs';
import classNames from 'classnames';

import getMessage from '../../utils/getMessage';
import config from '../../config';

const LanguageSwitcher = ({ currentLanguage, history, location }) => {
  const { languages } = config;

  const options = languages.map((code) => ({ code, label: getMessage(`lang-${code}`) }));

  const changeLanguage = (nextLang) => {
    const languageParam = stringify({ lang: nextLang });
    let searchParams;
    if (location.search.includes('lang=')) {
      searchParams = location.search.replace(/lang=\w{2}/, languageParam);
    } else if (location.search) {
      searchParams = `${location.search}&${languageParam}`;
    }
    history.push({
      pathname: location.pathname,
      search: searchParams || languageParam,
    });
  };

  return (
    <Select
      className={classNames('language-switcher')}
      icon={<span style={{ width: '20px', marginRight: '12px' }}>{currentLanguage}</span>}
      defaultValue={options.find((item) => item.code === currentLanguage)}
      options={options}
      onChange={(selected) => changeLanguage(selected.code)}
    />
  );
};

LanguageSwitcher.propTypes = {
  currentLanguage: PropTypes.string,
  location: PropTypes.object,
  history: PropTypes.object,
};
export { LanguageSwitcher as UnconnectedLanguageSwitcher };
export default withRouter(connect()(LanguageSwitcher));
