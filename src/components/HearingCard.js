import React, {PropTypes} from 'react';
import {FormattedMessage} from 'react-intl';
import {Link} from 'react-router';
import formatRelativeTime from '../utils/formatRelativeTime';
import Icon from '../utils/Icon';
import LabelList from './LabelList';
import getAttr from '../utils/getAttr';
import {getHearingURL, getHearingMainImageURL} from '../utils/hearing';
import moment from 'moment';

const HearingCard = ({hearing, language, className = ''}) => {
  const backgroundImage = getHearingMainImageURL(hearing);
  const imageStyle = {
    backgroundImage: backgroundImage ? `url(${backgroundImage})` : ''
  };
  // FIXME: Should there be direct linking to hearing using certain language?
  const translationAvailable = !!getAttr(hearing.title, language/* , {exact: true} */);
  const expiresSoon = moment(hearing.close_at).diff(moment(), 'weeks') < 1;
  return (
    <div className={`hearing-card ${className}`}>
      {
        !translationAvailable &&
        <div className="hearing-card-notice">
          <div className="hearing-card-notice-content">
            <FormattedMessage id="hearingTranslationNotAvailable"/>
          </div>
        </div>
      }
      <Link to={getHearingURL(hearing)} className="hearing-card-image" style={imageStyle}>
        <div className="hearing-card-comment-count">
          <Icon name="comment-o"/>&nbsp;{hearing.n_comments}
        </div>
      </Link>
      <div className="hearing-card-content">
        <div className={`hearing-card-time ${expiresSoon ? 'expires' : ''}`}>
          {formatRelativeTime("timeClose", hearing.close_at)}
        </div>
        <h4 className="hearing-card-title">
          <Link to={getHearingURL(hearing)}>
            {getAttr(hearing.title, language)}
          </Link>
        </h4>
        <div className="hearing-card-labels">
          <LabelList labels={hearing.labels}/>
        </div>
      </div>
    </div>
  );
};

HearingCard.propTypes = {
  className: PropTypes.string,
  hearing: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  language: PropTypes.string
};

export default HearingCard;
