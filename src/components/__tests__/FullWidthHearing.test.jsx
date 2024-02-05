import React from 'react';
import { MemoryRouter } from 'react-router-dom';

import { getIntlAsProp, mockStore } from '../../../test-utils';
import FullWidthHearing from '../FullWidthHearing';
import renderWithProviders from '../../utils/renderWithProviders';

const renderComponent = (propsOverrides) => {
  const {
    hearingLists: { allHearings },
  } = mockStore;
  const props = { hearing: allHearings.data[0], ...propsOverrides };

  return renderWithProviders(
    <MemoryRouter>
      <FullWidthHearing intl={getIntlAsProp()} {...props} />
    </MemoryRouter>,
  );
};

describe('<FullWidthHearing />', () => {
  it('should render correctly', () => {
    renderComponent();
  });
});
