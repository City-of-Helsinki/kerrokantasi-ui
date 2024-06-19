import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, FormattedRelativeTime } from 'react-intl';

function FormatRelativeTime({ messagePrefix, timeVal, frontpage = false, formatTime, formatDate }) {
  if (!timeVal || !messagePrefix) {
    return <span />;
  }
  const time = new Date(timeVal);
  // timeVal is before current date?
  const currentTime = new Date();
  const isPast = (time.getTime() < currentTime.getTime());

  const yearsDifference = currentTime.getFullYear() - time.getFullYear();
  const monthsDifference = currentTime.getMonth() - time.getMonth();
  let difference = currentTime.getDate() - time.getDate();
  const weeksDifference = Math.floor(difference / 7);
  let unit = 'day';
  if (yearsDifference !== 0) {
    unit = 'year';
    difference = yearsDifference;
  } else if (monthsDifference !== 0) {
    unit = 'month';
    difference = monthsDifference;
  } else if (weeksDifference !== 0) {
    unit = 'week';
    difference = weeksDifference;
  }

  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
  // timeVal is before exactly one month ago from current date.
  const pastMoreThanMonth = (time.getTime() < oneMonthAgo.getTime());

  let messageId = messagePrefix + (isPast ? "Past" : "Future");
  // messagePrefix includes 'close' -> we're dealing a hearings closing time
  const closeTimeMessage = messagePrefix.toLowerCase().includes('close');

  // if closing message AND timeVal is not before current date OR is before current date but not older than one month
  if (closeTimeMessage && (!isPast || (isPast && !pastMoreThanMonth))) {
    // use translation string that takes time/date values, ie. 'Closes {date} {time}'
    // timeClosePastWithValues instead of the generic timeClosePast
    messageId += 'WithValues';
  }

  // a closing message and date that is not older than 1 month ago
  if (closeTimeMessage && !pastMoreThanMonth) {
    const closeTime = formatTime(timeVal, { hour: '2-digit', minute: '2-digit' });
    const closeDate = formatDate(timeVal, { day: '2-digit', month: '2-digit' });
    return (
      <FormattedMessage id={messageId} values={{ time: closeTime, date: closeDate }}>
        {txt =>
          <div>
            {txt}
            {frontpage && '.'}
          </div>
        }
      </FormattedMessage>
    );
  }
  return (<><FormattedMessage id={messageId} /> <FormattedRelativeTime value={difference * -1} unit={unit} /></>);
}

FormatRelativeTime.propTypes = {
  messagePrefix: PropTypes.string.isRequired,
  timeVal: PropTypes.string,
  frontpage: PropTypes.bool,
  formatTime: PropTypes.func,
  formatDate: PropTypes.func,
};

export default FormatRelativeTime;
