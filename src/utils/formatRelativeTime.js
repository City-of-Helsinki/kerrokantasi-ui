import React from 'react';
import {FormattedMessage, FormattedRelative} from 'react-intl';

export default function formatRelativeTime(messagePrefix, timeVal) {
  if (!timeVal) {
    return "";
  }
  const time = new Date(timeVal);
  const isPast = (+time < +new Date());
  const messageId = messagePrefix + (isPast ? "Past" : "Future");
  return (<span><FormattedMessage id={messageId}/> <FormattedRelative value={timeVal}/></span>);
}
