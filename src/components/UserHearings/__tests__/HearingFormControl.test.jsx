/* eslint-disable sonarjs/no-duplicate-string */
import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import HearingFormControl from '../HearingFormControl';
import renderWithProviders from '../../../utils/renderWithProviders';

const messages = {
  sort: 'Sort',
  newestFirst: 'Newest First',
  oldestFirst: 'Oldest First',
  lastClosing: 'Last Closing',
  firstClosing: 'First Closing',
  mostCommented: 'Most Commented',
  leastCommented: 'Least Commented',
};

const formatMessage = ({ id }) => messages[id];

const renderComponent = (changeSort) =>
  renderWithProviders(<HearingFormControl formatMessage={formatMessage} changeSort={changeSort} />);

describe('HearingFormControl', () => {
  it('should render correctly with default option', () => {
    const changeSort = vi.fn();
    renderComponent(changeSort);

    expect(screen.getByText('sort')).toBeInTheDocument();
    expect(screen.getByText('Newest First')).toBeInTheDocument();
  });

  it('calls changeSort with correct id when option is selected', async () => {
    const changeSort = vi.fn();
    renderComponent(changeSort);

    const user = userEvent.setup();

    const toggle = await screen.findByRole('button');

    await user.click(toggle);

    const option = await screen.findByText('Oldest First');

    await user.click(option);

    expect(changeSort).toHaveBeenCalledWith('created_at');
  });

  it('renders all options correctly', async () => {
    const changeSort = vi.fn();
    renderComponent(changeSort);

    const user = userEvent.setup();

    const toggle = await screen.findByRole('button');

    await user.click(toggle);

    expect(screen.getByText('Oldest First')).toBeInTheDocument();
    expect(screen.getByText('Last Closing')).toBeInTheDocument();
    expect(screen.getByText('First Closing')).toBeInTheDocument();
    expect(screen.getByText('Most Commented')).toBeInTheDocument();
    expect(screen.getByText('Least Commented')).toBeInTheDocument();
  });
});
