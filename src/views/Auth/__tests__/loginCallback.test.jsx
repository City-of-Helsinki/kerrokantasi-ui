import { screen } from '@testing-library/react';
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
    </BrowserRouter>
  );
}

describe('<LoginCallback />', () => {
  it('shows the redirect text inside the page container', async () => {
    renderComponent();

    // The test intl provider has no messages, so the message id is shown.
    const text = await screen.findByText('loginRedirecting');
    expect(text).toHaveClass('container');
  });
});
