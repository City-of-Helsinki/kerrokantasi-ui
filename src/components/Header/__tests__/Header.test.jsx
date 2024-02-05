import React from 'react';
import { screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import Header from '../Header';
import createStore from '../../../createStore';
import renderWithProviders from '../../../utils/renderWithProviders';

const store = createStore();

function renderComponent(props) {
  renderWithProviders(
    <MemoryRouter>
      <Header {...props} />
    </MemoryRouter>,
    { props },
  );
}

describe('Header', () => {
  it('should show a login link when not logged in', () => {
    renderComponent({ store });
    expect(screen.getByText('login')).toBeTruthy();
  });
});
