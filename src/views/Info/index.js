import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import Col from 'react-bootstrap/lib/Col';
import Row from 'react-bootstrap/lib/Row';
import trackLink from '../../utils/trackLink';
import {injectIntl, intlShape} from 'react-intl';
import Helmet from 'react-helmet';

function getContent(language) {
  if (typeof window === "undefined") return "";
  if (language === "fi") {
    return require('./content.fi.md');
  }
  return 'Content not available in current language';
}

class Info extends React.Component {
  componentDidMount() {
    trackLink();
  }

  render() {
    const content = getContent(this.props.language);
    const {intl} = this.props;
    return (
      <div className="container">
        <Helmet title={intl.formatMessage({ id: 'infoPage' })} />
        <Row>
          <Col md={8}>
            <div dangerouslySetInnerHTML={{__html: content}}/>
          </Col>
        </Row>
      </div>
    );
  }
}

Info.propTypes = {
  language: PropTypes.string,
  intl: intlShape
};

export default injectIntl(connect((state) => ({language: state.language}))(Info));
