import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { injectIntl, intlShape, FormattedMessage } from 'react-intl';
import Helmet from 'react-helmet';
import { Col, Row } from 'react-bootstrap';
import { get, find } from 'lodash';
import { withRouter } from 'react-router-dom';
import * as Actions from '../../actions';
import { isAdmin } from '../../utils/user';
import WrappedHearingList from '../../components/HearingList';
import LoadSpinner from '../../components/LoadSpinner';
import CreateHearingButton from '../../components/Hearings/CreateHearingButton';
import AdminFilterSelector from '../../components/Hearings/AdminFilterSelector';
import { hearingShape, labelShape, userShape } from '../../types';
import getAttr from '../../utils/getAttr';
import { parseQuery, stringifyQuery } from '../../utils/urlQuery';

const now = () => new Date().toISOString();

const HearingLists = {
  ALL: {
    list: 'allHearings',
    params: {},
    formattedMessage: 'allHearings',
  },
  OPEN: {
    list: 'openHearings',
    params: {},
    formattedMessage: 'openHearings',
  },
  PUBLISHED: {
    list: 'publishedHearings',
    params: { published: 'True' },
    formattedMessage: 'publishedHearings',
  },
  QUEUE: {
    list: 'publishingQueueHearings',
    params: { published: 'True' },
    formattedMessage: 'publishingQueue',
  },
  DRAFTS: {
    list: 'draftHearings',
    params: { published: 'False' },
    formattedMessage: 'drafts',
  },
};

const AdminFilters = [HearingLists.PUBLISHED, HearingLists.QUEUE, HearingLists.DRAFTS];

const getHearingListParams = listName => {
  const defaultParams = { include: 'geojson' };
  const hearingList = find(HearingLists, ({ list }) => list === listName);
  const hearingListParams = get(hearingList, 'params', {});

  const params = Object.assign({}, defaultParams, hearingListParams);

  switch (listName) {
    case HearingLists.PUBLISHED.list:
      params.open_at_lte = now();
      break;
    case HearingLists.QUEUE.list:
      params.open_at_gt = now();
      break;
    default:
    // Don't edit params further
  }
  return params;
};

export class Hearings extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      sortBy: '-created_at',
      adminFilter: isAdmin(props.user) ? AdminFilters[0].list : null,
      showOnlyOpen: false,
    };

    this.handleSearch = this.handleSearch.bind(this);
    this.handleSelectLabels = this.handleSelectLabels.bind(this);
    this.handleSort = this.handleSort.bind(this);
    this.setAdminFilter = this.setAdminFilter.bind(this);
    this.toggleShowOnlyOpen = this.toggleShowOnlyOpen.bind(this);
  }

  componentDidMount() {
    const { fetchLabels } = this.props;
    fetchLabels();
    // Hearing List is fetched when labels are available -> componentWillReceiveProps
  }

  componentWillReceiveProps(nextProps) {
<<<<<<< HEAD
    const { user, location, match: {params: {tab}} } = this.props;
=======
    const { user, location, labels } = this.props;
>>>>>>> Fix #433
    const { adminFilter } = this.state;
    const shouldSetAdminFilter = isAdmin(nextProps.user.data) && (!user.data || !adminFilter);
    const shouldNullAdminFilter = isAdmin(user.data) && !nextProps.user.data;
    const shouldFetchHearings = labels && (
      (!this.props.labels.length && nextProps.labels.length) ||
      (nextProps.labels.length && location.search !== nextProps.location.search) ||
      (!this.props.user && nextProps.user) ||
      (this.props.user && !nextProps.user)) || nextProps.match.params.tab !== tab;

    if (shouldSetAdminFilter) {
      this.setAdminFilter(AdminFilters[0].list);
    }

    if (shouldNullAdminFilter) {
      this.setAdminFilter(null);
    }

    if (shouldFetchHearings) {
      this.fetchHearingList(nextProps);
    }
  }

  getHearings() {
    const { hearingLists } = this.props;
    const hearingListKey = this.getHearingListName();
    return get(hearingLists, [hearingListKey, 'data'], null);
  }

  getHearingListName() {
    const { user } = this.props;
    const { adminFilter } = this.state;

    return isAdmin(user.data) ? adminFilter : HearingLists.ALL.list;
  }

  getIsLoading() {
    const { hearingLists } = this.props;
    const name = this.getHearingListName();
    return get(hearingLists, [name, 'isFetching'], true);
  }

  static getSearchParams(props) {
    const { labels, language, location } = props;
    const params = {};

    if (parseQuery(location.search).search) Object.assign(params, {title: parseQuery(location.search).search});
    if (parseQuery(location.search).label) Object.assign(params, {label: Hearings.getLabelsFromQuery(parseQuery(location.search).label, labels, language).map(({ id }) => id).toString()});
    return params;
  }

  setAdminFilter(filter) {
    this.setState({ adminFilter: filter }, () => this.fetchHearingList());
  }

  fetchHearingList(props = this.props) {
    const {fetchInitialHearingList, fetchAllHearings, match: {params: {tab}}} = props;
    const { sortBy } = this.state;
    const list = this.getHearingListName();
    const params = Object.assign({}, getHearingListParams(list), { ordering: sortBy }, Hearings.getSearchParams(props));

    if (tab === 'map') {
      fetchAllHearings(list, params);
    } else {
      fetchInitialHearingList(list, params);
    }
  }

  static getLabelsFromQuery = (labelsInQuery = [], labels = [], language) => {
    if (Array.isArray(labelsInQuery)) return labels.filter(({ label }) => labelsInQuery.includes(getAttr(label, language)));

    return labels.filter(({ label }) => labelsInQuery === getAttr(label, language));
  };

  handleSearch(searchTitle, force = false) {
    const { history, location } = this.props;
    const label = location.search !== '' ? parseQuery(location.search).label : [];
    const searchPhraseUpdated = parseQuery(location.search).search !== searchTitle;
    if (searchPhraseUpdated || force) {
      history.push({
        path: location.path,
        search: searchTitle !== '' ? stringifyQuery({ search: searchTitle, label }) : stringifyQuery({ label }),
      });
    }
  }

  handleSelectLabels(labels) {
    const { history, location } = this.props;

    history.push({
      path: location.pathname,
      search:
        labels.length > 0
          ? stringifyQuery({ search: parseQuery(location.search).search, label: labels.map(({ label }) => label) })
          : stringifyQuery({ search: parseQuery(location.search).search }),
    });
  }

  handleSort(sortBy) {
    this.setState(
      () => ({ sortBy }),
      () => {
        this.fetchHearingList();
      },
    );
  }

  toggleShowOnlyOpen() {
    this.setState(({ showOnlyOpen }) => ({ showOnlyOpen: !showOnlyOpen }));
  }

  handleReachBottom = () => {
    const {fetchMoreHearings, hearingLists} = this.props;
    const list = this.getHearingListName();

    if (
      hearingLists[list] &&
      hearingLists[list].count > hearingLists[list].data.length &&
      typeof hearingLists[list].next === 'string' &&
      !hearingLists[list].isLoading
    ) {
      fetchMoreHearings(list);
    }
  }

  render() {
    const {
      history,
      intl: { formatMessage },
      labels,
      language,
      match: { params: { tab } },
      location,
      user,
    } = this.props;
    const selectedLabels = parseQuery(location.search).label && parseQuery(location.search).label;
    const searchTitle = parseQuery(location.search).search;
    const { showOnlyOpen } = this.state;
    const hearings = this.getHearings();

    const createHearingButton = isAdmin(user.data) ? (
      <CreateHearingButton onClick={() => history.push('/hearing/new')} />
    ) : null;
    const adminFilterSelector = isAdmin(user.data) ? (
      <AdminFilterSelector
        onSelect={this.setAdminFilter}
        options={AdminFilters}
        valueKey="list"
        active={this.getHearingListName()}
      />
    ) : null;

    if (user.isFetching) {
      return <LoadSpinner />;
    }

    return (
      <div className="hearings">
        <section className="page-section page-section--all-hearings-header">
          <div className="container">
            <Row>
              <Col md={10} mdPush={1}>
                <Helmet title={formatMessage({ id: 'allHearings' })} />
                <h1 className="page-title">
                  <FormattedMessage id="allHearings" />
                </h1>
                {adminFilterSelector}
                {createHearingButton}
              </Col>
            </Row>
          </div>
        </section>
        {labels && labels.length && <WrappedHearingList
          hearings={hearings}
          selectedLabels={selectedLabels ? [].concat(selectedLabels) : []}
          searchPhrase={searchTitle}
          isLoading={this.getIsLoading()}
          labels={labels}
          showOnlyOpen={showOnlyOpen}
          handleSort={this.handleSort}
          handleSearch={this.handleSearch}
          handleSelectLabels={this.handleSelectLabels}
          toggleShowOnlyOpen={this.toggleShowOnlyOpen}
          language={language}
          tab={tab}
          intl={this.props.intl}
          handleReachBottom={this.handleReachBottom}
          onTabChange={value => {
            const url = `/hearings/${value}`;
            history.push({
              pathname: url,
              search: location.search,
            });
          }}
        />}
      </div>
    );
  }
}

Hearings.propTypes = {
  fetchInitialHearingList: PropTypes.func,
  fetchMoreHearings: PropTypes.func,
  fetchLabels: PropTypes.func,
  hearingLists: PropTypes.objectOf(
    PropTypes.shape({
      isFetching: PropTypes.boolean,
      data: PropTypes.arrayOf(hearingShape),
    }),
  ),
  history: PropTypes.shape({
    push: PropTypes.func,
  }),
  intl: intlShape.isRequired,
  labels: PropTypes.arrayOf(labelShape),
  language: PropTypes.string,
  location: PropTypes.shape({
    search: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
  }),
  match: PropTypes.shape({
    params: PropTypes.shape({
      tab: PropTypes.string,
    }),
  }),
  user: PropTypes.shape({
    data: userShape,
    isFetching: PropTypes.boolean,
  }),
};

const mapStateToProps = state => ({
  hearingLists: state.hearingLists,
  labels: state.labels.data,
  language: state.language,
  user: state.user, // Using this on purpose without selector
});

const mapDispatchToProps = dispatch => ({
  fetchInitialHearingList: (listName, params) => dispatch(Actions.fetchInitialHearingList(listName, '/v1/hearing/', params)),
  fetchAllHearings: (list, params) => dispatch(Actions.fetchHearingList(list, '/v1/hearing', params)),
  fetchMoreHearings: (listName) => dispatch(Actions.fetchMoreHearings(listName)),
  fetchLabels: () => dispatch(Actions.fetchLabels()),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(injectIntl(Hearings)));
