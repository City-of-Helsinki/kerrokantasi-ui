import { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { useIntl, FormattedMessage } from 'react-intl';
import { Helmet } from 'react-helmet-async';
import { get, find, includes } from 'lodash';
import isEmpty from 'lodash/isEmpty';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import { formatPageTitle } from '../../utils/pageTitle';
import * as Actions from '../../actions';
import { isAdmin } from '../../utils/user';
import WrappedHearingList, {
  HEARING_LIST_TABS,
} from '../../components/HearingList/HearingList';
import LoadSpinner from '../../components/LoadSpinner';
import CreateHearingButton from '../../components/Hearings/CreateHearingButton';
import AdminFilterSelector from '../../components/Hearings/AdminFilterSelector';
import { hearingShape, labelShape, userShape } from '../../types';
import getAttr from '../../utils/getAttr';
import { parseQuery, stringifyQuery } from '../../utils/urlQuery';
import getUser from '../../selectors/user';

const now = () => new Date().toISOString();

const HearingLists = {
  ALL: {
    list: 'allHearings',
    isFetching: false,
    params: {},
    formattedMessage: 'allHearings',
    iconName: 'globe',
  },
  OPEN: {
    list: 'openHearings',
    isFetching: false,
    params: {},
    formattedMessage: 'openHearings',
    iconName: 'commenting-o',
  },
  PUBLISHED: {
    list: 'publishedHearings',
    isFetching: false,
    params: { published: 'True' },
    formattedMessage: 'publishedHearings',
    iconName: 'eye',
  },
  QUEUE: {
    list: 'publishingQueueHearings',
    isFetching: false,
    params: { published: 'True' },
    formattedMessage: 'publishingQueue',
    iconName: 'calendar-check-o',
  },
  DRAFTS: {
    list: 'draftHearings',
    isFetching: false,
    params: { published: 'False' },
    formattedMessage: 'drafts',
    iconName: 'pencil-square-o',
  },
  OWN: {
    list: 'ownHearings',
    isFetching: false,
    params: {},
    formattedMessage: 'ownHearings',
    iconName: 'user',
    role: 'link',
  },
};

const AdminFilters = [
  HearingLists.PUBLISHED,
  HearingLists.QUEUE,
  HearingLists.DRAFTS,
  HearingLists.OWN,
];

const getHearingListParams = (listName) => {
  const defaultParams = { include: 'geojson' };
  const hearingList = find(HearingLists, ({ list }) => list === listName);
  const hearingListParams = get(hearingList, 'params', {});

  const params = { ...defaultParams, ...hearingListParams };

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

const ensuredTab = (tab) =>
  Object.values(HEARING_LIST_TABS).includes(tab) ? tab : HEARING_LIST_TABS.LIST;

const getHearingListStoreKey = (listName, tab) =>
  tab === HEARING_LIST_TABS.MAP ? `${listName}Map` : listName;

function Hearings({
  user,
  labels,
  fetchInitialHearingList,
  fetchAllHearings,
  hearingLists,
  fetchMoreHearings,
  language,
  fetchLabels,
}) {
  const intl = useIntl();
  const params = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [adminFilter, setAdminFilter] = useState(null);
  const [initHearingsFetched, setInitHearingsFetched] = useState(false);
  const [showOnlyOpen, setShowOnlyOpen] = useState(false);
  const [showOnlyClosed, setShowOnlyClosed] = useState(false);
  const [sortBy, setSortBy] = useState('-created_at');

  const tab = ensuredTab(params.tab);

  const forwardToUserHearings = () => {
    const searchParams = parseQuery(location.search);

    navigate({
      pathname: '/user-hearings',
      search: stringifyQuery(searchParams),
    });
  };

  const getHearingListName = useCallback(
    () => (isAdmin(user) ? adminFilter : HearingLists.ALL.list),
    [adminFilter, user]
  );

  const getLabelsFromQuery = (labelsInQuery = []) => {
    if (Array.isArray(labelsInQuery)) return labelsInQuery;

    return [labelsInQuery];
  };

  const getSearchParams = useCallback(() => {
    const searchParams = {};
    if (parseQuery(location.search).search)
      Object.assign(searchParams, {
        title: parseQuery(location.search).search,
      });
    if (parseQuery(location.search).label) {
      Object.assign(searchParams, {
        label: getLabelsFromQuery(parseQuery(location.search).label.toString()),
      });
    }
    return searchParams;
  }, [location.search]);

  const getCurrentHearingListKey = useCallback(
    () => getHearingListStoreKey(getHearingListName(), tab),
    [getHearingListName, tab]
  );

  const fetchHearingList = useCallback(() => {
    const baseList = getHearingListName();
    const list = getHearingListStoreKey(baseList, tab);
    const filterByOpen =
      (showOnlyOpen && !showOnlyClosed) || (!showOnlyOpen && showOnlyClosed);
    const fetchParams = {
      ...getHearingListParams(baseList),
      ordering: sortBy,
      ...(filterByOpen && { open: showOnlyOpen }),
      ...getSearchParams(),
    };

    if (tab === 'map') {
      fetchAllHearings(list, fetchParams);
    } else {
      fetchInitialHearingList(list, fetchParams);
    }
    setInitHearingsFetched(true);
  }, [
    fetchAllHearings,
    fetchInitialHearingList,
    getHearingListName,
    getSearchParams,
    showOnlyClosed,
    showOnlyOpen,
    sortBy,
    tab,
  ]);

  const handleAdminFilter = (filter) => {
    if (filter === 'ownHearings') {
      forwardToUserHearings();
    } else {
      setAdminFilter(filter);
    }
  };

  const handleSearch = (searchTitle, force = false) => {
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
    if (
      !force &&
      (searchParams.search === searchTitle ||
        (searchParamsEmpty && searchPhraseEmpty))
    ) {
      return;
    }

    if (searchPhraseEmpty) {
      delete searchParams.search;
    } else {
      searchParams.search = searchTitle;
    }

    if (searchPhraseUpdated || force) {
      navigate({
        path: location.path,
        search: stringifyQuery(searchParams),
      });
    }
  };

  const handleSelectLabels = (selectLabels) => {
    const selectArray = Array.isArray(selectLabels)
      ? selectLabels
      : [selectLabels];
    const searchParams = parseQuery(location.search);

    searchParams.label = selectArray
      .map((selectedItem) => selectedItem.value)
      .filter(Boolean);

    navigate({
      path: location.pathname,
      search: stringifyQuery(searchParams),
    });
  };

  const handleSort = (newSortBy, newShowOnlyOpen, newShowOnlyClosed) => {
    setSortBy(newSortBy);
    setShowOnlyOpen(newShowOnlyOpen);
    setShowOnlyClosed(newShowOnlyClosed);
    setInitHearingsFetched(false);
  };

  const getIsLoading = () =>
    get(hearingLists, [getCurrentHearingListKey(), 'isFetching'], true);

  const getHearingsCount = () =>
    get(hearingLists, [getCurrentHearingListKey(), 'count'], 0);

  const getHearings = () =>
    get(hearingLists, [getCurrentHearingListKey(), 'data'], []);

  const handleReachBottom = () => {
    const list = getCurrentHearingListKey();

    if (
      hearingLists[list] &&
      hearingLists[list].count > hearingLists[list].data.length &&
      typeof hearingLists[list].next === 'string' &&
      !hearingLists[list].isLoading
    ) {
      fetchMoreHearings(list);
    }
  };

  const toggleShowOnlyOpen = () => {
    setShowOnlyOpen(!showOnlyOpen);
  };

  const { formatMessage } = intl;

  const labelsInQuery = Array.isArray(parseQuery(location.search).label)
    ? parseQuery(location.search).label
    : [parseQuery(location.search).label];

  // Updated selectedLabels to work with HDS 4
  const selectedLabels = labels
    .filter((label) => includes(labelsInQuery, label.id.toString()))
    .map((label) => {
      const translatedLabel = getAttr(label.label, language);
      return {
        label: translatedLabel,
        value: String(label.id),
      };
    });

  const searchTitle = parseQuery(location.search).search;

  const hearings = getHearings();

  const hearingCount = getHearingsCount();

  useEffect(() => {
    fetchLabels();
    // Hearing List is fetched when labels are available -> componentWillReceiveProps
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!initHearingsFetched && !isEmpty(labels)) {
      fetchHearingList();
    }
  }, [initHearingsFetched, fetchHearingList, labels]);

  useEffect(() => {
    const shouldSetAdminFilter = isAdmin(user) && (!user || !adminFilter);
    const shouldNullAdminFilter = !user || !isAdmin(user);
    const shouldFetchHearings =
      labels &&
      (!user || (user && adminFilter)) &&
      !isEmpty(getHearingListName());

    if (shouldSetAdminFilter) {
      handleAdminFilter(AdminFilters[0].list);
    }

    if (shouldNullAdminFilter) {
      setAdminFilter(null);
    }

    if (shouldFetchHearings) {
      fetchHearingList();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, labels, params, location, adminFilter]);

  if (user && user.isFetching) {
    return <LoadSpinner />;
  }

  return (
    <div className='hearings'>
      <section className='page-section page-section--all-hearings-header'>
        <div className='all-hearings-header-container'>
          <Helmet
            title={formatPageTitle(formatMessage({ id: 'allHearings' }))}
            meta={[
              {
                name: 'description',
                content: formatMessage({ id: 'descriptionTag' }),
              },
              {
                property: 'og:description',
                content: formatMessage({ id: 'descriptionTag' }),
              },
            ]}
          />
          <FormattedMessage id='allHearings'>
            {(txt) => <h1 className='page-title'>{txt}</h1>}
          </FormattedMessage>
          {isAdmin(user) && (
            <AdminFilterSelector
              onSelect={setAdminFilter}
              options={AdminFilters}
              active={getHearingListName()}
            />
          )}
          {isAdmin(user) && (
            <CreateHearingButton to={{ path: '/hearing/new' }} />
          )}
        </div>
      </section>
      {!isEmpty(labels) ? (
        <WrappedHearingList
          hearings={hearings}
          hearingCount={hearingCount}
          selectedLabels={selectedLabels ? selectedLabels : []}
          searchPhrase={searchTitle}
          isLoading={getIsLoading()}
          labels={labels}
          showOnlyOpen={showOnlyOpen}
          handleSort={handleSort}
          handleSearch={handleSearch}
          handleSelectLabels={handleSelectLabels}
          toggleShowOnlyOpen={toggleShowOnlyOpen}
          language={language}
          tab={tab}
          intl={intl}
          handleReachBottom={handleReachBottom}
          onTabChange={(value) => {
            const url = `/hearings/${value}`;
            if (location.pathname !== url) {
              navigate({
                pathname: url,
                search: location.search,
              });
            }
          }}
        />
      ) : (
        <LoadSpinner />
      )}
    </div>
  );
}

Hearings.propTypes = {
  fetchInitialHearingList: PropTypes.func,
  fetchMoreHearings: PropTypes.func,
  fetchLabels: PropTypes.func,
  hearingLists: PropTypes.objectOf(
    PropTypes.shape({
      isFetching: PropTypes.bool,
      data: PropTypes.arrayOf(hearingShape),
    })
  ),
  labels: PropTypes.arrayOf(labelShape),
  language: PropTypes.string,
  user: PropTypes.shape({
    data: userShape,
    isFetching: PropTypes.bool,
  }),
};

const mapStateToProps = (state) => ({
  hearingLists: state.hearingLists,
  labels: state.labels.data,
  language: state.language,
  user: getUser(state), // Using this on purpose without selector
});

const mapDispatchToProps = (dispatch) => ({
  fetchInitialHearingList: (listName, params) =>
    dispatch(Actions.fetchInitialHearingList(listName, '/v1/hearing/', params)),
  fetchAllHearings: (list, params) =>
    dispatch(Actions.fetchHearingList(list, '/v1/hearing', params)),
  fetchMoreHearings: (listName) =>
    dispatch(Actions.fetchMoreHearings(listName)),
  fetchLabels: () => dispatch(Actions.fetchLabels()),
});

export const UnconnectedHearings = Hearings;

export default connect(mapStateToProps, mapDispatchToProps)(Hearings);
