import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { createBrowserHistory } from 'history';

import renderWithProviders from '../utils/renderWithProviders';
import App from '../App';

const renderComponent = (props) => {
  const history = createBrowserHistory();

  return renderWithProviders(
    <BrowserRouter history={history}>
      <App {...props} />
    </BrowserRouter>,
  );
};

const { container } = renderComponent({ user: { test } });

describe('<App />', () => {
  it('renders correctly', () => {
    expect(container).toBeTruthy();
  });
});
