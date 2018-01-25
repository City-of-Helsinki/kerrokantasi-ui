import React from 'react';
import PropTypes from 'prop-types';
import NavItem from 'react-bootstrap/lib/NavItem';
import Nav from 'react-bootstrap/lib/Nav';
import {connect} from 'react-redux';
import {intlShape} from 'react-intl';
import config from '../../config';
import {withRouter} from 'react-router-dom';
import { stringifyQuery } from '../../utils/urlQuery';

const changeLang = (history, location, nextLang) => {
  history.push({
    path: location.pathname,
    search: stringifyQuery({ lang: nextLang })
  });
};

const LanguageSwitcher = ({currentLanguage, location, history}, {intl: {formatMessage}}) =>
  <Nav pullRight className="language-switcher actions" id="language">
    {config.languages
      .filter((code) => code !== currentLanguage)
      .map((code) =>
        <NavItem
          href=""
          key={code}
          className="language-switcher__language"
          onClick={() => changeLang(history, location, code)}
        >
          {formatMessage({id: `lang-${code}`})}
        </NavItem>)}
  </Nav>;

LanguageSwitcher.contextTypes = {
  intl: intlShape.isRequired
};

LanguageSwitcher.propTypes = {
  currentLanguage: PropTypes.string,
  location: PropTypes.object,
  history: PropTypes.object
};

export default withRouter(connect()(LanguageSwitcher));
