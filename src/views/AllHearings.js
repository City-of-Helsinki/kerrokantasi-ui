import React from 'react';
import Helmet from 'react-helmet';
import {injectIntl, intlShape, FormattedMessage} from 'react-intl';
import {connect} from 'react-redux';
import {fetchHearingList, fetchLabels} from '../actions';
import HearingList from '../components/HearingList';
import Col from 'react-bootstrap/lib/Col';
import Row from 'react-bootstrap/lib/Row';

class AllHearings extends React.Component {
  /**
   * Return a promise that will, as it fulfills, have added requisite
   * data for the All Hearings view into the dispatch's associated
   * store.
   *
   * @param dispatch Redux Dispatch function
   * @return {Promise} Data fetching promise
   */
  constructor(props) {
    super(props);

    this.state = {filter: 'all'};
  }

  static fetchData(dispatch) {
    return dispatch(fetchHearingList("allHearings", "/v1/hearing/"));
  }

  static fetchLabels(dispatch) {
    return dispatch(fetchLabels('/v1/label/'));
  }

  getVisibleHearings() {
    const {hearings} = this.props;
    // const hearings = {};

    hearings.allHearings.data.filter(
      (hearing) => hearing.labels.filter(
        (label) => label.label === this.state.filter).length !== 0
    );
  }

  componentDidMount() {
    const {dispatch} = this.props;
    AllHearings.fetchData(dispatch);
    AllHearings.fetchLabels(dispatch);
  }

  render() {
    const {formatMessage} = this.props.intl;
    const {hearings, isLoading, labels} = this.props;
    return (<div className="container">
      <Helmet title={formatMessage({id: 'allHearings'})}/>
      <h1 className="page-title"><FormattedMessage id="allHearings"/></h1>
      <Row>
        <Col md={8}>
          <HearingList hearings={hearings} isLoading={isLoading} labels={labels} />
        </Col>
      </Row>
    </div>);
  }
}

AllHearings.propTypes = {
  intl: intlShape.isRequired,
  dispatch: React.PropTypes.func,
  language: React.PropTypes.string,// To rerender when language changes
  hearings: React.PropTypes.object,
  isLoading: React.PropTypes.string,
  labels: React.PropTypes.object
};

const mapStateToProps = (state) => ({
  hearings: state.hearingLists.allHearings.data,
  isLoading: state.hearingLists.allHearings.isFetching || state.labels.isFetching,
  labels: state.labels.data,
  language: state.language
});

const WrappedAllHearings = connect(mapStateToProps)(injectIntl(AllHearings));
// We need to re-hoist the static fetchData to the wrapped component due to react-intl:
WrappedAllHearings.fetchData = AllHearings.fetchData;
export default WrappedAllHearings;
