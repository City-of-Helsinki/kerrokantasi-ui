/* eslint-disable react/forbid-prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { ControlLabel, FormControl, FormGroup } from 'react-bootstrap';

import { getUser } from '../../selectors/user';
import { fetchFavoriteHearings, fetchUserComments, removeHearingFromFavorites } from '../../actions/index';
import HearingCardList from '../../components/HearingCardList';
import UserComment from '../../components/UserComment/UserComment';
import getAttr from '../../utils/getAttr';
import getMessage from '../../utils/getMessage';
import Icon from '../../utils/Icon';
import LoadSpinner from '../../components/LoadSpinner';

// Default params when fetching favorite/followed hearings.
const PARAMS = { following: true };

class UserProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedHearing: '',
      commentCount: this.props.profile.comments.count || 0,
    };
  }

  componentDidMount() {
    const {
      userState: { userExists },
      user,
    } = this.props;
    if (userExists && user) {
      this.props.fetchComments();
      this.props.fetchFavorites(PARAMS);
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.userState.userLoading && !this.props.userState.userLoading) {
      this.props.fetchComments();
      this.props.fetchFavorites(PARAMS);
    }
    if (!prevProps.user && this.props.user) {
      this.props.fetchComments();
      this.props.fetchFavorites(PARAMS);
    }
    if (prevProps.profile.comments.count !== this.props.profile.comments.count) {
      this.setCommentCount(this.props.profile.comments.count);
    }
    if (prevProps.user && prevProps.user.favorite_hearings !== this.props.user.favorite_hearings) {
      this.props.fetchFavorites(PARAMS);
    }
  }

  /**
   * Sets state.selectedHearing according to value and updates state.commentCount if needed.
   * @param {string} value - hearing id or empty string when 'all' hearings.
   */
  setSelectedHearing = (value) => {
    const {
      profile: { comments },
    } = this.props;
    let { count } = comments;
    if (value) {
      count = comments.uniqueHearings.find((hearing) => hearing.id === value).commentCount;
    }
    this.setState({ selectedHearing: value, commentCount: count });
  };

  /**
   * Updates state.commentCount with value.
   * @param {number} value
   */
  setCommentCount = (value) => {
    this.setState({ commentCount: value });
  };

  /**
   * Returns comments according to state.selectedHearing,
   * comments made in a specific hearing or all comments if !selectedHearing.
   * @returns {JSX.Element|*[]}
   */
  getUserComments() {
    const {
      profile: { comments },
      intl: { locale },
    } = this.props;
    const { selectedHearing } = this.state;

    return (
      <div className='row'>
        <div className='commentlist'>
          {comments.results.reduce((visibleComments, comment) => {
            if (!selectedHearing || selectedHearing === comment.hearing) {
              visibleComments.push(<UserComment comment={comment} key={comment.id} locale={locale} />);
            }
            return visibleComments;
          }, [])}
        </div>
      </div>
    );
  }

  /**
   * Calls HearingCardList which returns a HearingCard for each favorite hearing.
   * @returns {JSX.Element|*[]}
   */
  getHearingCards() {
    const {
      intl,
      profile: { favoriteHearings },
    } = this.props;

    return (
      <HearingCardList
        className='user-favorite'
        hearings={favoriteHearings.results}
        intl={intl}
        language={intl.locale}
        showCommentCount={false}
        unFavoriteAction={this.props.removeFromFavorites}
        userProfile
      />
    );
  }

  /**
   * Returns comment order selection component.
   * @returns {JSX.Element}
   */
  getCommentOrderSelect() {
    const ORDERING_CRITERIA = {
      CREATED_AT_DESC: '-created_at',
      CREATED_AT_ASC: 'created_at',
    };
    return (
      <div className='col-md-4'>
        <div className='order-wrapper'>
          <FormGroup controlId='sort-select'>
            <ControlLabel>
              <FormattedMessage id='sort'>{(txt) => txt}</FormattedMessage>
            </ControlLabel>
            <FormControl
              componentClass='select'
              onChange={(event) => this.props.fetchComments({ ordering: event.target.value })}
            >
              {Object.keys(ORDERING_CRITERIA).map((key) => (
                <FormattedMessage id={key} key={key}>
                  {(message) => <option value={ORDERING_CRITERIA[key]}>{message}</option>}
                </FormattedMessage>
              ))}
            </FormControl>
          </FormGroup>
        </div>
      </div>
    );
  }

  /**
   * Used to display an icon and text informing user that certain content was not found.
   * @param {string} messageID - passed to FormattedMessage
   * @returns {JSX.Element}
   */
  // eslint-disable-next-line class-methods-use-this
  getContentNotFound(messageID) {
    return (
      <div className='content-not-found'>
        <Icon name='search' size='2x' aria-hidden />
        <FormattedMessage id={messageID}>{(txt) => <p>{txt}</p>}</FormattedMessage>
      </div>
    );
  }

  /**
   * Returns the hearing selection component with options based on profile.comments.uniqueHearings array.
   * @returns {JSX.Element}
   */
  hearingCommentSelect() {
    const {
      profile: {
        comments: { uniqueHearings },
      },
      intl: { locale },
    } = this.props;
    const allText = getMessage('all', locale);

    return (
      <div className='col-md-8'>
        <div className='selection-wrappers'>
          <FormGroup controlId='hearing-select'>
            <ControlLabel>
              <FormattedMessage id='selectHearingComments'>{(txt) => txt}</FormattedMessage>
            </ControlLabel>

            <FormControl
              componentClass='select'
              onChange={(event) => {
                this.setSelectedHearing(event.target.value);
              }}
            >
              <option value=''>{allText}</option>
              {uniqueHearings.reduce((hearingOptions, hearing) => {
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
                hearingOptions.push(
                  <option key={hearing.id} value={hearing.id}>
                    {textValue}
                  </option>,
                );
                return hearingOptions;
              }, [])}
            </FormControl>
          </FormGroup>
        </div>
      </div>
    );
  }

  render() {
    const {
      userState: { userLoading },
      user,
      intl,
      profile: { favoriteHearings, comments },
    } = this.props;

    if (userLoading || !user) {
      return <LoadSpinner />;
    }
    const { commentCount } = this.state;
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
          <div className='col-md-12'>
            {hearingsLoaded ? this.getHearingCards() : this.getContentNotFound('noFavoriteHearings')}
          </div>
        </div>
        <div className='row'>
          <FormattedMessage id='userAddedComments' values={{ n: commentCount }}>
            {(txt) => <h2>{txt}</h2>}
          </FormattedMessage>
          <div className='col-md-12'>
            {commentsLoaded ? (
              <div className='user-comments-wrapper'>
                <div className='row'>
                  {this.hearingCommentSelect()}
                  {this.getCommentOrderSelect()}
                </div>
                {this.getUserComments()}
              </div>
            ) : (
              this.getContentNotFound('noAddedComments')
            )}
          </div>
        </div>
      </div>
    );
  }
}

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

const existsSelector = (state) => ({
  userExists: !state.oidc.isLoadingUser && state.oidc.user !== null,
  userLoading: state.oidc.isLoadingUser,
});

/**
 * Returns array with objects for each unique hearing that
 * the user has commented on.
 * @param state
 * @returns {*[]|*}
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
 * Returns object properties at state.user.profile[key]
 * @param {object} state
 * @param {string} key
 * @returns {*}
 */
const profileSelector = (state, key) => ({
  ...state.user.profile[key],
});

const profileCombiner = (state) => ({
  comments: {
    ...profileSelector(state, 'comments'),
    uniqueHearings: uniqueHearingsCommented(state),
  },
  favoriteHearings: profileSelector(state, 'favoriteHearings'),
});

const mapDispatchToProps = (dispatch) => ({
  fetchComments: (params) => dispatch(fetchUserComments(params)),
  fetchFavorites: (params) => dispatch(fetchFavoriteHearings(params)),
  removeFromFavorites: (slug, hearingId) => dispatch(removeHearingFromFavorites(slug, hearingId)),
});

const mapStateToProps = (state) => ({
  user: getUser(state),
  userState: existsSelector(state),
  profile: profileCombiner(state),
});

export { UserProfile as UnconnectedUserProfile };

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(UserProfile));
