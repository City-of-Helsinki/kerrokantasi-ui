import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, FormattedRelativeTime, useIntl } from 'react-intl';

// Helper function to calculate time difference and unit
function calculateTimeDifference(timeDifferenceMs, isPast) {
  const timeDifferenceAbs = Math.abs(timeDifferenceMs);
  const millisecondsInDay = 1000 * 60 * 60 * 24;
  const millisecondsInWeek = millisecondsInDay * 7;
  const millisecondsInMonth = millisecondsInDay * 30; // Approximate
  const millisecondsInYear = millisecondsInDay * 365; // Approximate

  let difference = 0;
  let unit = 'day';

  if (timeDifferenceAbs >= millisecondsInYear) {
    difference = Math.floor(timeDifferenceAbs / millisecondsInYear);
    unit = 'year';
  } else if (timeDifferenceAbs >= millisecondsInMonth) {
    difference = Math.floor(timeDifferenceAbs / millisecondsInMonth);
    unit = 'month';
  } else if (timeDifferenceAbs >= millisecondsInWeek) {
    difference = Math.floor(timeDifferenceAbs / millisecondsInWeek);
    unit = 'week';
  } else {
    difference = Math.floor(timeDifferenceAbs / millisecondsInDay);
  }

  // For very recent past times (0 days), show as 1 day ago to avoid "in 0 days" issue
  if (difference === 0 && isPast) {
    difference = 1;
  }

  return {
    difference: isPast ? -difference : difference,
    unit,
  };
}

function FormatRelativeTime({ messagePrefix, timeVal, frontpage = false }) {
  const { formatDate, formatTime } = useIntl();

  if (!timeVal) {
    return <span />;
  }

  const time = new Date(timeVal);
  const currentTime = new Date();
  const isPast = time.getTime() < currentTime.getTime();
  const timeDifferenceMs = currentTime.getTime() - time.getTime();
  const { difference, unit } = calculateTimeDifference(timeDifferenceMs, isPast);

  // Check if this is older than one month
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(currentTime.getMonth() - 1);
  const isOlderThanOneMonth = time.getTime() < oneMonthAgo.getTime();

  const isCloseTimeMessage = messagePrefix.toLowerCase().includes('close');
  let messageId = messagePrefix + (isPast ? 'Past' : 'Future');

  // For closing messages within the last month, use date/time format
  if (isCloseTimeMessage && (!isPast || !isOlderThanOneMonth)) {
    messageId += 'WithValues';

    if (!isOlderThanOneMonth) {
      const closeTime = formatTime(timeVal, { hour: '2-digit', minute: '2-digit' });
      const closeDate = formatDate(timeVal, { day: '2-digit', month: '2-digit' });
      return (
        <FormattedMessage id={messageId} values={{ time: closeTime, date: closeDate }}>
          {(txt) => (
            <div>
              {txt}
              {frontpage && '.'}
            </div>
          )}
        </FormattedMessage>
      );
    }
  }

  // For comments (no messagePrefix) or other cases, use relative time
  if (!messagePrefix) {
    return <FormattedRelativeTime value={difference} unit={unit} />;
  }

  return (
    <>
      <FormattedMessage id={messageId} /> <FormattedRelativeTime value={difference} unit={unit} />
    </>
  );
}

FormatRelativeTime.propTypes = {
  messagePrefix: PropTypes.string.isRequired,
  timeVal: PropTypes.string,
  frontpage: PropTypes.bool,
};

export default FormatRelativeTime;
