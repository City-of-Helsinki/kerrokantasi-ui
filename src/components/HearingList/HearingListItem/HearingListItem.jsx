/* eslint-disable import/no-unresolved */
import React from 'react';
import PropTypes from 'prop-types';
import defaultImage from '@city-images/default-image.svg';
import { Tag } from 'hds-react';
import { FormattedMessage } from 'react-intl';

import getAttr from '../../../utils/getAttr';
import Icon from '../../../utils/Icon';
import LabelList from '../../LabelList';
import Link from '../../LinkWithLang';
import MouseOnlyLink from '../../MouseOnlyLink';
import { getHearingURL, isPublic } from '../../../utils/hearing';
import HearingTranslationNotice from '../HearingTranslationNotice/HearingTranslationNotice';

const HearingListItem = (props) => {
  const { hearing, language, history, formatTime, formatDate } = props;
  const mainImage = hearing.main_image;
  let mainImageStyle = {
    backgroundImage: `url("${defaultImage}")`,
  };
  if (hearing.main_image) {
    mainImageStyle = {
      backgroundImage: `url("${mainImage.url}")`,
    };
  }

  const translationAvailable = !!getAttr(hearing.title, language, { exact: true });

  // Preparing the dates for translation.
  const isPast = (time) => new Date(time).getTime() < new Date().getTime();
  const openTime = formatTime(hearing.open_at, { hour: '2-digit', minute: '2-digit' });
  const openDate = formatDate(hearing.open_at, { day: '2-digit', month: '2-digit', year: 'numeric' });
  const closeTime = formatTime(hearing.close_at, { hour: '2-digit', minute: '2-digit' });
  const closeDate = formatDate(hearing.close_at, { day: '2-digit', month: '2-digit', year: 'numeric' });

  // Translation ID's for ITIL translation values
  const openMessageId = `timeOpen${isPast(hearing.open_at) ? 'Past' : 'Future'}WithValues`;
  const closeMessageId = `timeClose${isPast(hearing.close_at) ? 'Past' : 'Future'}WithValues`;

  return (
    <li className='hearing-list-item'>
      <MouseOnlyLink
        className='hearing-list-item-image'
        style={mainImageStyle}
        history={history}
        url={getHearingURL(hearing)}
        altText={getAttr(hearing.title, language)}
      />
      <div className='hearing-list-item-content'>
        <div className='hearing-list-item-title-wrap'>
          <h2 className='h4 hearing-list-item-title'>
            <Link to={{ path: getHearingURL(hearing) }}>
              {!isPublic(hearing) ? (
                <FormattedMessage id='hearingListNotPublished'>
                  {(label) => <Icon name='eye-slash' aria-label={label} />}
                </FormattedMessage>
              ) : null}{' '}
              {getAttr(hearing.title, language)}
            </Link>
          </h2>
          <div className='hearing-list-item-comments'>
            <Icon name='comment-o' aria-hidden='true' />
            &nbsp;{hearing.n_comments}
            <span className='sr-only'>
              {hearing.n_comments === 1 ? (
                <FormattedMessage id='hearingListComment' />
              ) : (
                <FormattedMessage id='hearingListComments' />
              )}
            </span>
          </div>
        </div>
        <div className='hearing-list-item-times'>
          <div>
            <FormattedMessage id={openMessageId} values={{ time: openTime, date: openDate }} />
          </div>
          <div>
            <FormattedMessage id={closeMessageId} values={{ time: closeTime, date: closeDate }} />
          </div>
        </div>
        <div className='hearing-list-item-labels clearfix'>
          <LabelList labels={hearing.labels} className='hearing-list-item-labellist' language={language} />
          {hearing.closed ? (
            <div className='hearing-list-item-closed'>
              <Tag theme={{ '--tag-background': 'var(--color-black-30)' }}>
                <FormattedMessage id='hearingClosed' />
              </Tag>
            </div>
          ) : null}
        </div>
        {!translationAvailable && <HearingTranslationNotice title={hearing.title} />}
      </div>
    </li>
  );
};

HearingListItem.propTypes = {
  hearing: PropTypes.object,
  language: PropTypes.string,
  history: PropTypes.object,
  formatTime: PropTypes.func,
  formatDate: PropTypes.func,
};

export default HearingListItem;
