import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import HearingListFilters from '../HearingListFilters/HearingListFilters';
import renderWithProviders from '../../../utils/renderWithProviders';

const renderComponent = (propOverrides) => {
  const props = {
    handleSort: vi.fn(),
    formatMessage: vi.fn((msg) => msg.id),
    ...propOverrides,
  };

  return renderWithProviders(<HearingListFilters {...props} />);
};

describe('<HearingListFilters />', () => {
  it('renders correctly', () => {
    renderComponent();
  });

  it('calls handleSort with correct parameters when an option is selected', async () => {
    const handleSortMock = vi.fn();

    renderComponent({ handleSort: handleSortMock });

    const user = userEvent.setup();

    const toggle = await screen.findByRole('combobox');

    await user.click(toggle);

    const option = await screen.findByText('oldestFirst');

    await user.click(option);

    expect(handleSortMock).toHaveBeenCalledWith('created_at', false, false);
  });
});
