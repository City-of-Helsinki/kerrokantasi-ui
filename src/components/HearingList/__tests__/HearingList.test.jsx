import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { screen } from '@testing-library/react';

import HearingList from '../HearingList';
import { mockStore, getIntlAsProp } from '../../../../test-utils';
import renderWithProviders from '../../../utils/renderWithProviders';

const renderComponent = (propOverrides) => {
  const { labels, hearingLists } = mockStore;
  const props = {
    labels: labels.data,
    hearings: hearingLists.allHearings.data,
    tab: 'list',
    ...propOverrides,
  };

  return renderWithProviders(
    <MemoryRouter>
      <HearingList intl={getIntlAsProp()} {...props} />
    </MemoryRouter>,
  );
};

describe('<HearingsList />', () => {
  it('should render correctly', () => {
    renderComponent();
  });

  it('should render one HearingListItem', async () => {
    renderComponent();

    expect(await screen.findAllByRole('listitem')).toHaveLength(1);
  });

  it('should render noHearings message if hearings is an empty array', () => {
    renderComponent({ hearings: [] });

    expect(screen.getByText('noHearings')).toBeInTheDocument();
  });
});
