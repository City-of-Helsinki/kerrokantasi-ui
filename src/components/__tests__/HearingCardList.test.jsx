import React from 'react';
import { MemoryRouter } from 'react-router-dom';

import { getIntlAsProp, mockStore } from '../../../test-utils';
import HearingCardList from '../HearingCardList';
import renderWithProviders from '../../utils/renderWithProviders';

const renderComponent = (propOverrides) => {
  const {
    hearingLists: { allHearings },
    ...rest
  } = mockStore;
  const props = {
    hearings: allHearings.data,
    ...rest,
    ...propOverrides,
  };

  return renderWithProviders(
    <MemoryRouter>
      <HearingCardList intl={getIntlAsProp()} {...props} />
    </MemoryRouter>,
  );
};

describe('<HearingCardList />', () => {
  it('should render correctly', () => {
    renderComponent();
  });
});
