/* eslint-disable react/no-find-dom-node */
import React from 'react';
import { screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import Header from '../src/components/Header/Header';
import createStore from '../src/createStore';
import renderWithProviders from '../src/utils/renderWithProviders';

const store = createStore();

function renderComponent(props) {
  renderWithProviders(
    <MemoryRouter>
      <Header {...props} />
    </MemoryRouter>,
    {props}
  );
}

describe('Header', () => {
  it('should show a login link when not logged in', () => {
    renderComponent({store});
    expect(screen.getByText('login')).toBeTruthy();
  });
});
