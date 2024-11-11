import React from 'react';

import FormatRelativeTime from '../FormatRelativeTime';
import { getIntlAsProp } from '../../../test-utils';
import renderWithProviders from '../renderWithProviders';

const { formatTime, formatDate } = getIntlAsProp();
const defaultProps = {
  messagePrefix: 'timeClose',
  formatTime,
  formatDate,
};

const currentDate = new Date();

const renderComponent = (props) => renderWithProviders(<FormatRelativeTime {...defaultProps} {...props} />);

describe('FormatRelativeTime', () => {
  function getCurrentDate() {
    return new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), 18);
  }

  const mockFormatTime = vi.fn();
  const mockFormatDate = vi.fn();

  let mockDate;

  beforeEach(() => {
    mockFormatTime.mockClear();
    mockFormatDate.mockClear();

    mockDate = getCurrentDate();
  });

  it('in the future, 1 month from current date', () => {
    mockDate.setMonth(mockDate.getMonth() + 1);
    const futureDate = mockDate.toString();

    const { getByText } = renderComponent({
      messagePrefix: 'timeClose',
      timeVal: futureDate,
      formatTime: mockFormatTime,
      formatDate: mockFormatDate,
    });

    expect(getByText('timeCloseFutureWithValues')).toBeInTheDocument();
  });

  it('in the past, 1 week ago from current date', () => {
    mockDate.setDate(mockDate.getDate() - 7);
    const pastDate = mockDate.toString();

    const { getByText } = renderComponent({
      messagePrefix: 'timeClose',
      timeVal: pastDate,
      formatTime: mockFormatTime,
      formatDate: mockFormatDate,
    });

    expect(getByText('timeClosePastWithValues')).toBeInTheDocument();
  });

  it('in the future, 1 month from current date', () => {
    mockDate.setMonth(mockDate.getMonth() + 1);
    const futureDateString = mockDate.toString();

    const { getByText } = renderComponent({
      messagePrefix: 'timeClose',
      timeVal: futureDateString,
      formatTime: mockFormatTime,
      formatDate: mockFormatDate,
    });

    expect(getByText('timeCloseFutureWithValues')).toBeInTheDocument();
  });

  it('in the past 1 week ago from current date', () => {
    mockDate.setDate(mockDate.getDate() - 7);
    const pastDate = mockDate.toString();

    const { getByText } = renderComponent({
      messagePrefix: 'timeClose',
      timeVal: pastDate,
      formatTime: mockFormatTime,
      formatDate: mockFormatDate,
    });

    expect(getByText('timeClosePastWithValues')).toBeInTheDocument();
  });

  it('over 1 month ago from current date', () => {
    mockDate.setMonth(mockDate.getMonth() - 1);
    mockDate.setDate(mockDate.getDate() - 1);
    const pastDate = mockDate.toString();

    const { getByText } = renderComponent({
      messagePrefix: 'timeClose',
      timeVal: pastDate,
      formatTime: mockFormatTime,
      formatDate: mockFormatDate,
    });

    expect(getByText('timeClosePast', { exact: false })).toBeInTheDocument();
  });
});
