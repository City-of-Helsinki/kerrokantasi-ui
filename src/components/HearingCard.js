import React from 'react';
import PropTypes from 'prop-types';
import {FormattedMessage} from 'react-intl';
import Link from './LinkWithLang';
import FormatRelativeTime from '../utils/FormatRelativeTime';
import Icon from '../utils/Icon';
import LabelList from './LabelList';
import getAttr from '../utils/getAttr';
import {getHearingURL, getHearingMainImageURL} from '../utils/hearing';
import moment from 'moment';
import config from '../config';

// eslint-disable-next-line import/no-unresolved
import defaultImage from '@city-images/default-image.svg';

const HearingCard = ({hearing, language, className = ''}) => {
  const backgroundImage = getHearingMainImageURL(hearing);
  const cardImageStyle = {
    backgroundImage: backgroundImage ? `url(${backgroundImage})` : `url(${defaultImage})`,
  };

  // FIXME: Should there be direct linking to hearing using certain language?
  const translationAvailable = !!getAttr(hearing.title, language, {exact: true});
  const expiresSoon = moment(hearing.close_at).diff(moment(), 'weeks') < 1;
  const availableInLanguageMessages = {
    fi: 'Kuuleminen saatavilla suomeksi',
    sv: 'Hörandet tillgängligt på svenska',
    en: 'Questionnaire available in English',
  };
  const commentCount = hearing.n_comments ? (
    <div className="hearing-card-comment-count">
      <Icon name="comment-o" aria-hidden="true" />&nbsp;{hearing.n_comments}
      <span className="sr-only">
        {hearing.n_comments === 1 ? (
          <FormattedMessage id="hearingCardComment" />
        ) : <FormattedMessage id="hearingCardComments" />}
      </span>
    </div>
  ) : null;
  return (
    <div className={`hearing-card ${className}`}>
      <Link to={{path: getHearingURL(hearing)}}>
        <div className="hearing-card-image" style={cardImageStyle} aria-labelledby={hearing.id} />
      </Link>
      <div className="hearing-card-content">
        <h3 className="h4 hearing-card-title" id={hearing.id}>
          <Link to={{path: getHearingURL(hearing)}}>{getAttr(hearing.title, language)}</Link>
        </h3>
        {commentCount}
        <div className={`hearing-card-time ${expiresSoon ? 'expires' : ''}`}>
          <FormatRelativeTime messagePrefix="timeClose" timeVal={hearing.close_at} />
        </div>
        <div className="hearing-card-labels clearfix">
          <LabelList className="hearing-list-item-labellist" labels={hearing.labels} language={language} />
        </div>
        {!translationAvailable && (
          <div className="hearing-card-notice">
            <Icon name="exclamation-circle" aria-hidden="true" />
            <FormattedMessage id="hearingTranslationNotAvailable" />
            {config.languages.map(
              lang =>
                (getAttr(hearing.title, lang, { exact: true }) ? (
                  <div className="language-available-message" key={lang}>{availableInLanguageMessages[lang]}</div>
                ) : null)
            )}
          </div>
        )}
      </div>
    </div>
  );
};

HearingCard.propTypes = {
  className: PropTypes.string,
  hearing: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  language: PropTypes.string,
};

export default HearingCard;
