import React from 'react';
import {connect} from 'react-redux';
import {setLanguage} from 'actions';
import {languages} from 'config';

class LanguageSwitch extends React.Component {
  render() {
    const {dispatch, language} = this.props;
    const langButtons = languages.map((code) => {
      const style = {};
      if (code === language) style.color = 'orange';
      return (<a
        key={code}
        href="#"
        onClick={() => dispatch(setLanguage(code))}
        style={style}
        >{code}</a>);
    });
    return (<div>{langButtons}</div>);
  }
}

LanguageSwitch.propTypes = {
  'dispatch': React.PropTypes.func,
  'language': React.PropTypes.string
};

export default connect((state) => ({'language': state.language}))(LanguageSwitch);
