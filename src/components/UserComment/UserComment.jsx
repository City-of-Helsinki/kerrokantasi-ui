/* eslint-disable react/forbid-prop-types */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { OverlayTrigger, Tooltip, Label } from 'react-bootstrap';
import { Button } from 'hds-react';
import nl2br from 'react-nl2br';
import moment from 'moment';
import { FormattedMessage, useIntl } from 'react-intl';

import Icon from '../../utils/Icon';
import Link from '../LinkWithLang';
import HearingMap from '../Hearing/HearingMap';
import getMessage from '../../utils/getMessage';
import getAttr from '../../utils/getAttr';
import FormatRelativeTime from '../../utils/FormatRelativeTime';


const UserComment = (props) => {

  const [displayMap, setDisplayMap] = useState(false);
  const { comment, locale } = props;
  const { hearing_data: data } = comment;
  const hearingStatus = {
    style: data.closed ? 'default' : 'success',
    id: data.closed ? 'closedHearing' : 'openHearing',
  };
  const intl = useIntl();
  /**
   * Returns a formatted timestamp
   * @param {string} timestamp
   * @example "2021-06-12T22:37:00Z" returned as "12.06.2021 22:37"
   * @returns {string}
   */
  // eslint-disable-next-line class-methods-use-this
  const parseTimestamp = (timestamp) => moment(timestamp).format('DD.MM.YYYY HH:mm');

  /**
   * Returns a Tooltip component with timestamp from date.
   * @param {string} date
   * @returns {JSX.Element}
   */
  const dateTooltip = (date) => <Tooltip id='comment-date-tooltip'>{parseTimestamp(date)}</Tooltip>;

  // eslint-disable-next-line class-methods-use-this
  const renderCommentText = () => {
    if (!comment.deleted) {
      return <p>{nl2br(comment.content)}</p>;
    }

    if (comment.deleted_by_type === 'self') {
      return <FormattedMessage id='sectionCommentSelfDeletedMessage' />;
    }

    if (comment.deleted_by_type === 'moderator') {
      return (
        <p>
          <FormattedMessage
            id='sectionCommentDeletedMessage'
            values={{
              date: comment.deleted_at ? moment(new Date(comment.deleted_at)).format(' DD.MM.YYYY HH:mm') : '',
            }}
          />
        </p>
      );
    }
    return <FormattedMessage id='sectionCommentGenericDeletedMessage' />;
  };

  /**
   * Toggles state.displayMap value
   */
  const toggleMap = () => {
    setDisplayMap(!displayMap);
  };

  return (
    <div className='hearing-comment'>
      <div className='hearing-comment__comment-wrapper'>
        <div className='hearing-comment-header'>
          <div className='hearing-comment-publisher'>
            <span className='hearing-comment-user'>
              <Icon name='user' aria-hidden='true' />
              {comment.author_name}
            </span>
            <OverlayTrigger placement='top' overlay={dateTooltip(comment.created_at)} delayShow={300}>
              <span className='hearing-comment-date'>
                <FormatRelativeTime
                  messagePrefix=''
                  timeVal={comment.created_at}
                  formatTime={intl.formatTime}
                  formatDate={intl.formatDate}
                />
              </span>
            </OverlayTrigger>
          </div>
          <div className='hearing-comment-status'>
            <div>
              <Label bsStyle={hearingStatus.style}>
                <FormattedMessage id='commentHearingStatus'>
                  {(txt) => <span className='sr-only'>{txt}</span>}
                </FormattedMessage>
                <FormattedMessage id={hearingStatus.id}>{(txt) => txt}</FormattedMessage>
              </Label>
            </div>
            <Link to={{ path: `/${data.slug}` }}>{getAttr(data.title, locale)}</Link>
          </div>
        </div>
        <div className='hearing-comment-body'>{renderCommentText()}</div>
        <div className='hearing-comment__images'>
          {comment.images
            ? comment.images.map((image) => (
                <a
                  className='hearing-comment-images-image'
                  key={image.url}
                  rel='noopener noreferrer'
                  target='_blank'
                  href={image.url}
                >
                  <img
                    alt={getMessage('commentImageAlt')}
                    src={image.url}
                    width={image.width < 100 ? image.width : 100}
                    height={image.height < 100 ? image.height : 100}
                  />
                </a>
              ))
            : null}
        </div>
        {comment.geojson && (
          <div className='hearing-comment__map'>
            <Button
              onClick={toggleMap}
              className='hearing-comment__map-toggle'
              aria-expanded={displayMap}
            >
              <FormattedMessage id='commentShowMap'>{(text) => text}</FormattedMessage>
            </Button>
            {displayMap && comment.geojson && (
              <div className='hearing-comment__map-container'>
                {comment.geojson && (
                  <HearingMap hearing={{ geojson: comment.geojson }} mapSettings={{ dragging: false }} />
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

UserComment.propTypes = {
  comment: PropTypes.object,
  locale: PropTypes.string,
};

export default UserComment;
