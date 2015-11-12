import React from 'react';
import {connect} from 'react-redux';

function getContent(language) {
  if (typeof window === "undefined") return "";
  if (language === "fi") {
    return require('./content.fi.md');
  }
  return 'Content not available in current language';
}

class Info extends React.Component {
  render() {
    const content = getContent(this.props.language);
    return (<div className="container">
      <div dangerouslySetInnerHTML={{__html: content}}/>
    </div>);
  }
}

Info.propTypes = {
  language: React.PropTypes.string
};

export default connect((state) => ({language: state.language}))(Info);
