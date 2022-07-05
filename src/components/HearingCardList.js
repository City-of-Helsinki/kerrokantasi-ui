import React from 'react';
import PropTypes from 'prop-types';
import {Row, Col} from 'react-bootstrap';
import HearingCard from './HearingCard';
import {hearingShape} from '../types';
import getAttr from '../utils/getAttr';

/**
 * Returns an array of HearingCard components based on hearings.
 * @param {object} props
 * @param {object[]} props.hearings - array consisting of hearing objects.
 * @param {string} props.language - currently used language.
 * @param {object} props.intl
 * @param {string} [props.className] - string that's appended to the hearing cards className.
 * @param {boolean} [props.showCommentCount] - determines if the comment count is displayed on the HearingCards.
 * @param {boolean} [props.userProfile] - determines Col md size of the HearingCards when used on the profile page.
 * @param {function} props.unFavoriteAction - function that removes the hearing from user's favorites, passed to cards.
 * @returns {JSX.Element}
 * @constructor
 */
const HearingCardList = ({
  hearings,
  language,
  intl,
  className = '',
  showCommentCount = true,
  userProfile = false,
  unFavoriteAction
}) =>
  <Row className="hearing-card-list">
    {hearings && hearings.map((hearing) => {
      // Hearings with long titles have larger HearingCards on the profile page.
      const mdSize = userProfile && getAttr(hearing.title, intl.locale, false).length > 140 ? 6 : 3;
      return (
        <Col xs={12} md={mdSize} key={hearing.id}>
          <HearingCard
            className={className}
            hearing={hearing}
            intl={intl}
            language={language}
            showCommentCount={showCommentCount}
            unFavoriteAction={unFavoriteAction}
            userProfile={userProfile}
          />
        </Col>
      );
    }
    )}
  </Row>;

HearingCardList.propTypes = {
  className: PropTypes.string,
  hearings: PropTypes.arrayOf(hearingShape),
  intl: PropTypes.object,
  language: PropTypes.string,
  showCommentCount: PropTypes.bool,
  unFavoriteAction: PropTypes.func,
  userProfile: PropTypes.bool,
};

export default HearingCardList;
