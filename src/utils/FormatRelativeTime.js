import React from 'react';
import PropTypes from 'prop-types';
import {FormattedMessage, FormattedRelative} from 'react-intl';

function FormatRelativeTime({messagePrefix, timeVal, frontpage = false, formatTime, formatDate}) {
  if (!timeVal || !messagePrefix) {
    return <span/>;
  }
  const time = new Date(timeVal);
  // timeVal is before current date?
  const isPast = (time.getTime() < new Date().getTime());

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
    const closeTime = formatTime(timeVal, {hour: '2-digit', minute: '2-digit'});
    const closeDate = formatDate(timeVal, {day: '2-digit', month: '2-digit'});
    return (
      <FormattedMessage id={messageId} values={{time: closeTime, date: closeDate}}>
        {txt =>
          <div>
            {txt}
            {frontpage && '.'}
          </div>
        }
      </FormattedMessage>
    );
  }
  return (<><FormattedMessage id={messageId}/> <FormattedRelative value={timeVal}/></>);
}

FormatRelativeTime.propTypes = {
  messagePrefix: PropTypes.string.isRequired,
  timeVal: PropTypes.string,
  frontpage: PropTypes.bool,
  formatTime: PropTypes.func,
  formatDate: PropTypes.func,
};

export default FormatRelativeTime;
