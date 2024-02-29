import { screen } from '@testing-library/react';
import React from 'react';
import { createBrowserHistory } from 'history';

import { UnconnectedLoginCallback } from '../loginCallback';
import renderWithProviders from '../../../utils/renderWithProviders';

function renderComponent(props) {
  const defaultProps = {
    history: createBrowserHistory(),
  };
  renderWithProviders(<UnconnectedLoginCallback {...defaultProps} {...props} />);
}

describe('<LoginCallback />', () => {
  it('should render CallbackComponent with correct props', () => {
    renderComponent();

    expect(screen.getByText('Redirecting...')).toBeTruthy();
  });
});
