import React from 'react';
import NavItem from 'react-bootstrap/lib/MenuItem';
// import NavDropdown from 'react-bootstrap/lib/NavDropdown';
import {connect} from 'react-redux';
import {intlShape} from 'react-intl';
import config from '../../config';
import {setLanguage} from '../../actions';

// class LanguageSwitcher extends React.Component {
//   render() {
//     const {formatMessage} = this.context.intl;
//     const {currentLanguage, dispatch} = this.props;
//     const getLangName = (code) => formatMessage({id: 'lang-' + code});
//     const langItems = config.languages.map((code) => {
//       const style = {};
//       if (code === currentLanguage) style.color = 'orange';
//       return (
//         <MenuItem
//           key={code}
//           style={style}
//           onClick={() => dispatch(setLanguage(code))}
//         >
//           {getLangName(code)}
//         </MenuItem>
//       );
//     });
//     return (<NavSwitcher title={getLangName(currentLanguage)} id="language">
//       {langItems}
//     </NavSwitcher>);
//   }
// }

const LanguageSwitcher = ({dispatch, currentLanguage}, {intl: {formatMessage}}) =>
  <div className="language-switcher" id="language">
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
  </div>;

LanguageSwitcher.contextTypes = {
  intl: intlShape.isRequired
};

LanguageSwitcher.propTypes = {
  dispatch: React.PropTypes.func,
  currentLanguage: React.PropTypes.string
};

export default connect()(LanguageSwitcher);
