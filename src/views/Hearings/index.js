import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {injectIntl, intlShape, FormattedMessage} from 'react-intl';
import Helmet from 'react-helmet';
import {
  Col,
  Row,
} from 'react-bootstrap';
import {get, find} from 'lodash';
import queryString from 'query-string';

import * as Actions from '../../actions';
import {isAdmin} from '../../utils/user';
import HearingList from '../../components/HearingList';
import CreateHearingButton from '../../components/Hearings/CreateHearingButton';
import AdminFilterSelector from '../../components/Hearings/AdminFilterSelector';
import {hearingShape, labelShape, userShape} from '../../types';
import getAttr from '../../utils/getAttr';

const now = () => new Date().toISOString();

const HearingLists = {
  ALL: {
    list: 'allHearings',
    params: {},
    formattedMessage: 'allHearings'
  },
  OPEN: {
    list: 'openHearings',
    params: {},
    formattedMessage: 'openHearings'
  },
  PUBLISHED: {
    list: 'publishedHearings',
    params: { published: 'True' },
    formattedMessage: 'publishedHearings'
  },
  QUEUE: {
    list: 'publishingQueueHearings',
    params: {published: 'True' },
    formattedMessage: 'publishingQueue'
  },
  DRAFTS: {
    list: 'draftHearings',
    params: { published: 'False' },
    formattedMessage: 'drafts'
  },
};

const AdminFilters = [
  HearingLists.PUBLISHED,
  HearingLists.QUEUE,
  HearingLists.DRAFTS,
];

const getHearingListParams = (listName) => {
  const defaultParams = { include: 'geojson' };
  const hearingList = find(HearingLists, ({list}) => list === listName);
  const hearingListParams = get(hearingList, 'params', {});

  const params = Object.assign(
    {},
    defaultParams,
    hearingListParams
  );

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

class Hearings extends React.Component {

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

  constructor(props) {
    super(props);

    this.state = {
      sortBy: '-created_at',
      adminFilter: isAdmin(props.user) ? AdminFilters[0] : null,
    };

    this.handleSearch = this.handleSearch.bind(this);
    this.handleSelectLabels = this.handleSelectLabels.bind(this);
    this.setAdminFilter = this.setAdminFilter.bind(this);
  }

  componentDidMount() {
    const {fetchLabels} = this.props;
    fetchLabels();
    // Hearing List is fetched when labels are available -> componentWillReceiveProps
  }

  componentWillReceiveProps(nextProps) {
    const {user, labels} = this.props;
    const shouldSetAdminFilter = !user.data && isAdmin(nextProps.user.data);
    const shouldNullAdminFilter = isAdmin(user.data) && !nextProps.user.data;
    const shouldFetchHearings = !labels.length && nextProps.labels.length;

    if (shouldSetAdminFilter) {
      this.setAdminFilter(AdminFilters[0].list);
    }

    if (shouldNullAdminFilter) {
      this.setAdminFilter(null);
    }

    if (shouldFetchHearings) {
      this.fetchHearingList(this.getSearchParams());
    }
  }


  getHearings() {
    const {hearingLists} = this.props;
    const hearingListKey = this.getHearingListName();
    return get(hearingLists, [hearingListKey, 'data'], null);
  }

  getHearingListName() {
    const {user} = this.props;
    const {adminFilter} = this.state;

    return isAdmin(user.data) ? adminFilter : HearingLists.ALL.list;
  }

  getIsLoading() {
    const {hearingLists} = this.props;

    return get(hearingLists, [this.getHearingListName(), 'isFetching'], true);
  }

  getSearchParams() {
    const {labels, location: {query: {search, label: selectedLabels}}} = this.props;
    const selectedLabelsArr = [].concat(selectedLabels);

    return ({
      title: search || '',
      label: labels.filter(({label}) => selectedLabelsArr.includes(label))
    });
  }

  setAdminFilter(filter) {
    this.setState(
      () => ({adminFilter: filter}),
      () => this.fetchHearingList(this.getSearchParams())
    );
  }

  fetchHearingList(options) {
    const {fetchHearingList} = this.props;
    const {sortBy} = this.state;
    const list = this.getHearingListName();

    const params = Object.assign(
      {},
      options,
      getHearingListParams(list),
      { ordering: sortBy },
    );

    fetchHearingList(list, params);
  }

  handleSearch(searchTitle) {
    const {history, location: {query}, labels, language} = this.props;
    const labelNames = query.label || [];
    const selectedLabels = labels.filter((label) => labelNames.includes(getAttr(label.label, language)));

    const labelIds = selectedLabels.length ? selectedLabels.map((label) => label.id).toString() : undefined;

    this.fetchHearingList({
      title: searchTitle,
      label: labelIds,
    });
    // Hearings.updateQueryStringOnSearch(searchTitle, labels, labelIds);
    history.pushState(null, window.location.pathname, {
      ...query,
      search: searchTitle !== '' ? searchTitle : undefined,
    });
  }

  handleSelectLabels(labels) {
    const {history, location: {query}} = this.props;
    const labelIds = labels ? labels.map((label) => label.id).toString() : undefined;

    this.fetchHearingList({
      title: query.search,
      label: labelIds,
    });

    history.pushState(null, window.location.pathname, {
      ...query,
      label: labels.map(({label}) => label),
    });
  }

  render() {
    const {
      intl: {formatMessage},
      labels,
      language,
      params: {tab},
      location: {query: {search: searchTitle, label: selectedLabels}},
      user,
    } = this.props;
    const hearings = this.getHearings();

    const createHearingButton = isAdmin(user.data) ? <CreateHearingButton onClick={() => console.log('todo create hearing button')}/> : null;
    const adminFilterSelector = isAdmin(user.data) ?
      (<AdminFilterSelector
        onSelect={this.setAdminFilter}
        options={AdminFilters}
        valueKey="list"
        active={this.getHearingListName()}
      />) : null;

    if (user.isFetching) {
      return <h3>Such user is being waited</h3>; // TODO
    }

    return (
      <div className="hearings container">
        <Helmet title={formatMessage({id: 'allHearings'})}/>
        <h1 className="page-title"><FormattedMessage id="allHearings"/></h1>

        {createHearingButton}

        <Row>
          <Col md={8}>
            {adminFilterSelector}
            <HearingList
              hearings={hearings}
              selectedLabels={selectedLabels ? [].concat(selectedLabels) : []}
              searchPhrase={searchTitle}
              isLoading={this.getIsLoading()}
              labels={labels}
              showOnlyOpen={false /* TODO */}
              handleChangeFilter={() => console.log('todo')}
              handleSort={() => console.log('todo')}
              handleSearch={this.handleSearch}
              handleSelectLabels={this.handleSelectLabels}
              toggleShowOnlyOpen={this.toggleShoOnlyOpen}
              language={language}
              initialTab={tab}
              onTabChange={(value) => {
                const url = `/hearings/${value}`;
                if (history.pushState) {
                  history.pushState({path: url}, '', url);
                } else {
                  window.location.href = url;
                }
              }}
            />
          </Col>
        </Row>
      </div>
    );
  }
}

Hearings.propTypes = {
  fetchHearingList: PropTypes.func,
  fetchLabels: PropTypes.func,
  hearingLists: PropTypes.objectOf(PropTypes.shape({
    isFetching: PropTypes.boolean,
    data: PropTypes.arrayOf(hearingShape)
  })),
  history: PropTypes.shape({
    pushState: PropTypes.func,
  }),
  intl: intlShape.isRequired,
  labels: PropTypes.arrayOf(labelShape),
  language: PropTypes.string,
  location: PropTypes.shape({
    query: PropTypes.shape({
      label: PropTypes.string,
      search: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.arrayOf(PropTypes.string),
      ]),
    }),
  }),
  params: PropTypes.shape({
    tab: PropTypes.string,
  }),
  user: PropTypes.shape({
    data: userShape,
    isFetching: PropTypes.boolean
  }),
};

const mapStateToProps = (state) => ({
  hearingLists: state.hearingLists,
  labels: state.labels.data,
  user: state.user,
});

const mapDispatchToProps = (dispatch) => ({
  fetchHearingList: (listName, params) => dispatch(Actions.fetchHearingList(listName, '/v1/hearing/', params)),
  fetchLabels: () => dispatch(Actions.fetchLabels())
});

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(Hearings));
