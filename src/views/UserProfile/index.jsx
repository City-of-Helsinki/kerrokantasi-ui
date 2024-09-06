/* eslint-disable react/forbid-prop-types */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { injectIntl, FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { Select } from 'hds-react';

import getUser from '../../selectors/user';
import { fetchFavoriteHearings, fetchUserComments, removeHearingFromFavorites } from '../../actions/index';
import HearingCardList from '../../components/HearingCardList';
import UserComment from '../../components/UserComment/UserComment';
import getAttr from '../../utils/getAttr';
import getMessage from '../../utils/getMessage';
import Icon from '../../utils/Icon';
import LoadSpinner from '../../components/LoadSpinner';

// Default params when fetching favorite/followed hearings.
const PARAMS = { following: true };

const UserProfile = ({ profile, userState, user, fetchComments, fetchFavorites, removeFromFavorites, intl }) => {
  const { comments, favoriteHearings } = profile;
  const { userExists, userLoading } = userState;
  const { locale } = intl;

  const [selectedHearing, setSelectedHearing] = useState('');
  const [commentCount, setCommentCount] = useState(profile.comments.count || 0);

  useEffect(() => {
    if (!userLoading && userExists && user) {
      fetchComments();
      fetchFavorites(PARAMS);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, userExists, userLoading]);

  useEffect(() => {
    if (profile.comments.count) {
      setCommentCount(profile.comments.count);
    }
  }, [profile.comments.count]);

  if (userLoading || !user) {
    return <LoadSpinner />;
  }

  /**
   * Selects a hearing and updates the comment count.
   *
   * @param {string} id - The selected hearing id
   * @returns {void}
   */
  const selectHearing = (id) => {
    const { count } = comments;
    let newCount = count;

    if (id) {
      newCount = comments.uniqueHearings.find((hearing) => hearing.id === id).commentCount;
    }

    setSelectedHearing(id);
    setCommentCount(newCount);
  };

  /**
   * Returns a list of hearing cards for the user's favorite hearings.
   *
   * @returns {JSX.Element} The list of hearing cards.
   */
  const getHearingCards = () => (
    <HearingCardList
      className='user-favorite'
      hearings={favoriteHearings.results}
      intl={intl}
      language={locale}
      showCommentCount={false}
      unFavoriteAction={removeFromFavorites}
      userProfile
    />
  );

  /**
   * Returns a JSX element representing the comment order select component.
   *
   * @returns {JSX.Element} The comment order select component.
   */
  const getCommentOrderSelect = () => {
    const ORDERING_CRITERIA = {
      CREATED_AT_DESC: '-created_at',
      CREATED_AT_ASC: 'created_at',
    };

    const options = Object.keys(ORDERING_CRITERIA).map((key) => {
      const message = intl.formatMessage({ id: key });

      return { value: ORDERING_CRITERIA[key], label: message };
    });

    return (
      <div className='col-md-4'>
        <div className='order-wrapper'>
          <Select
            label={<FormattedMessage id='sort'>{(txt) => txt}</FormattedMessage>}
            options={options}
            defaultValue={options[0]}
            onChange={(selected) => fetchComments({ ordering: selected.value })}
          />
        </div>
      </div>
    );
  };

  /**
   * Returns a JSX element for displaying content not found.
   *
   * @param {string} messageID - The ID of the message to be displayed.
   * @returns {JSX.Element} The JSX element for content not found.
   */
  const getContentNotFound = (messageID) => (
    <div className='content-not-found'>
      <Icon name='search' size='2x' aria-hidden />
      <FormattedMessage id={messageID}>{(txt) => <p>{txt}</p>}</FormattedMessage>
    </div>
  );

  /**
   * Renders a select component for hearing comments.
   *
   * @returns {JSX.Element} The rendered selection component.
   */
  const hearingCommentSelect = () => {
    const allText = getMessage('all', locale);

    const uniqueHearings = comments.uniqueHearings.map((hearing) => {
      let textValue = getAttr(hearing.data.title, locale);

      // Option text is limited to 100 chars because the width of the dropdown is based on the widest text.
      if (textValue.length > 100) {
        // Check if text contains any dates like 20.11.2021
        const containsDateAt = textValue.search(/(\d.*)/g);
        // Check if text contains full stops/points in the last 15 chars before the 100th character
        const pointsBetweenRange = [...textValue.matchAll(/[.]/g)].reduce((points, point) => {
          if (point.index > 85 && point.index < 100) {
            points.push(point.index);
          }
          return points;
        }, []);
        // If the text contains a point near the limit and doesnt contain any dates -> slice at point.
        if (pointsBetweenRange.length > 0 && containsDateAt === -1) {
          textValue = textValue.slice(0, pointsBetweenRange[0] + 1);
        }
        // If text length is still over 100 -> use first 96 characters of text + '...'
        if (textValue.length > 100) {
          textValue = `${textValue.slice(0, 96)}...`;
        }
      }

      return { value: hearing.id, label: textValue };
    });

    const options = [{ value: '', label: allText }, ...uniqueHearings];

    return (
      <div className='col-md-8'>
        <div className='selection-wrappers'>
          <Select
            label={<FormattedMessage id='selectHearingComments'>{(txt) => txt}</FormattedMessage>}
            options={options}
            onChange={(selected) => selectHearing(selected.value)}
          />
        </div>
      </div>
    );
  };

  // True when favorites have been fetched and results array has content.
  const hearingsLoaded = Object.keys(favoriteHearings).length > 0 && favoriteHearings.results.length !== 0;
  // True when comments have been fetched and results array has content.
  const commentsLoaded = Object.keys(comments).includes('results') && comments.results.length !== 0;

  return (
    <div className='container user-profile'>
      <Helmet title={intl.formatMessage({ id: 'userInfo' })} />
      <div className='row'>
        <FormattedMessage id='userInfo'>{(txt) => <h1>{txt}</h1>}</FormattedMessage>
        <FormattedMessage id='favoriteHearings'>{(txt) => <h2>{txt}</h2>}</FormattedMessage>
      </div>
      <div className='row'>
        <div className='col-md-12'>{hearingsLoaded ? getHearingCards() : getContentNotFound('noFavoriteHearings')}</div>
      </div>
      <div className='row'>
        <FormattedMessage id='userAddedComments' values={{ n: commentCount }}>
          {(txt) => <h2>{txt}</h2>}
        </FormattedMessage>
        <div className='col-md-12'>
          {commentsLoaded ? (
            <div className='user-comments-wrapper'>
              <div className='row' data-testid='hearing-selects'>
                {hearingCommentSelect()}
                {getCommentOrderSelect()}
              </div>
              <div className='row'>
                <div className='commentlist' data-testid='commentlist'>
                  {comments.results.reduce((visibleComments, comment) => {
                    if (!selectedHearing || selectedHearing === comment.hearing) {
                      visibleComments.push(<UserComment comment={comment} key={comment.id} locale={locale} />);
                    }
                    return visibleComments;
                  }, [])}
                </div>
              </div>
            </div>
          ) : (
            getContentNotFound('noAddedComments')
          )}
        </div>
      </div>
    </div>
  );
};

/**
 * Selects a specific property from the user profile state.
 *
 * @param {Object} state - The user profile state.
 * @param {string} key - The key of the property to select.
 * @returns {any} The selected property value.
 */
const profileSelector = (state, key) => ({
  ...state.user.profile[key],
});

/**
 * Calculates the unique hearings commented by a user.
 *
 * @param {Object} state - The state object containing user profile comments.
 * @returns {Array} - An array of objects representing unique hearings commented by the user.
 */
const uniqueHearingsCommented = (state) => {
  if (!state.user.profile.comments) {
    return [];
  }
  const comments = state.user.profile.comments.results;

  if (comments) {
    // get unique hearing id's
    const uniqueIDs = comments.reduce((uniqueIDTotal, comment) => {
      if (!uniqueIDTotal.includes(comment.hearing)) {
        uniqueIDTotal.push(comment.hearing);
      }
      return uniqueIDTotal;
    }, []);

    // return array with objects for each unique hearing
    return uniqueIDs.reduce((uniqueHearings, uniqueID) => {
      const specificHearing = comments.find((element) => element.hearing === uniqueID);
      const hearingCommentCount = comments.reduce((totalCount, current) => {
        if (current.hearing === uniqueID) {
          return totalCount + 1;
        }
        return totalCount;
      }, 0);
      uniqueHearings.push({
        id: uniqueID,
        data: specificHearing.hearing_data,
        commentCount: hearingCommentCount,
      });
      return uniqueHearings;
    }, []);
  }
  return [];
};

/**
 * Combines the profile data from the state into a single object.
 *
 * @param {Object} state - The application state.
 * @returns {Object} - The combined profile data.
 */
const profileCombiner = (state) => ({
  comments: {
    ...profileSelector(state, 'comments'),
    uniqueHearings: uniqueHearingsCommented(state),
  },
  favoriteHearings: profileSelector(state, 'favoriteHearings'),
});

UserProfile.propTypes = {
  fetchComments: PropTypes.func,
  fetchFavorites: PropTypes.func,
  intl: PropTypes.object,
  profile: PropTypes.object,
  removeFromFavorites: PropTypes.func,
  user: PropTypes.object,
  userState: PropTypes.shape({
    userExists: PropTypes.bool,
    userLoading: PropTypes.bool,
  }),
};

const mapDispatchToProps = (dispatch) => ({
  fetchComments: (params) => dispatch(fetchUserComments(params)),
  fetchFavorites: (params) => dispatch(fetchFavoriteHearings(params)),
  removeFromFavorites: (slug, hearingId) => dispatch(removeHearingFromFavorites(slug, hearingId)),
});

const existsSelector = (state) => ({
  userExists: !state.oidc.isLoadingUser && state.oidc.user !== null,
  userLoading: state.oidc.isLoadingUser,
});

const mapStateToProps = (state) => ({
  user: getUser(state),
  userState: existsSelector(state),
  profile: profileCombiner(state),
});

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(UserProfile));
