import React from 'react';
import { fireEvent, screen } from '@testing-library/react';

import HearingsSearch from '../HearingsSearch/HearingsSearch';
import renderWithProviders from '../../../utils/renderWithProviders';
import { getIntlAsProp } from '../../../../test-utils';

const renderComponent = (propOverrides) => {
  const props = {
    handleSearch: vi.fn(),
    handleSelectLabels: vi.fn(),
    labels: [
      { label: { en: 'Label 1' }, id: '1' },
      { label: { en: 'Label 2' }, id: '2' },
    ],
    selectedLabels: ['1'],
    searchPhrase: 'test',
    intl: getIntlAsProp(),
    ...propOverrides,
  };

  return renderWithProviders(<HearingsSearch {...props} />);
};

describe('HearingsSearch', () => {
  it('renders correctly', () => {
    renderComponent();
  });

  it('calls handleSearch on form submit', async () => {
    const handleSearchMock = vi.fn();

    renderComponent({ handleSearch: handleSearchMock });

    const comboboxes = await screen.findAllByRole('combobox');
    const combobox = comboboxes[0];

    fireEvent.change(combobox, { target: { value: 'new search' } });

    fireEvent.click(await screen.findByRole('button', { name: 'search' }));

    expect(handleSearchMock).toHaveBeenCalledWith('new search');
  });

  it('calls handleSelectLabels on label selection', async () => {
    const handleSelectLabelsMock = vi.fn();

    renderComponent({ handleSelectLabels: handleSelectLabelsMock });

    const comboboxes = await screen.findAllByRole('combobox');
    const combobox = comboboxes[1];

    fireEvent.change(combobox, { target: { value: 'Label 1' } });

    const option = await screen.findByText('Label 1');

    fireEvent.click(option);

    expect(handleSelectLabelsMock).toHaveBeenCalled();
  });
});
