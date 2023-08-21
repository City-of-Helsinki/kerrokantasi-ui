/* eslint-disable react/forbid-prop-types */
/* eslint-disable import/no-unresolved */
import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { withRouter } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import defaultImage from '@city-images/default-image.svg';

import FormatRelativeTime from '../utils/FormatRelativeTime';
import Icon from '../utils/Icon';
import LabelList from './LabelList';
import Link from './LinkWithLang';
import MouseOnlyLink from './MouseOnlyLink';
import config from '../config';
import getAttr from '../utils/getAttr';
import { getHearingURL, getHearingMainImageURL } from '../utils/hearing';
import getMessage from '../utils/getMessage';

// eslint-disable-next-line import/no-unresolved

/**
 * Returns a HearingCard with data from the hearing prop.
 * @param {object} props
 * @param {object} props.hearing
 * @param {string} props.language - currently used language.
 * @param {string} [props.className] - optional string that's appended to the main wrapper's className.
 * @param {object} props.history
 * @param {object} props.intl
 * @param {boolean} [props.showCommentCount] - determines if the comment count is displayed.
 * @param {function} props.unFavoriteAction - function that removes the hearing from the users favorites.
 * @param {boolean} [props.userProfile] - should only be true when used on the profile page.
 * @returns {JSX.Element}
 * @constructor
 */
const HearingCard = ({
  hearing,
  language,
  className = '',
  history,
  intl,
  showCommentCount = true,
  unFavoriteAction,
  userProfile = false,
}) => {
  const backgroundImage = getHearingMainImageURL(hearing);
  const cardImageStyle = {
    backgroundImage: backgroundImage ? `url(${backgroundImage})` : `url(${defaultImage})`,
  };

  // FIXME: Should there be direct linking to hearing using certain language?
  const translationAvailable = !!getAttr(hearing.title, language, { exact: true });
  const expiresSoon = moment(hearing.close_at).diff(moment(), 'weeks') < 1;
  const favoriteButtonText = getMessage('removeFavorites', language);
  const commentCount =
    showCommentCount && hearing.n_comments ? (
      <div className='hearing-card-comment-count'>
        <Icon name='comment-o' aria-hidden='true' />
        &nbsp;{hearing.n_comments}
        <span className='sr-only'>
          {hearing.n_comments === 1 ? (
            <FormattedMessage id='hearingCardComment' />
          ) : (
            <FormattedMessage id='hearingCardComments' />
          )}
        </span>
      </div>
    ) : null;

  // For some reason image proportions don't look right on the profile page without a div wrapper.
  const conditionalWrapper = (children) => (userProfile ? <div>{children}</div> : children);
  const mainImgCaption =
    hearing.main_image && hearing.main_image.caption ? getAttr(hearing.main_image.caption, language) : '';

  return (
    <div className={`hearing-card ${className}`}>
      {conditionalWrapper(
        <MouseOnlyLink
          className='hearing-card-image'
          style={cardImageStyle}
          history={history}
          url={getHearingURL(hearing)}
          altText={mainImgCaption || getAttr(hearing.title, language)}
        />,
      )}

      <div className='hearing-card-content'>
        <h3 className='h4 hearing-card-title'>
          <Link to={{ path: getHearingURL(hearing) }}>{getAttr(hearing.title, language)}</Link>
        </h3>
        {commentCount}
        <div className={`hearing-card-time ${expiresSoon ? 'expires' : ''}`}>
          <FormatRelativeTime
            messagePrefix='timeClose'
            timeVal={hearing.close_at}
            formatTime={intl.formatTime}
            formatDate={intl.formatDate}
          />
        </div>
        <div className='hearing-card-labels clearfix'>
          <LabelList className='hearing-list-item-labellist' labels={hearing.labels} language={language} />
        </div>
        {userProfile && (
          <div className='favorite-button-wrapper'>
            <button
              type='button'
              className='favorite-icon'
              onClick={() => unFavoriteAction(hearing.slug, hearing.id)}
              title={favoriteButtonText}
            >
              <Icon name='heart' aria-hidden='true' />
            </button>
          </div>
        )}
        {!translationAvailable && !userProfile && (
          <div className='hearing-card-notice'>
            <Icon name='exclamation-circle' aria-hidden='true' />
            <FormattedMessage id='hearingTranslationNotAvailable' />
            {config.languages.map((lang) =>
              getAttr(hearing.title, lang, { exact: true }) ? (
                <div className='language-available-message' key={lang} lang={lang}>
                  <FormattedMessage id={`hearingAvailable-${lang}`}>{(txt) => txt}</FormattedMessage>
                  &nbsp;
                  <FormattedMessage id={`hearingAvailableInLang-${lang}`}>{(txt) => txt}</FormattedMessage>
                </div>
              ) : null,
            )}
          </div>
        )}
      </div>
    </div>
  );
};

HearingCard.propTypes = {
  className: PropTypes.string,
  hearing: PropTypes.object,
  history: PropTypes.object,
  intl: PropTypes.object,
  language: PropTypes.string,
  showCommentCount: PropTypes.bool,
  unFavoriteAction: PropTypes.func,
  userProfile: PropTypes.bool,
};

export default withRouter(HearingCard);
