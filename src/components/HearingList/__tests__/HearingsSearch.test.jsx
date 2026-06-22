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

    // HDS Search renders role="searchbox", not "combobox"
    const searchInput = screen.getByRole('searchbox');

    fireEvent.change(searchInput, { target: { value: 'new search' } });

    fireEvent.click(await screen.findByRole('button', { name: 'search' }));

    expect(handleSearchMock).toHaveBeenCalledWith('new search');
  });

  it('calls handleSelectLabels on label selection', async () => {
    const handleSelectLabelsMock = vi.fn();

    renderComponent({ handleSelectLabels: handleSelectLabelsMock });

    // HDS Search renders role="searchbox"; the Select is the only role="combobox"
    const combobox = screen.getByRole('combobox');

    fireEvent.click(combobox);

    const option = await screen.findByRole('option', { name: 'Label 1' });

    fireEvent.click(option);

    expect(handleSelectLabelsMock).toHaveBeenCalled();
  });
});
