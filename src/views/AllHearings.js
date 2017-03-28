import React from 'react';
import Helmet from 'react-helmet';
import {injectIntl, intlShape, FormattedMessage} from 'react-intl';
import {connect} from 'react-redux';
import {fetchHearingList, fetchLabels} from '../actions';
import HearingList from '../components/HearingList';
import Col from 'react-bootstrap/lib/Col';
import Row from 'react-bootstrap/lib/Row';
import queryString from 'query-string';
import {get} from 'lodash';
import getAttr from '../utils/getAttr';

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

    this.state = {
      sortBy: '-created_at',
      showOnlyOpen: false,
      isMobile: window.innerWidth < 992
    };
    this.handleResize = this.handleResize.bind(this);
  }

  static fetchData(dispatch, sortBy, searchTitle, labels) {
    const params = (
      searchTitle ?
        {title: searchTitle, ordering: sortBy, include: 'geojson'} :
        {ordering: sortBy, include: 'geojson'}
    );

    if (labels) {
      params.label = labels;
    }
    return dispatch(fetchHearingList("allHearings", "/v1/hearing/", params));
  }

  static fetchLabels(dispatch) {
    return dispatch(fetchLabels());
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
    AllHearings.updateQueryStringOnSearch(searchTitle, labels, labelIds);
  }

  static updateQueryStringOnSearch(searchTitle, labels, labelIds) {
    if (history.pushState) {
      const nextQuery = queryString.stringify({
        search: searchTitle || undefined,
        label: labels.map((label) => getAttr(label.label)) || undefined
      });
      const newSearch = searchTitle || labelIds ? `?${nextQuery}` : '';
      const newurl = `${location.protocol}//${window.location.host}${window.location.pathname}${newSearch}`;
      window.history.pushState({path: newurl}, '', newurl);
    }
  }

  toggleShowOnlyOpen() {
    if (this.state.showOnlyOpen) {
      this.setState({showOnlyOpen: false});
    } else {
      this.setState({showOnlyOpen: true});
    }
  }

  handleResize() {
    this.setState({ isMobile: window.innerWidth < 992 });
  }

  componentDidMount() {
    const {dispatch} = this.props;
    AllHearings.fetchLabels(dispatch);
    // Note: Fetch hearings after label ids are usable -> componentWillReceiveProps
    window.addEventListener('resize', this.handleResize);
  }

  componentWillReceiveProps(nextProps) {
    const shouldFetchHearings = !this.props.labels.length && nextProps.labels.length;

    if (shouldFetchHearings) {
      const {dispatch, language} = this.props;
      const {sortBy} = this.state;
      const queryLabels = [].concat(get(queryString.parse(location.search), 'label', []));
      const selectedLabels = nextProps.labels.filter(
        (label) => queryLabels.includes(getAttr(label.label, language))
      ).map((label) => label.id);

      AllHearings.fetchData(dispatch, sortBy, '', selectedLabels.toString());
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }

  render() {
    const {formatMessage} = this.props.intl;
    const {isLoading, labels, language} = this.props;
    const {showOnlyOpen, isMobile} = this.state;
    const activeTab = this.props.params.tab ? this.props.params.tab : 'list';

    return (<div className="container">
      <Helmet title={formatMessage({id: 'allHearings'})}/>
      <h1 className="page-title"><FormattedMessage id="allHearings"/></h1>
      <Row>
        <Col md={8}>
          <HearingList
            hearings={this.props.hearings}
            isLoading={isLoading}
            labels={labels}
            handleChangeFilter={this.handleChangeFilter.bind(this)}
            handleSort={this.handleSort.bind(this)}
            handleSearch={this.handleSearch.bind(this)}
            language={language}
            activeTab={activeTab}
            showOnlyOpen={showOnlyOpen}
            toggleShowOnlyOpen={this.toggleShowOnlyOpen.bind(this)}
            isMobile={isMobile}
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
  labels: React.PropTypes.object,
  params: React.PropTypes.object,
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
