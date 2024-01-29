import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { screen } from '@testing-library/react';

import { Home } from '../Home';
import { getIntlAsProp, mockStore } from '../../../test-utils';
import renderWithProviders from '../../utils/renderWithProviders';

const renderComponent = (propsOverrides) => {
  const {
    hearingLists: { allHearings },
    ...rest
  } = mockStore;

  const props = {
    topHearing: allHearings.data[0],
    openHearings: allHearings,
    ...rest,
    ...propsOverrides,
  };

  return renderWithProviders(
    <MemoryRouter>
      <Home intl={getIntlAsProp()} {...props} />
    </MemoryRouter>,
  );
};

describe('<Home />', () => {
  it('should render correctly', () => {
    const { container } = renderComponent();

    expect(container).toMatchSnapshot();
  });

  it('should find top hearing', () => {
    renderComponent();

    expect(screen.getByText('Mock Hearing')).toBeInTheDocument();
  });

  it('should find HearingCardList', async () => {
    renderComponent();

    expect(await screen.findByTestId('hearing-card-list')).toBeInTheDocument();
  });
});
