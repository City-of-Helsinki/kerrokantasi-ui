import React from 'react';
import { MemoryRouter } from 'react-router-dom';

import renderWithProviders from '../utils/renderWithProviders';
import App from '../App';

const renderComponent = (props) => {
  return renderWithProviders(
    <MemoryRouter>
      <App {...props} />
    </MemoryRouter>,
  );
} 

const {container, store} = renderComponent();

describe('<App />', () => {
  it('renders correctly', () => {
    expect(container).toBeTruthy();
  });

  it('has correct state on initial load', () => {
    const state = store.getState();
    expect(state.intervalSet).toBeFalsy();
  });
});
