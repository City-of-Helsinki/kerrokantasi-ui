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

const renderComponent = (props) =>
  renderWithProviders(<FormatRelativeTime {...defaultProps} {...props} />);

describe('FormatRelativeTime', () => {
  function getCurrentDate() {
    return new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate(),
      18
    );
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

  it('uses hour relative unit for past hours', () => {
    const pastDate = new Date(Date.now() - 3 * 60 * 60 * 1000).toString();

    const { container, getByText } = renderComponent({
      messagePrefix: 'timeOpen',
      timeVal: pastDate,
      formatTime: mockFormatTime,
      formatDate: mockFormatDate,
    });

    expect(getByText('timeOpenPast', { exact: false })).toBeInTheDocument();
    expect(container.textContent.toLowerCase()).toMatch(/tunt|hour/);
  });

  it('uses minute relative unit for past minutes', () => {
    const pastDate = new Date(Date.now() - 10 * 60 * 1000).toString();

    const { container, getByText } = renderComponent({
      messagePrefix: 'timeOpen',
      timeVal: pastDate,
      formatTime: mockFormatTime,
      formatDate: mockFormatDate,
    });

    expect(getByText('timeOpenPast', { exact: false })).toBeInTheDocument();
    expect(container.textContent.toLowerCase()).toMatch(/minuut|min/);
  });

  it('uses second relative unit for past seconds', () => {
    const pastDate = new Date(Date.now() - 20 * 1000).toString();

    const { container, getByText } = renderComponent({
      messagePrefix: 'timeOpen',
      timeVal: pastDate,
      formatTime: mockFormatTime,
      formatDate: mockFormatDate,
    });

    expect(getByText('timeOpenPast', { exact: false })).toBeInTheDocument();
    expect(container.textContent.toLowerCase()).toMatch(/sekun|second/);
  });
});
