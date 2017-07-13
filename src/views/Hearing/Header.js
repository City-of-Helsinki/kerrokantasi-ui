import React from 'react';
import { Col, Row } from 'react-bootstrap';
import { injectIntl, FormattedPlural, FormattedMessage } from 'react-intl';
import FormatRelativeTime from '../../utils/FormatRelativeTime';
import LabelList from '../../components/LabelList';
import SocialBar from '../../components/SocialBar';
import Icon from '../../utils/Icon';
import getAttr from '../../utils/getAttr';

class Header extends React.Component {

  render() {
    const { hearing, activeLanguage, reportUrl } = this.props;
    return (
      <div className="hearing-header well">
        <h1>
          {!hearing.published ? <Icon name="eye-slash" /> : null}
          {getAttr(hearing.title, activeLanguage)}
        </h1>
        <Row className="hearing-meta">
          <Col xs={12}>
            <LabelList className="main-labels" labels={hearing.labels} />
          </Col>
          <Col xs={12} sm={6}>
            <div className="timetable">
              <Icon name="clock-o"/> <FormatRelativeTime messagePrefix="timeOpen" timeVal={hearing.open_at}/>
              <br/>
              <Icon name="clock-o"/> <FormatRelativeTime messagePrefix="timeClose" timeVal={hearing.close_at}/>
            </div>
          </Col>
          <Col xs={12} sm={6}>
            <div className="comment-summary">
              {hearing.n_comments
                ? <div className="commentNumber">
                  <Icon name="comment-o" /> {' '}
                  <FormattedPlural
                      value={hearing.n_comments}
                      one={<FormattedMessage id="totalSubmittedComment" values={{ n: hearing.n_comments }} />}
                      other={<FormattedMessage id="totalSubmittedComments" values={{ n: hearing.n_comments }} />}
                  />
                </div>
              : null}
              {reportUrl
                ? <div className="report-download">
                  <a href={reportUrl}>
                    <small>
                      <Icon name="download" /> <FormattedMessage id="downloadReport" />
                    </small>
                  </a>
                </div>
              : null}
            </div>
          </Col>
        </Row>
        <SocialBar />
      </div>
    );
  }
}

Header.propTypes = {
  hearing: React.PropTypes.object,
  reportUrl: React.PropTypes.string,
  activeLanguage: React.PropTypes.string,
};

export default injectIntl(Header);
