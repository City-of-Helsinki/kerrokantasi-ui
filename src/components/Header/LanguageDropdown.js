import React from 'react';
import MenuItem from 'react-bootstrap/lib/MenuItem';
import NavDropdown from 'react-bootstrap/lib/NavDropdown';
import {connect} from 'react-redux';
import {intlShape} from 'react-intl';
import config from '../../config';
import {setLanguage} from '../../actions';

class LanguageDropdown extends React.Component {
  render() {
    const {formatMessage} = this.context.intl;
    const {currentLanguage, dispatch} = this.props;
    const getLangName = (code) => formatMessage({id: 'lang-' + code});
    const langItems = config.languages.map((code) => {
      const style = {};
      if (code === currentLanguage) style.color = 'orange';
      return (
        <MenuItem
          key={code}
          style={style}
          onClick={() => dispatch(setLanguage(code))}
        >
          {getLangName(code)}
        </MenuItem>
      );
    });
    return (<NavDropdown title={getLangName(currentLanguage)} id="language">
      {langItems}
    </NavDropdown>);
  }
}

LanguageDropdown.contextTypes = {
  intl: intlShape.isRequired
};
LanguageDropdown.propTypes = {
  dispatch: React.PropTypes.func,
  currentLanguage: React.PropTypes.string
};

export default connect()(LanguageDropdown);
