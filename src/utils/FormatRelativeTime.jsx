import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, FormattedRelativeTime, useIntl } from 'react-intl';
import moment from 'moment';

// Helper function to calculate time difference and unit
function calculateTimeDifference(timeDifferenceMs, isPast) {
  const timeDifferenceAbs = Math.abs(timeDifferenceMs);
  const duration = moment.duration(timeDifferenceAbs);

  let difference = 0;
  let unit;

  // Use as('years') instead of years() so exactly 365 days becomes 1 year;
  // years() can still be 0 because Moment treats a year as ~365.25 days.
  if (Math.floor(duration.as('years')) > 0) {
    difference = Math.floor(duration.as('years'));
    unit = 'year';
  } else if (duration.months() > 0) {
    difference = duration.months();
    unit = 'month';
  } else if (duration.weeks() > 0) {
    difference = duration.weeks();
    unit = 'week';
  } else if (duration.days() > 0) {
    difference = duration.days();
    unit = 'day';
  } else if (duration.hours() > 0) {
    difference = duration.hours();
    unit = 'hour';
  } else if (duration.minutes() > 0) {
    difference = duration.minutes();
    unit = 'minute';
  } else {
    difference = duration.seconds();
    unit = 'second';
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
  const { difference, unit } = calculateTimeDifference(
    timeDifferenceMs,
    isPast
  );

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
      const closeTime = formatTime(timeVal, {
        hour: '2-digit',
        minute: '2-digit',
      });
      const closeDate = formatDate(timeVal, {
        day: '2-digit',
        month: '2-digit',
      });
      return (
        <FormattedMessage
          id={messageId}
          values={{ time: closeTime, date: closeDate }}
        >
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
      <FormattedMessage id={messageId} />{' '}
      <FormattedRelativeTime value={difference} unit={unit} />
    </>
  );
}

FormatRelativeTime.propTypes = {
  messagePrefix: PropTypes.string.isRequired,
  timeVal: PropTypes.string,
  frontpage: PropTypes.bool,
};

export default FormatRelativeTime;
