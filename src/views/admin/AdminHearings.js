import React from 'react';
import Helmet from 'react-helmet';
import {injectIntl, intlShape} from 'react-intl';
import {connect} from 'react-redux';
import {fetchHearingList} from 'actions';
import HearingList from 'components/HearingList';
import Col from 'react-bootstrap/lib/Col';
import Row from 'react-bootstrap/lib/Row';
import {Tab, Tabs} from 'react-bootstrap';

class AdminHearings extends React.Component {
  static fetchData(dispatch) {
    const now = new Date().toISOString();
    return Promise.all([
      dispatch(fetchHearingList("publishedHearings", "/v1/hearing/", {published: "True", open_at_lte: now})),
      dispatch(fetchHearingList("publishingQueueHearings", "/v1/hearing/", {published: "True", open_at_gt: now})),
      dispatch(fetchHearingList("draftHearings", "/v1/hearing/", {published: "False"}))
    ]);
  }

  componentDidMount() {
    const {dispatch} = this.props;
    AdminHearings.fetchData(dispatch);
  }

  render() {
    const {formatMessage} = this.props.intl;
    const {hearingLists} = this.props;

    return (<div className="container">
      <Helmet title={formatMessage({id: 'allHearings'})}/>

      {/* switching tabs doesn't seem to work if animation isn't disabled */}
      <Tabs defaultActiveKey={1} id="hearing-tabs" animation={false}>
        <Tab eventKey={1} title={formatMessage({id: 'publishedHearings'})}>
          <Row>
            <Col md={8}>
              <HearingList hearings={hearingLists.publishedHearings} />
            </Col>
          </Row>
        </Tab>
        <Tab eventKey={2} title={formatMessage({id: 'publishingQueue'})}>
          <Row>
            <Col md={8}>
              <HearingList hearings={hearingLists.publishingQueueHearings} />
            </Col>
          </Row>
        </Tab>
        <Tab eventKey={3} title={formatMessage({id: 'drafts'})}>
          <Row>
            <Col md={8}>
              <HearingList hearings={hearingLists.draftHearings} />
            </Col>
          </Row>
        </Tab>
      </Tabs>
    </div>);
  }
}

AdminHearings.propTypes = {
  intl: intlShape.isRequired,
  dispatch: React.PropTypes.func,
  hearingLists: React.PropTypes.object
};

const WrappedAdminHearings = connect((state) => ({hearingLists: state.hearingLists}))(injectIntl(AdminHearings));
// We need to re-hoist the static fetchData to the wrapped component due to react-intl:
WrappedAdminHearings.fetchData = AdminHearings.fetchData;
export default WrappedAdminHearings;
