import Helmet from 'react-helmet';
import React from 'react';
import {connect} from 'react-redux';
import {injectIntl, intlShape, FormattedMessage} from 'react-intl';
import {push} from 'redux-router';

import Button from 'react-bootstrap/lib/Button';
import Col from 'react-bootstrap/lib/Col';
import Row from 'react-bootstrap/lib/Row';
import {Tab, Tabs} from 'react-bootstrap';

import HearingList from '../../components/HearingList';
import Icon from '../../utils/Icon';
import {fetchHearingList, fetchLabels} from '../../actions';
import {labelShape} from '../../types';


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
    dispatch(fetchLabels());
    AdminHearings.fetchData(dispatch);
  }

  toHearingCreator() {
    this.props.dispatch(push("/hearing/new"));
  }

  render() {
    const {formatMessage} = this.props.intl;
    const {hearingLists, language, labels} = this.props;

    return (<div className="container">
      <Helmet title={formatMessage({id: 'allHearings'})}/>

      <div className="pull-right">
        <Button bsStyle="primary" onClick={() => this.toHearingCreator()}>
          <Icon name="add"/> <FormattedMessage id="createHearing"/>
        </Button>
      </div>

      {/* switching tabs doesn't seem to work if animation isn't disabled */}
      <Tabs defaultActiveKey={1} id="hearing-tabs" animation={false}>
        <Tab eventKey={1} title={formatMessage({id: 'publishedHearings'})}>
          <Row>
            <Col md={8}>
              <HearingList
                hearings={hearingLists.publishedHearings.data}
                isLoading={hearingLists.publishedHearings.isLoading}
                language={language}
                labels={labels}
              />
            </Col>
          </Row>
        </Tab>
        <Tab eventKey={2} title={formatMessage({id: 'publishingQueue'})}>
          <Row>
            <Col md={8}>
              <HearingList
                hearings={hearingLists.publishingQueueHearings.data}
                isLoading={hearingLists.publishingQueueHearings.isLoading}
                language={language}
                labels={labels}
              />
            </Col>
          </Row>
        </Tab>
        <Tab eventKey={3} title={formatMessage({id: 'drafts'})}>
          <Row>
            <Col md={8}>
              <HearingList
                hearings={hearingLists.draftHearings.data}
                isLoading={hearingLists.draftHearings.isLoading}
                language={language}
                labels={labels}
              />
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
  hearingLists: React.PropTypes.object,
  language: React.PropTypes.string,
  labels: React.PropTypes.arrayOf(labelShape)
};

const mapStateToProps = (state) => ({
  hearingLists: state.hearingLists,
  labels: state.labels.data,
  language: state.language
});

const WrappedAdminHearings = connect(mapStateToProps)(injectIntl(AdminHearings));
// We need to re-hoist the static fetchData to the wrapped component due to react-intl:
WrappedAdminHearings.fetchData = AdminHearings.fetchData;
export default WrappedAdminHearings;
