import React from 'react';
import PropTypes from 'prop-types';
import {DropdownButton, MenuItem} from 'react-bootstrap';
import Icon from '../../utils/Icon';
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
  <DropdownButton pullRight className="language-switcher" id="language" eventKey="language" title={<span><Icon name="globe" className="user-nav-icon"/>{currentLanguage} </span>}>
    {config.languages
      .map((code) =>
        <MenuItem
          href=""
          key={code}
          className="language-switcher__language"
          onClick={() => changeLang(history, location, code)}
          active={code === currentLanguage}
        >
          {formatMessage({id: `lang-${code}`})}
        </MenuItem>)}
  </DropdownButton>;

// .filter((code) => code !== currentLanguage)

LanguageSwitcher.contextTypes = {
  intl: intlShape.isRequired
};

LanguageSwitcher.propTypes = {
  currentLanguage: PropTypes.string,
  location: PropTypes.object,
  history: PropTypes.object
};

export default withRouter(connect()(LanguageSwitcher));
