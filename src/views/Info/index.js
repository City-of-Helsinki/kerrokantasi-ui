/* eslint-disable react/no-danger */
import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import Col from 'react-bootstrap/lib/Col';
import Row from 'react-bootstrap/lib/Row';
import trackLink from '../../utils/trackLink';
import {injectIntl, intlShape} from 'react-intl';
import Helmet from 'react-helmet';
import CookieManagementModal from "../../components/cookieBar/CookieManagementModal";
import getMessage from '../../utils/getMessage';

function getContent(language) {
  if (typeof window === "undefined") return "";

  // Return correct file content depending on the chosen language. @city-i18n will handle correct files depending
  // on the selected themes.
  if (language === "fi") {
    // eslint-disable-next-line import/no-unresolved
    return require('@city-i18n/service-info/content.fi.md');
  }
  if (language === "sv") {
    // eslint-disable-next-line import/no-unresolved
    return require('@city-i18n/service-info/content.sv.md');
  }
  if (language === "en") {
    // eslint-disable-next-line import/no-unresolved
    return require('@city-i18n/service-info/content.en.md');
  }
  return 'Content not available in current language';
}

class Info extends React.Component {
  state = {
    showCookieManagementModal: false,
  };

  componentDidMount() {
    trackLink();
  }

  openCookieManagementModal = () => {
    this.setState({showCookieManagementModal: true});
  };

  closeCookieManagementModal = () => {
    this.setState({showCookieManagementModal: false});
  };

  handleKeyDown = (ev) => {
    if (ev && ev.key === "Enter") {
      this.openCookieManagementModal();
    }
  };

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
        {false && (
          <React.Fragment>
            <a
              id="cookiebar-link"
              tabIndex="0"
              role="button"
              onClick={() => this.openCookieManagementModal()}
              onKeyDown={(ev) => this.handleKeyDown(ev)}
            >
              {getMessage('cookieBar.link.text')}
            </a>
            <CookieManagementModal
              isOpen={this.state.showCookieManagementModal}
              close={this.closeCookieManagementModal}
            />
          </React.Fragment>
        )}
      </div>
    );
  }
}

Info.propTypes = {
  language: PropTypes.string,
  intl: intlShape
};

export default injectIntl(connect((state) => ({language: state.language}))(Info));
