import React from 'react';
import { MemoryRouter } from 'react-router-dom';

import { getIntlAsProp, mockStore } from '../../../test-utils';
import HearingCard from '../HearingCard';
import renderWithProviders from '../../utils/renderWithProviders';

const renderComponent = (propOverrides) => {
  const {
    hearingLists: { allHearings },
  } = mockStore;
  const props = {
    hearing: allHearings.data[0],
    language: 'fi',
    ...propOverrides,
  };

  return renderWithProviders(
    <MemoryRouter>
      <HearingCard intl={getIntlAsProp()} {...props} />
    </MemoryRouter>,
  );
};

describe('<HearingCard />', () => {
  it('should render correctly', () => {
    renderComponent();
  });
});
