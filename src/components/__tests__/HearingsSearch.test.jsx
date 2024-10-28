import React from 'react';
import { screen, fireEvent } from '@testing-library/react';

import HearingsSearch from '../HearingsSearch';
import renderWithProviders from '../../utils/renderWithProviders';
import { getIntlAsProp } from '../../../test-utils';

const mockHandleSearch = jest.fn();
const mockHandleSelectLabels = jest.fn();

const labels = [
  { label: { fi: 'Label 1' }, id: 1 },
  { label: { fi: 'Label 2' }, id: 2 },
];

const renderComponent = (props = {}) =>
  renderWithProviders(
    <HearingsSearch
      handleSearch={mockHandleSearch}
      handleSelectLabels={mockHandleSelectLabels}
      labels={labels}
      language='fi'
      searchPhrase=''
      selectedLabels={[]}
      intl={getIntlAsProp()}
      {...props}
    />,
  );

describe('<HearingsSearch />', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders correctly', () => {
    renderComponent();
  });

  test('calls handleSearch on form submit', () => {
    renderComponent();

    const search = screen.getByRole('combobox', { name: 'searchTitles' });

    fireEvent.change(search, { target: { value: 'test search' } });
    fireEvent.click(screen.getByRole('button', { name: 'search' }));

    expect(mockHandleSearch).toHaveBeenCalledWith('test search');
  });
});
