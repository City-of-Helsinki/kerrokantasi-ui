import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';
import { connect } from 'react-redux';
import { Button } from 'hds-react';
import { Helmet } from 'react-helmet-async';

import getUser from '../../selectors/user';
import { getUserHearingList } from '../../selectors/hearing';
import { fetchHearingList as fetchHearingListAction } from '../../actions/index';
import HearingCard from '../../components/HearingCard';
import LoadSpinner from '../../components/LoadSpinner';
import Icon from '../../utils/Icon';
import Toolbar from '../../components/UserHearings/Toolbar';

export const GET_HEARINGS = {
  DRAFT: 'userHearingsDrafts',
  QUEUE: 'userHearingsQueue',
  OPEN: 'userHearingsOpen',
  CLOSED: 'userHearingsClosed',
};
const now = () => new Date().toISOString();
export const SEARCH_PARAMS = {
  OPEN: { published: 'true', open: 'true', limit: 4, open_at_lte: now() },
  QUEUE: { published: 'true', limit: 4, open_at_gt: now() },
  CLOSED: { published: 'true', open: 'false', limit: 4, open_at_lte: now() },
  DRAFT: { published: 'false', limit: 4 },
};

function UserHearings({
  user,
  userState,
  fetching,
  fetchHearingList,
  hearingData,
  hearingCount,
}) {
  const intl = useIntl();
  const [loadOwn, setLoadOwn] = useState(true);
  const [openTools, setOpenTools] = useState(false);
  const [sortHearingsBy, setSortHearingsBy] = useState('-created_at');

  const getDefaultParams = () => {
    const hearingCreator = loadOwn ? 'me' : user.adminOrganizations[0];
    return { created_by: hearingCreator, ordering: sortHearingsBy };
  };

  const fetchHearing = (listID, params) => {
    fetchHearingList(listID, '/v1/hearing/', params);
  };

  const fetchAllHearings = () => {
    const params = getDefaultParams();
    fetchHearing(GET_HEARINGS.DRAFT, { ...SEARCH_PARAMS.DRAFT, ...params });
    fetchHearing(GET_HEARINGS.QUEUE, { ...SEARCH_PARAMS.QUEUE, ...params });
    fetchHearing(GET_HEARINGS.OPEN, { ...SEARCH_PARAMS.OPEN, ...params });
    fetchHearing(GET_HEARINGS.CLOSED, { ...SEARCH_PARAMS.CLOSED, ...params });
  };

  // Mirrors componentDidMount (first run) + componentDidUpdate's user-transition check (subsequent runs).
  const didMountRef = useRef(false);
  const prevUserRef = useRef(null);
  useEffect(() => {
    if (!didMountRef.current) {
      didMountRef.current = true;
      if (userState.userExists && user && user.adminOrganizations[0]) {
        fetchAllHearings();
      }
    } else {
      const prevUser = prevUserRef.current;
      if (!prevUser && user && user.adminOrganizations[0]) {
        fetchAllHearings();
      }
    }
    prevUserRef.current = user;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // Mirrors componentDidUpdate's loadOwn/sortHearingsBy change check; skip initial render.
  const isMountedForSortRef = useRef(false);
  useEffect(() => {
    if (!isMountedForSortRef.current) {
      isMountedForSortRef.current = true;
      return;
    }
    fetchAllHearings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadOwn, sortHearingsBy]);

  const getRemainingHearings = (hearingType) => {
    const params = getDefaultParams();
    const type = hearingType.toUpperCase();
    const typeParamsWithoutLimit = Object.fromEntries(
      Object.keys(SEARCH_PARAMS[type])
        .filter((k) => k !== 'limit')
        .map((k) => [k, SEARCH_PARAMS[type][k]])
    );
    fetchHearing(GET_HEARINGS[type], { ...typeParamsWithoutLimit, ...params });
  };

  const getHearingCards = (hearings) => {
    const { locale } = intl;
    return hearings.reduce((accumulator, currentValue) => {
      accumulator.push(
        <div className='user-hearing col-sm-4 col-md-3' key={currentValue.slug}>
          <HearingCard hearing={currentValue} language={locale} intl={intl} />
        </div>
      );
      return accumulator;
    }, []);
  };

  const getHearingHeader = (type) => (
    <FormattedMessage id={`${type}Count`} values={{ n: hearingCount[type] }}>
      {(txt) => <h2>{txt}</h2>}
    </FormattedMessage>
  );

  const getHearingListing = (type) => {
    if (fetching[type]) {
      return <LoadSpinner />;
    }
    const elements = getHearingCards(hearingData[type]);
    if (elements.length === 0) {
      return (
        <div>
          <div className='loader-wrap'>
            <Icon name='search' size='2x' aria-hidden />
            <FormattedMessage id='noHearings'>
              {(txt) => <p>{txt}</p>}
            </FormattedMessage>
          </div>
        </div>
      );
    }
    return (
      <div>
        <div data-testid='hearing-cards' className='row card-list'>
          {elements}
        </div>
        {elements.length === 4 && hearingCount[type] > 4 && (
          <Button onClick={() => getRemainingHearings(type)}>
            <FormattedMessage id='showAll' values={{ n: hearingCount[type] }}>
              {(txt) => txt}
            </FormattedMessage>
          </Button>
        )}
      </div>
    );
  };

  const { formatMessage } = intl;
  const activeTitle = loadOwn ? 'ownHearings' : 'organizationHearings';
  const helmetTitle = <Helmet title={formatMessage({ id: activeTitle })} />;

  if (
    userState.userLoading ||
    !userState.userExists ||
    !user ||
    !user.adminOrganizations ||
    user.adminOrganizations.length === 0
  ) {
    return helmetTitle;
  }

  const hearingListings = Object.keys(GET_HEARINGS).reduce(
    (accumulator, currentValue) => {
      const small = currentValue.toLowerCase();
      accumulator.push(
        <div className='row' key={currentValue}>
          <div className='col-md-12'>{getHearingHeader(small)}</div>
          <div className='col-md-12 user-hearing-list'>
            {getHearingListing(small)}
          </div>
        </div>
      );
      return accumulator;
    },
    []
  );

  return (
    <div className='user-hearings'>
      {helmetTitle}
      <div className='container'>
        <div className='row'>
          <div className='col-md-12 head'>
            <div className='row'>
              <div className='col-md-7'>
                <FormattedMessage id={activeTitle}>
                  {(txt) => <h1>{txt}</h1>}
                </FormattedMessage>
              </div>
              <div className='col-md-5 tool-container'>
                <Toolbar
                  loadOwn={loadOwn}
                  openTools={openTools}
                  formatMessage={formatMessage}
                  toggleDropdown={() => setOpenTools((prev) => !prev)}
                  toggleHearingCreator={() => setLoadOwn((prev) => !prev)}
                  changeSort={(sort) => setSortHearingsBy(sort)}
                />
              </div>
            </div>
          </div>
        </div>
        {hearingListings}
      </div>
    </div>
  );
}

UserHearings.propTypes = {
  user: PropTypes.object,
  userState: PropTypes.shape({
    userExists: PropTypes.bool,
    userLoading: PropTypes.bool,
  }),
  fetching: PropTypes.object,
  fetchHearingList: PropTypes.func,
  hearingData: PropTypes.object,
  hearingCount: PropTypes.object,
};

export { UserHearings as UnconnectedUserHearings };

const existsSelector = (state) => ({
  userExists: !state.oidc.isLoading && state.oidc.user !== null,
  userLoading: state.oidc.isLoading,
});

const mapDispatchToProps = (dispatch) => ({
  fetchHearingList: (list, endpoint, param) =>
    dispatch(fetchHearingListAction(list, endpoint, param)),
});

const mapStateToProps = (state) => ({
  user: getUser(state),
  userState: existsSelector(state),
  fetching: getUserHearingList(state, 'isFetching'),
  hearingCount: getUserHearingList(state, 'count'),
  hearingData: getUserHearingList(state, 'data'),
});

export default connect(mapStateToProps, mapDispatchToProps)(UserHearings);
