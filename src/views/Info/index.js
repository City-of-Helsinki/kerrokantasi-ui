import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import Col from 'react-bootstrap/lib/Col';
import Row from 'react-bootstrap/lib/Row';

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
      <Row>
        <Col md={8}>
          <div dangerouslySetInnerHTML={{__html: content}} />
        </Col>
      </Row>
    </div>);
  }
}

Info.propTypes = {
  language: PropTypes.string
};

export default connect((state) => ({language: state.language}))(Info);
