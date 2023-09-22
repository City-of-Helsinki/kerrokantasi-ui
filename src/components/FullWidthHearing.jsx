/* eslint-disable react/forbid-prop-types */
/* eslint-disable import/no-unresolved */
import React from 'react';
import PropTypes from 'prop-types';
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

const FullWidthHearing = ({ hearing, className = '', language, history, intl }) => {
  const { formatTime, formatDate } = intl;
  const backgroundImage = getHearingMainImageURL(hearing);
  const styles = {
    backgroundImage: backgroundImage ? `url(${backgroundImage})` : `url(${defaultImage})`,
  };
  const translationAvailable = !!getAttr(hearing.title, language, { exact: true });
  const availableInLanguageMessages = {
    fi: 'Kuuleminen saatavilla suomeksi',
    sv: 'Hörandet tillgängligt på svenska',
    en: 'Questionnaire available in English',
  };
  const mainImgCaption =
    hearing.main_image && hearing.main_image.caption ? getAttr(hearing.main_image.caption, language) : '';

  return (
    <div className={`fullwidth-hearing ${className}`}>
      <MouseOnlyLink
        className='fullwidth-hearing-image'
        style={styles}
        history={history}
        url={getHearingURL(hearing)}
        altText={mainImgCaption || getAttr(hearing.title, language)}
      />
      <div className='fullwidth-hearing-header'>
        <div className='fullwidth-hearing-title-wrap'>
          <h3 className='h2 fullwidth-hearing-title'>
            <Link to={{ path: getHearingURL(hearing) }}>{getAttr(hearing.title, language)}</Link>
          </h3>
        </div>
        <div className='fullwidth-hearing-comments'>
          <Icon name='comment-o' aria-hidden='true' />
          &nbsp;{hearing.n_comments}
          <span className='sr-only'>
            {hearing.n_comments === 1 ? (
              <FormattedMessage id='hearingCardFullWidthComment' />
            ) : (
              <FormattedMessage id='hearingCardFullWidthComments' />
            )}
          </span>
        </div>
        <div className='fullwidth-hearing-times'>
          <span>
            <FormatRelativeTime messagePrefix='timeOpen' timeVal={hearing.open_at} />.
          </span>{' '}
          <FormatRelativeTime
            messagePrefix='timeClose'
            timeVal={hearing.close_at}
            formatTime={formatTime}
            formatDate={formatDate}
            frontpage
          />
        </div>
        <div className='fullwidth-hearing-labels clearfix'>
          <LabelList className='hearing-list-item-labellist' labels={hearing.labels} language={language} />
        </div>
        {!translationAvailable && (
          <div className='hearing-card-notice'>
            <Icon name='exclamation-circle' aria-hidden='true' />
            <FormattedMessage id='hearingTranslationNotAvailable' />
            {config.languages.map((lang) =>
              getAttr(hearing.title, lang, { exact: true }) ? (
                <div className='language-available-message' key={lang} lang={lang}>
                  {availableInLanguageMessages[lang]}
                </div>
              ) : null,
            )}
          </div>
        )}
      </div>
    </div>
  );
};

FullWidthHearing.propTypes = {
  className: PropTypes.string,
  hearing: PropTypes.object,
  history: PropTypes.object,
  language: PropTypes.string,
  intl: PropTypes.object,
};

export default withRouter(FullWidthHearing);
