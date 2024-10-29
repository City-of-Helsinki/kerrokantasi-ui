import React from 'react';
import { MemoryRouter } from 'react-router-dom';

import renderWithProviders from '../utils/renderWithProviders';
import App from '../App';

const renderComponent = (props) => renderWithProviders(
    <MemoryRouter>
      <App {...props} />
    </MemoryRouter>,
  );

const {container} = renderComponent({user: {test}});

describe('<App />', () => {
  it('renders correctly', () => {
    expect(container).toBeTruthy();
  });
});
