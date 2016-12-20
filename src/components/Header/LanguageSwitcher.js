import React from 'react';
import NavItem from 'react-bootstrap/lib/NavItem';
import Nav from 'react-bootstrap/lib/Nav';
import {connect} from 'react-redux';
import {intlShape} from 'react-intl';
import config from '../../config';
import {setLanguage} from '../../actions';

const LanguageSwitcher = ({dispatch, currentLanguage}, {intl: {formatMessage}}) =>
  <Nav className="language-switcher actions" id="language">
    {config.languages
      .filter((code) => code !== currentLanguage)
      .map((code) =>
        <NavItem
          href=""
          key={code}
          className="language-switcher__language"
          onClick={() => dispatch(setLanguage(code))}
        >
          <span className="language-switcher__language-name">{formatMessage({id: `lang-${code}`})}</span>
        </NavItem>)}
  </Nav>;

LanguageSwitcher.contextTypes = {
  intl: intlShape.isRequired
};

LanguageSwitcher.propTypes = {
  dispatch: React.PropTypes.func,
  currentLanguage: React.PropTypes.string
};

export default connect()(LanguageSwitcher);
