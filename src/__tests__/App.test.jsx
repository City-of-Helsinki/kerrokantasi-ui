import React from 'react';
import { MemoryRouter } from 'react-router-dom';

import renderWithProviders from '../utils/renderWithProviders';
import App from '../App';

describe('<App />', () => {
  it('renders correctly', () => {
    renderWithProviders(
      <MemoryRouter>
        <App />
      </MemoryRouter>,
    );
  });
});
