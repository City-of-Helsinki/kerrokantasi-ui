import React from 'react';
import PropTypes from 'prop-types';
import {FormattedMessage, FormattedRelative} from 'react-intl';

function FormatRelativeTime({messagePrefix, timeVal}) {
  if (!timeVal) {
    return <span/>;
  }
  const time = new Date(timeVal);
  const isPast = (+time < +new Date());
  const messageId = messagePrefix + (isPast ? "Past" : "Future");
  return (<span><FormattedMessage id={messageId}/> <FormattedRelative value={timeVal}/></span>);
}

FormatRelativeTime.propTypes = {
  messagePrefix: PropTypes.string,
  timeVal: PropTypes.string,
};

export default FormatRelativeTime;
