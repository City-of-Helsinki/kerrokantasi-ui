import React from 'react';
import { screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import { UnconnectedHeader } from '../Header';
import createAppStore from '../../../createStore';
import renderWithProviders from '../../../utils/renderWithProviders';

const store = createAppStore();
const testName = 'Testihenkilö';

function renderComponent(props) {
  renderWithProviders(
    <MemoryRouter>
      <UnconnectedHeader {...props} />
    </MemoryRouter>,
    { props },
  );
}

describe('Header', () => {
  it('should show a login link when not logged in', () => {
    renderComponent({ store });
    expect(screen.getByText('login')).toBeTruthy();
  });

  it('should show a username when logged in', () => {
    renderComponent({store, user: {displayName: testName, adminOrganizations: []}})
    expect(screen.getByText(testName)).toBeTruthy();
  })

});
