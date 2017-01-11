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

    this.state = {sortBy: '-created_at', hearingFilter: 'all'};
  }

  static fetchData(dispatch, sortBy, searchTitle, labels) {
    const params = searchTitle ? {title: searchTitle, ordering: sortBy} : {ordering: sortBy};
    if (labels) {
      params.label = labels;
    }
    return dispatch(fetchHearingList("allHearings", "/v1/hearing/", params));
  }

  static fetchLabels(dispatch) {
    return dispatch(fetchLabels());
  }

  getVisibleHearings() {
    const {hearings} = this.props;
    const {hearingFilter} = this.state;

    if (hearingFilter !== 'all') {
      return hearings.filter(
        (hearing) => hearing.labels.filter(
          (label) => label.label === hearingFilter
        ).length !== 0
      );
    }

    return hearings;
  }

  handleSort(newOrder) {
    const {dispatch} = this.props;
    this.setState({sortBy: newOrder});
    AllHearings.fetchData(dispatch, newOrder);
  }

  changeFilter(newFilter) {
    this.setState({hearingFilter: newFilter});
  }

  handleChangeFilter(filter) {
    this.changeFilter(filter);
  }

  handleSearch(event, searchTitle, labels) {
    if (event) {
      event.preventDefault();
    }
    const {dispatch} = this.props;
    const {sortBy} = this.state;
    const labelIds = labels ? labels.map((label) => label.id).toString() : null;
    AllHearings.fetchData(dispatch, sortBy, searchTitle, labelIds);
  }

  componentDidMount() {
    const {dispatch} = this.props;
    const {sortBy} = this.state;
    AllHearings.fetchData(dispatch, sortBy);
    AllHearings.fetchLabels(dispatch);
  }

  render() {
    const {formatMessage} = this.props.intl;
    const {isLoading, labels} = this.props;
    return (<div className="container">
      <Helmet title={formatMessage({id: 'allHearings'})}/>
      <h1 className="page-title"><FormattedMessage id="allHearings"/></h1>
      <Row>
        <Col md={8}>
          <HearingList
            hearings={this.getVisibleHearings()}
            isLoading={isLoading}
            labels={labels}
            handleChangeFilter={this.handleChangeFilter.bind(this)}
            handleSort={this.handleSort.bind(this)}
            handleSearch={this.handleSearch.bind(this)}
          />
        </Col>
      </Row>
    </div>);
  }
}

AllHearings.propTypes = {
  intl: intlShape.isRequired,
  dispatch: React.PropTypes.func,
  language: React.PropTypes.string, // To rerender when language changes
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
