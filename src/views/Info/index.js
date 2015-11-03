import React from 'react';
import finnishContent from './content.fi.md';
import {connect} from 'react-redux';

class Info extends React.Component {
  render() {
    const content = {'fi': finnishContent}[this.props.language];
    return (<div className="container">
      <div dangerouslySetInnerHTML={{__html: content || "Content not available in current language"}} />
    </div>);
  }
}

Info.propTypes = {
  language: React.PropTypes.string
};

export default connect((state) => ({language: state.language}))(Info);
