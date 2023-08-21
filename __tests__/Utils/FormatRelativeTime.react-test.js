import React from 'react';
import { shallow } from 'enzyme';
import { FormattedMessage, FormattedRelative } from 'react-intl';

import FormatRelativeTime from '../../src/utils/FormatRelativeTime';
import { getIntlAsProp } from '../../test-utils';


const { formatTime, formatDate } = getIntlAsProp();
const defaultProps = {
  messagePrefix: 'timeClose',
  formatTime,
  formatDate,
};
const messageVariations = {
  close: 'timeClose',
  open: 'timeOpen',
  past: 'Past',
  future: 'Future',
  withValues: 'WithValues'
};
const currentDate = new Date();

describe('FormatRelativeTime', () => {
  function getWrapper(props) {
    return shallow(<FormatRelativeTime {...defaultProps} {...props} />);
  }
  function formatTimeString(time) {
    return formatTime(time, { hour: '2-digit', minute: '2-digit' });
  }
  function formatDateString(time) {
    return formatDate(time, { day: '2-digit', month: '2-digit' });
  }
  function getCurrentDate() {
    return new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate(),
      18
    );
  }

  describe('opening message with date', () => {
    const { open, past, future } = messageVariations;
    let mockDate;

    beforeEach(() => {
      mockDate = getCurrentDate();
    });

    test('in the future, 1 month from current date', () => {
      mockDate.setMonth(mockDate.getMonth() + 1);
      const futureDate = mockDate.toString();
      const wrapper = getWrapper({ timeVal: futureDate, messagePrefix: open });
      const messageElement = wrapper.find(FormattedMessage);
      const relativeElement = wrapper.find(FormattedRelative);

      const expectedMessageId = `${open}${future}`;
      expect(messageElement).toHaveLength(1);
      expect(messageElement.prop('id')).toEqual(expectedMessageId);

      expect(relativeElement).toHaveLength(1);
      expect(relativeElement.prop('value')).toEqual(futureDate);
    });

    test('in the past, 1 week ago from current date', () => {
      mockDate.setDate(mockDate.getDate() - 7);
      const pastDate = mockDate.toString();
      const wrapper = getWrapper({ timeVal: pastDate, messagePrefix: open });
      const messageElement = wrapper.find(FormattedMessage);
      const relativeElement = wrapper.find(FormattedRelative);

      const expectedMessageId = `${open}${past}`;
      expect(messageElement).toHaveLength(1);
      expect(messageElement.prop('id')).toEqual(expectedMessageId);

      expect(relativeElement).toHaveLength(1);
      expect(relativeElement.prop('value')).toEqual(pastDate);
    });
  });

  describe('closing message with date', () => {
    const { close, past, future, withValues } = messageVariations;
    let mockDate;

    beforeEach(() => {
      mockDate = getCurrentDate();
    });

    test('in the future, 1 month from current date', () => {
      mockDate.setMonth(mockDate.getMonth() + 1);
      const futureDateString = mockDate.toString();
      const wrapper = getWrapper({ timeVal: futureDateString, messagePrefix: close });
      const messageElement = wrapper.find(FormattedMessage);

      const closeTime = formatTimeString(futureDateString);
      const closeDate = formatDateString(futureDateString);
      const expectedValues = {
        date: closeDate,
        time: closeTime
      };
      const expectedId = `${close}${future}${withValues}`;
      expect(messageElement.prop('id')).toEqual(expectedId);
      expect(messageElement.prop('values')).toEqual(expectedValues);
    });

    test('in the past 1 week ago from current date', () => {
      mockDate.setDate(mockDate.getDate() - 7);
      const pastDate = mockDate.toString();
      const wrapper = getWrapper({ timeVal: pastDate, messagePrefix: close });
      const messageElement = wrapper.find(FormattedMessage);

      const closeTime = formatTimeString(pastDate);
      const closeDate = formatDateString(pastDate);
      const expectedValues = {
        date: closeDate,
        time: closeTime
      };
      const expectedId = `${close}${past}${withValues}`;
      expect(messageElement.prop('id')).toEqual(expectedId);
      expect(messageElement.prop('values')).toEqual(expectedValues);
    });
    test('over 1 month ago from current date', () => {
      mockDate.setMonth(mockDate.getMonth() - 1);
      mockDate.setDate(mockDate.getDate() - 1);
      const pastDate = mockDate.toString();
      const wrapper = getWrapper({ timeVal: pastDate, messagePrefix: close });
      const messageElement = wrapper.find(FormattedMessage);
      const relativeElement = wrapper.find(FormattedRelative);

      const expectedMessageId = `${close}${past}`;
      expect(messageElement).toHaveLength(1);
      expect(messageElement.prop('id')).toEqual(expectedMessageId);

      expect(relativeElement).toHaveLength(1);
      expect(relativeElement.prop('value')).toEqual(pastDate);
    });
  });
});
