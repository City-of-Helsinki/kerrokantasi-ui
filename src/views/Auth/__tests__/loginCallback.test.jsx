import { screen, waitFor } from '@testing-library/react';
import React from 'react';
import { createBrowserHistory } from 'history';
import { BrowserRouter } from 'react-router-dom';

import { UnconnectedLoginCallback } from '../loginCallback';
import renderWithProviders from '../../../utils/renderWithProviders';

function renderComponent(props) {
  const history = createBrowserHistory();

  const defaultProps = {
    history,
  };

  renderWithProviders(
    <BrowserRouter history={history}>
      <UnconnectedLoginCallback {...defaultProps} {...props} />
    </BrowserRouter>,
  );
}

describe('<LoginCallback />', () => {
  it('should render CallbackComponent with correct props', () => {
    renderComponent();

    waitFor(() => expect(screen.getByText('Redirecting...')).toBeTruthy());
  });
});
