import React from 'react';
import { MemoryRouter } from 'react-router-dom';

import renderWithProviders from '../../../utils/renderWithProviders';
import SilentRenew from '../silentRenew';

describe('<SilentRenew />', () => {
  it('should render correctly', () => {
    renderWithProviders(
      <MemoryRouter>
        <SilentRenew />
      </MemoryRouter>,
    );
  });
});
