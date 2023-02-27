// TODO: remove this disable once https://github.com/yannickcr/eslint-plugin-react/pull/1628 lands
/* eslint-disable react/no-unused-prop-types */
/* eslint-disable react/prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { injectIntl, intlShape, FormattedMessage } from 'react-intl';
import Helmet from 'react-helmet';
import { Col, Row } from 'react-bootstrap';
import { get, find, includes } from 'lodash';
import isEmpty from 'lodash/isEmpty';
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
import {getUser} from '../../selectors/user';

const now = () => new Date().toISOString();

const HearingLists = {
  ALL: {
    list: 'allHearings',
    params: {},
    formattedMessage: 'allHearings',
    iconName: 'globe'
  },
  OPEN: {
    list: 'openHearings',
    params: {},
    formattedMessage: 'openHearings',
    iconName: 'commenting-o'
  },
  PUBLISHED: {
    list: 'publishedHearings',
    params: { published: 'True' },
    formattedMessage: 'publishedHearings',
    iconName: 'eye'
  },
  QUEUE: {
    list: 'publishingQueueHearings',
    params: { published: 'True' },
    formattedMessage: 'publishingQueue',
    iconName: 'calendar-check-o'
  },
  DRAFTS: {
    list: 'draftHearings',
    params: { published: 'False' },
    formattedMessage: 'drafts',
    iconName: 'pencil-square-o'
  },
  OWN: {
    list: 'ownHearings',
    params: {},
    formattedMessage: 'ownHearings',
    iconName: 'user',
    role: 'link'
  }
};

const AdminFilters = [HearingLists.PUBLISHED, HearingLists.QUEUE, HearingLists.DRAFTS, HearingLists.OWN];

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
      showOnlyClosed: false,
      initHearingsFetched: false,
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
    const { user, location, match: {params: {tab}}, labels } = this.props;
    const { adminFilter, initHearingsFetched } = this.state;
    const shouldSetAdminFilter = isAdmin(nextProps.user) && (!user || !adminFilter);
    const shouldNullAdminFilter = isAdmin(user) && !nextProps.user;
    const shouldFetchHearings = labels && ((
      (!this.props.labels.length && nextProps.labels.length) ||
      (nextProps.labels.length && location.search !== nextProps.location.search) ||
      (!this.props.user && nextProps.user) ||
      (this.props.user && !nextProps.user)) || nextProps.match.params.tab !== tab ||
      !initHearingsFetched);

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

  getHearingsCount() {
    const { hearingLists } = this.props;
    const list = this.getHearingListName();
    return get(hearingLists, [list, 'count'], 0);
  }

  getHearingListName() {
    const { user } = this.props;
    const { adminFilter } = this.state;

    return isAdmin(user) ? adminFilter : HearingLists.ALL.list;
  }

  getIsLoading() {
    const { hearingLists } = this.props;
    const name = this.getHearingListName();
    return get(hearingLists, [name, 'isFetching'], true);
  }

  static getSearchParams(props) {
    const { location } = props;
    const params = {};

    if (parseQuery(location.search).search) Object.assign(params, {title: parseQuery(location.search).search});
    if (parseQuery(location.search).label) {
      Object.assign(params, {label: Hearings.getLabelsFromQuery(parseQuery(location.search).label.toString())});
    }
    return params;
  }

  setAdminFilter(filter) {
    if (filter === 'ownHearings') {
      this.forwardToUserHearings();
    } else {
      this.setState({ adminFilter: filter }, () => this.fetchHearingList());
    }
  }

  forwardToUserHearings() {
    const {history, location} = this.props;
    const searchParams = parseQuery(location.search);
    history.push({
      pathname: '/user-hearings',
      search: stringifyQuery(searchParams)
    });
  }

  fetchHearingList(props = this.props) {
    const {fetchInitialHearingList, fetchAllHearings, match: {params: {tab}}} = props;
    const { sortBy, showOnlyOpen, showOnlyClosed } = this.state;
    const list = this.getHearingListName();
    const filterByOpen = (showOnlyOpen && !showOnlyClosed) || (!showOnlyOpen && showOnlyClosed);
    const params = Object.assign(
      {},
      getHearingListParams(list),
      {
        ordering: sortBy,
        ...filterByOpen && {open: showOnlyOpen},
      },
      Hearings.getSearchParams(props)
    );

    if (tab === 'map') {
      fetchAllHearings(list, params);
    } else {
      fetchInitialHearingList(list, params);
    }
    this.setState({initHearingsFetched: true});
  }

  static getLabelsFromQuery = (labelsInQuery = []) => {
    if (Array.isArray(labelsInQuery)) return labelsInQuery;

    return [labelsInQuery];
  };

  handleSearch(searchTitle, force = false) {
    const { history, location } = this.props;
    const searchParams = parseQuery(location.search);
    const searchParamsEmpty = isEmpty(searchParams.search);
    const searchPhraseEmpty = isEmpty(searchTitle);
    const searchPhraseUpdated = searchParams.search !== searchTitle;

    // Don't do anything if:
    // search is not forced
    // AND
    // current search params are the same as the inputted search
    // OR
    // both search params and currently inputted search are empty
    if (!force && ((searchParams.search === searchTitle) || (searchParamsEmpty && searchPhraseEmpty))) {
      return;
    }

    if (searchPhraseEmpty) {
      delete searchParams.search;
    } else {
      searchParams.search = searchTitle;
    }

    if (searchPhraseUpdated || force) {
      history.push({
        path: location.path,
        search: stringifyQuery(searchParams),
      });
    }
  }

  handleSelectLabels(labels) {
    const { history, location } = this.props;
    const searchParams = parseQuery(location.search);
    searchParams.label = labels.map(({ id }) => id);
    history.push({
      path: location.pathname,
      search: stringifyQuery(searchParams)
    });
  }

  handleSort(sortBy, showOnlyOpen, showOnlyClosed) {
    this.setState(
      () => ({ sortBy, showOnlyOpen, showOnlyClosed }),
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
    const labelsInQuery = Array.isArray(parseQuery(location.search).label)
      ? parseQuery(location.search).label
      : [parseQuery(location.search).label];
    const selectedLabels = labels
      .filter(label => includes(labelsInQuery, label.id.toString())).map(label => getAttr(label.label, language));
    const searchTitle = parseQuery(location.search).search;
    const { showOnlyOpen } = this.state;
    const hearings = this.getHearings();
    const hearingCount = this.getHearingsCount();

    if (user && user.isFetching) {
      return <LoadSpinner />;
    }
    return (
      <div className="hearings">
        <section className="page-section page-section--all-hearings-header">
          <div className="container">
            <Row>
              <Col md={10} mdPush={1}>
                <Helmet
                  title={formatMessage({ id: 'allHearings' })}
                  meta={[
                    {name: "description", content: formatMessage({ id: 'descriptionTag' })},
                    {property: "og:description", content: formatMessage({ id: 'descriptionTag' })}
                  ]}
                />
                <FormattedMessage id="allHearings">
                  {txt => <h1 className="page-title">{txt}</h1>}
                </FormattedMessage>
                {isAdmin(user) &&
                  <AdminFilterSelector
                  onSelect={this.setAdminFilter}
                  options={AdminFilters}
                  active={this.getHearingListName()}
                  />
                }
                {isAdmin(user) && <CreateHearingButton to={{path: '/hearing/new'}} />}
              </Col>
            </Row>
          </div>
        </section>
        {!isEmpty(labels) ? <WrappedHearingList
          hearings={hearings}
          hearingCount={hearingCount}
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
        /> : <LoadSpinner />}
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
  user: getUser(state), // Using this on purpose without selector
});

const mapDispatchToProps = dispatch => ({
  fetchInitialHearingList: (listName, params) =>
    dispatch(Actions.fetchInitialHearingList(listName, '/v1/hearing/', params)),
  fetchAllHearings: (list, params) => dispatch(Actions.fetchHearingList(list, '/v1/hearing', params)),
  fetchMoreHearings: (listName) => dispatch(Actions.fetchMoreHearings(listName)),
  fetchLabels: () => dispatch(Actions.fetchLabels()),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(injectIntl(Hearings)));
