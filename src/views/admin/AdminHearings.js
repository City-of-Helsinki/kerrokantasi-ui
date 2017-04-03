import Helmet from 'react-helmet';
import React from 'react';
import {connect} from 'react-redux';
import {injectIntl, intlShape, FormattedMessage} from 'react-intl';
import {push} from 'redux-router';

import Button from 'react-bootstrap/lib/Button';
import Col from 'react-bootstrap/lib/Col';
import Row from 'react-bootstrap/lib/Row';
import {Tab, Tabs} from 'react-bootstrap';
import {get} from 'lodash';

import HearingList from '../../components/HearingList';
import Icon from '../../utils/Icon';
import {fetchHearingList, fetchLabels} from '../../actions';
import {labelShape} from '../../types';

const now = () => new Date().toISOString();

const ADMIN_HEARING_LISTS = [
  {
    list: 'publishedHearings',
    params: { published: "True", open_at_lte: now() },
    formattedMessage: 'publishedHearings',
  }, {
    list: 'publishedQueueHearings',
    params: { published: "True", open_at_gt: now() },
    formattedMessage: 'publishingQueue',
  }, {
    list: 'draftHearings',
    params: { published: "False" },
    formattedMessage: 'drafts'
  }
];


class AdminHearings extends React.Component {

  static fetchData(dispatch) {
    return Promise.all(
      ADMIN_HEARING_LISTS.map((list) => dispatch(fetchHearingList(list.list, '/v1/hearing', list.params)))
    );
  }
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
      <Tabs defaultActiveKey={0} id="hearing-tabs" animation={false}>
        {
          ADMIN_HEARING_LISTS.map((list, index) =>
            <Tab key={list.list} eventKey={index} title={formatMessage({id: list.formattedMessage})}>
              <Row>
                <Col md={8}>
                  <HearingList
                    hearings={get(hearingLists, `[${list.list}].data`)}
                    isLoading={get(hearingLists, `[${list.list}].isLoading`)}
                    language={language}
                    labels={labels}
                    handleChangeFilter={null}
                    handleSort={null}
                    handleSearch={null}
                  />
                </Col>
              </Row>
            </Tab>
          )
        }
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
