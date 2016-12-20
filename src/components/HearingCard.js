import React, {PropTypes} from 'react';
import {FormattedMessage} from 'react-intl';
import {Link} from 'react-router';
import formatRelativeTime from '../utils/formatRelativeTime';
import Icon from '../utils/Icon';
import LabelList from './LabelList';
import getAttr from '../utils/getAttr';
import {getHearingURL} from '../utils/hearing';

const HearingCard = ({hearing, language}) => {
  const imageStyle = {
    backgroundImage: hearing.main_image && hearing.main_image.url ? `url(${hearing.main_image.url})` : ''
  };
  // FIXME: Should there be direct linking to hearing using certain language?
  const translationAvailable = !!getAttr(hearing.title, language/* , {exact: true} */);

  return (
    <div className="hearing-card">
      {
        !translationAvailable &&
        <div className="hearing-card-notice">
          <div className="hearing-card-notice-content">
            <FormattedMessage id="hearingTranslationNotAvailable"/>
          </div>
        </div>
      }
      <div className="hearing-card-image" style={imageStyle}>
        <div className="hearing-card-comment-count">
          <Icon name="comment-o"/>&nbsp;{hearing.n_comments}
        </div>
      </div>
      <div className="hearing-card-content">
        <div className="hearing-card-time">
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
  hearing: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  language: PropTypes.string
};

export default HearingCard;
