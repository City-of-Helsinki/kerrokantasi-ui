import Helmet from 'react-helmet';
import React from 'react';
import {connect} from 'react-redux';
import {injectIntl, intlShape, FormattedMessage} from 'react-intl';
import {push} from 'redux-router';
import queryString from 'query-string';

import Button from 'react-bootstrap/lib/Button';
import Col from 'react-bootstrap/lib/Col';
import Row from 'react-bootstrap/lib/Row';
import {Tab, Tabs} from 'react-bootstrap';
import {get} from 'lodash';

import HearingList from '../../components/HearingList';
import Icon from '../../utils/Icon';
import {fetchHearingList, fetchLabels} from '../../actions';
import {labelShape} from '../../types';
import getAttr from '../../utils/getAttr';

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

const DEFAULT_ACTIVE_TAB = 0;

// TODO: Refactor this and AllHearings because they have so much in common...
class AdminHearings extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      sortBy: '-created_at'
    };

    this.handleAdminTabChange = this.handleAdminTabChange.bind(this);
    this.handleChangeFilter = this.handleChangeFilter.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleSort = this.handleSort.bind(this);

    this.activeAdminTab = DEFAULT_ACTIVE_TAB;
  }

  static fetchData(dispatch, {sortBy, searchTitle = undefined, labels = undefined}) {
    const searchParams = {
      title: searchTitle,
      ordering: sortBy,
      include: 'geojson',
      label: labels
    };

    return Promise.all(
      ADMIN_HEARING_LISTS.map((list) => {
        const params = Object.assign({}, list.params, searchParams);

        return dispatch(fetchHearingList(list.list, '/v1/hearing', params));
      })
    );
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

  componentDidMount() {
    const {dispatch} = this.props;
    dispatch(fetchLabels());
    // AdminHearings.fetchData(dispatch, {sortBy});
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

      AdminHearings.fetchData(dispatch, {sortBy, searchTitle: undefined, labels: selectedLabels.toString()});
    }
  }

  toHearingCreator() {
    this.props.dispatch(push("/hearing/new"));
  }

  handleChangeFilter(filter) {
    this.setState({hearingFilter: filter});
  }

  handleSearch(event, searchTitle, labels) {
    const {dispatch} = this.props;
    const {sortBy} = this.state;
    const labelIds = labels ? labels.map((label) => label.id).toString() : null;

    if (event) {
      event.preventDefault();
    }

    AdminHearings.fetchData(dispatch, {sortBy, labels: labelIds, searchTitle});
    AdminHearings.updateQueryStringOnSearch(searchTitle, labels, labelIds);
  }

  handleSort(newOrder) {
    const {dispatch} = this.props;
    const searchTitle = this.props.params.search;
    const labels = this.props.params.label;
    const labelIds = labels ? labels.map((label) => label.id) : undefined;

    this.setState(
      () => ({ sortBy: newOrder }),
      () => AdminHearings.fetchData(dispatch, {
        sortBy: newOrder,
        searchTitle,
        label: labelIds
      })
    );
  }

  handleAdminTabChange(index) {
    this.activeAdminTab = index;
  }

  render() {
    const {formatMessage} = this.props.intl;
    const {hearingLists, language, labels} = this.props;
    const searchPhrase = this.props.params.search ? this.props.params.search : '';

    return (<div className="container">
      <Helmet title={formatMessage({id: 'allHearings'})}/>

      <div className="pull-right">
        <Button bsStyle="primary" onClick={() => this.toHearingCreator()}>
          <Icon name="add"/> <FormattedMessage id="createHearing"/>
        </Button>
      </div>

      {/* switching tabs doesn't seem to work if animation isn't disabled */}
      <Tabs defaultActiveKey={0} id="hearing-tabs" animation={false} onSelect={this.handleAdminTabChange}>
        {
          ADMIN_HEARING_LISTS.map((list, index) =>
            <Tab key={list.list} eventKey={index} title={formatMessage({id: list.formattedMessage})}>
              <Row>
                <Col md={8}>
                  <HearingList
                    hearings={get(hearingLists, `[${list.list}].data`)}
                    isLoading={get(hearingLists, `[${list.list}].isFetching`)}
                    language={language}
                    labels={labels}
                    handleChangeFilter={this.handleChangeFilter}
                    handleSort={this.handleSort}
                    handleSearch={this.handleSearch}
                    searchPhrase={searchPhrase}
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
  labels: React.PropTypes.arrayOf(labelShape),
  params: React.PropTypes.object
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
