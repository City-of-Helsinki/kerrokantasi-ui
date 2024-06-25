/* eslint-disable camelcase */
// TODO: remove this disable once https://github.com/yannickcr/eslint-plugin-react/pull/1628 lands
/* eslint-disable react/no-unused-prop-types */
/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { injectIntl, FormattedMessage } from 'react-intl';
import Helmet from 'react-helmet';
import { Col, Row } from 'react-bootstrap';
import { get, find, includes } from 'lodash';
import isEmpty from 'lodash/isEmpty';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import * as Actions from '../../actions';
import { isAdmin } from '../../utils/user';
import WrappedHearingList from '../../components/HearingList';
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
    params: {},
    formattedMessage: 'allHearings',
    iconName: 'globe',
  },
  OPEN: {
    list: 'openHearings',
    params: {},
    formattedMessage: 'openHearings',
    iconName: 'commenting-o',
  },
  PUBLISHED: {
    list: 'publishedHearings',
    params: { published: 'True' },
    formattedMessage: 'publishedHearings',
    iconName: 'eye',
  },
  QUEUE: {
    list: 'publishingQueueHearings',
    params: { published: 'True' },
    formattedMessage: 'publishingQueue',
    iconName: 'calendar-check-o',
  },
  DRAFTS: {
    list: 'draftHearings',
    params: { published: 'False' },
    formattedMessage: 'drafts',
    iconName: 'pencil-square-o',
  },
  OWN: {
    list: 'ownHearings',
    params: {},
    formattedMessage: 'ownHearings',
    iconName: 'user',
    role: 'link',
  },
};

const AdminFilters = [HearingLists.PUBLISHED, HearingLists.QUEUE, HearingLists.DRAFTS, HearingLists.OWN];

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

function Hearings(props) {
  const { user, labels } = props;
  const params = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [adminFilter, setAdminFilter] = useState(null);
  const [initHearingsFetched, setInitHearingsFetched] = useState(false);
  const [showOnlyOpen, setShowOnlyOpen] = useState(false);
  const [showOnlyClosed, setShowOnlyClosed] = useState(false);
  const [sortBy, setSortBy] = useState('-created_at');

  const tab = params.tab || 'list';

  useEffect(() => {
    const { fetchLabels } = props;
    fetchLabels();
    // Hearing List is fetched when labels are available -> componentWillReceiveProps
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const forwardToUserHearings = () => {
    const searchParams = parseQuery(location.search);
    navigate({
      pathname: '/user-hearings',
      search: stringifyQuery(searchParams),
    });
  };

  const getHearingListName = () => (isAdmin(user) ? adminFilter : HearingLists.ALL.list);

  const getLabelsFromQuery = (labelsInQuery = []) => {
    if (Array.isArray(labelsInQuery)) return labelsInQuery;

    return [labelsInQuery];
  };

  const getSearchParams = () => {
    const searchParams = {};

    if (parseQuery(location.search).search) Object.assign(params, { title: parseQuery(location.search).search });
    if (parseQuery(location.search).label) {
      Object.assign(searchParams, { label: getLabelsFromQuery(parseQuery(location.search).label.toString()) });
    }
    return params;
  };

  const fetchHearingList = (fetchProps = props) => {
    const { fetchInitialHearingList, fetchAllHearings } = fetchProps;
    const list = getHearingListName();
    const filterByOpen = (showOnlyOpen && !showOnlyClosed) || (!showOnlyOpen && showOnlyClosed);
    const fetchParams = {
      ...getHearingListParams(list),
      ordering: sortBy,
      ...(filterByOpen && { open: showOnlyOpen }),
      ...getSearchParams(),
    };

    if (tab === 'map') {
      fetchAllHearings(list, fetchParams);
    } else {
      fetchInitialHearingList(list, fetchParams);
    }
    setInitHearingsFetched({ initHearingsFetched: true });
  };

  const handleAdminFilter = (filter) => {
    if (filter === 'ownHearings') {
      forwardToUserHearings();
    } else {
      setAdminFilter({ adminFilter: filter }, () => fetchHearingList());
    }
  };

  useEffect(() => {
    const shouldSetAdminFilter = isAdmin(user) && (!user || !adminFilter);
    const shouldNullAdminFilter = isAdmin(user) && !user;
    const shouldFetchHearings =
      labels &&
      ((!labels.length && labels.length) ||
        // eslint-disable-next-line sonarjs/no-identical-expressions, no-self-compare
        (labels.length && location.search !== location.search) ||
        (!user && user) ||
        (user && !user) ||
        // eslint-disable-next-line sonarjs/no-identical-expressions, no-self-compare
        params.tab !== params.tab ||
        !initHearingsFetched);

    if (shouldSetAdminFilter) {
      handleAdminFilter(AdminFilters[0].list);
    }

    if (shouldNullAdminFilter) {
      handleAdminFilter(null);
    }

    if (shouldFetchHearings) {
      fetchHearingList(props);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, labels, params, location, adminFilter, initHearingsFetched]);

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
    if (!force && (searchParams.search === searchTitle || (searchParamsEmpty && searchPhraseEmpty))) {
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
    const searchParams = parseQuery(location.search);
    searchParams.label = selectLabels.map(({ id }) => id);
    navigate({
      path: location.pathname,
      search: stringifyQuery(searchParams),
    });
  };

  const handleSort = (newSortBy, newShowOnlyOpen, newShowOnlyClosed) => {
    setSortBy(newSortBy);
    setShowOnlyOpen(newShowOnlyOpen);
    setShowOnlyClosed(newShowOnlyClosed);
    fetchHearingList();
  };

  const getIsLoading = () => {
    const { hearingLists } = props;
    const name = getHearingListName();
    return get(hearingLists, [name, 'isFetching'], true);
  };

  const getHearingsCount = () => {
    const { hearingLists } = props;
    const list = getHearingListName();
    return get(hearingLists, [list, 'count'], 0);
  };

  const getHearings = () => {
    const { hearingLists } = props;

    const hearingListKey = getHearingListName();
    return get(hearingLists, [hearingListKey, 'data'], null);
  };

  const handleReachBottom = () => {
    const { fetchMoreHearings, hearingLists } = props;
    const list = getHearingListName();

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

  const {
    intl: { formatMessage },
    language,
  } = props;
  const labelsInQuery = Array.isArray(parseQuery(location.search).label)
    ? parseQuery(location.search).label
    : [parseQuery(location.search).label];
  const selectedLabels = labels
    .filter((label) => includes(labelsInQuery, label.id.toString()))
    .map((label) => getAttr(label.label, language));
  const searchTitle = parseQuery(location.search).search;
  const hearings = getHearings();

  const hearingCount = getHearingsCount();

  if (user && user.isFetching) {
    return <LoadSpinner />;
  }

  return (
    <div className='hearings'>
      <section className='page-section page-section--all-hearings-header'>
        <div className='container'>
          <Row>
            <Col md={10} mdPush={1}>
              <Helmet
                title={formatMessage({ id: 'allHearings' })}
                meta={[
                  { name: 'description', content: formatMessage({ id: 'descriptionTag' }) },
                  { property: 'og:description', content: formatMessage({ id: 'descriptionTag' }) },
                ]}
              />
              <FormattedMessage id='allHearings'>{(txt) => <h1 className='page-title'>{txt}</h1>}</FormattedMessage>
              {isAdmin(user) && (
                <AdminFilterSelector
                  onSelect={handleAdminFilter}
                  options={AdminFilters}
                  active={getHearingListName()}
                />
              )}
              {isAdmin(user) && <CreateHearingButton to={{ path: '/hearing/new' }} />}
            </Col>
          </Row>
        </div>
      </section>
      {!isEmpty(labels) ? (
        <WrappedHearingList
          hearings={hearings}
          hearingCount={hearingCount}
          selectedLabels={selectedLabels ? [].concat(selectedLabels) : []}
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
          intl={props.intl}
          handleReachBottom={handleReachBottom}
          onTabChange={(value) => {
            const url = `/hearings/${value}`;
            navigate({
              pathname: url,
              search: location.search,
            });
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
      isFetching: PropTypes.boolean,
      data: PropTypes.arrayOf(hearingShape),
    }),
  ),
  labels: PropTypes.arrayOf(labelShape),
  language: PropTypes.string,
  // location: PropTypes.shape({
  //   search: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
  // }),
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
  fetchAllHearings: (list, params) => dispatch(Actions.fetchHearingList(list, '/v1/hearing', params)),
  fetchMoreHearings: (listName) => dispatch(Actions.fetchMoreHearings(listName)),
  fetchLabels: () => dispatch(Actions.fetchLabels()),
});

export const UnconnectedHearings = Hearings;

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(Hearings));
