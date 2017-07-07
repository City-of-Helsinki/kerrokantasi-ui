import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import {injectIntl, intlShape, FormattedMessage} from 'react-intl';
import {connect} from 'react-redux';
import {fetchHearingList, fetchLabels} from '../actions';
import HearingList from '../components/HearingList';
import {Row, Col} from 'react-bootstrap';
import queryString from 'query-string';
import {get} from 'lodash';
import getAttr from '../utils/getAttr';
import {labelShape, hearingShape} from '../types';

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
      isMobile: typeof window !== 'undefined' && window.innerWidth < 992,
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
    const nextQuery = queryString.stringify({
      search: searchTitle || undefined,
      label: labels.map((label) => getAttr(label.label)) || undefined
    });
    const newSearch = searchTitle || labelIds ? `?${nextQuery}` : '';
    const newurl = `${location.protocol}//${window.location.host}${window.location.pathname}${newSearch}`;

    if (history.pushState) {
      history.pushState({path: newurl}, '', newurl);
    } else {
      window.location.href = newurl;
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
    this.setState({ isMobile: typeof window !== 'undefined' && window.innerWidth < 992 });
  }

  componentDidMount() {
    const {dispatch} = this.props;
    AllHearings.fetchLabels(dispatch);
    // Note: Fetch hearings after label ids are usable -> componentWillReceiveProps
    if (typeof window !== 'undefined') window.addEventListener('resize', this.handleResize);
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
    if (typeof window !== 'undefined') window.removeEventListener('resize', this.handleResize);
  }

  render() {
    const {formatMessage} = this.props.intl;
    const {isLoading, labels, language} = this.props;
    const {showOnlyOpen, isMobile} = this.state;
    const initialTab = this.props.params.tab ? this.props.params.tab : 'list';
    const searchPhrase = this.props.params.search ? this.props.params.search : '';

    return (<div>
      <section className="page-section page-section--all-hearings-header">
        <div className="container">
          <Row>
            <Col md={12} mdPush={1}>
              <Helmet title={formatMessage({id: 'allHearings'})}/>
              <h1 className="page-title"><FormattedMessage id="allHearings"/></h1>
            </Col>
          </Row>
        </div>
      </section>
      <HearingList
        hearings={this.props.hearings}
        isLoading={isLoading}
        labels={labels}
        handleChangeFilter={this.handleChangeFilter.bind(this)}
        handleSort={this.handleSort.bind(this)}
        handleSearch={this.handleSearch.bind(this)}
        language={language}
        initialTab={initialTab}
        searchPhrase={searchPhrase}
        showOnlyOpen={showOnlyOpen}
        toggleShowOnlyOpen={this.toggleShowOnlyOpen.bind(this)}
        isMobile={isMobile}
        onTabChange={(value) => {
          const url = `/hearings/${value}`;
          if (history.pushState) {
            history.pushState({path: url}, '', url);
          } else {
            window.location.href = url;
          }
        }}
      />
    </div>);
  }
}

AllHearings.propTypes = {
  intl: intlShape.isRequired,
  dispatch: PropTypes.func,
  language: PropTypes.string, // To rerender when language changes
  hearings: PropTypes.arrayOf(hearingShape),
  isLoading: PropTypes.bool,
  labels: PropTypes.arrayOf(labelShape),
  params: PropTypes.object,
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
