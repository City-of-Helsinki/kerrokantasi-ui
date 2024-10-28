import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import configureStore from 'redux-mock-store';
import { thunk } from 'redux-thunk';

import renderWithProviders from '../utils/renderWithProviders';
import App from '../App';
import { mockStore as mockData, mockUser } from '../../test-utils';

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useSearchParams: jest.fn().mockImplementation(() => [new URLSearchParams({ lang: 'fi' })]),
}));

const { hearingLists } = mockData;

const defaultState = {
  language: 'fi',
  hearingLists,
  accessibility: { isHighContrast: false },
  user: { data: { ...mockUser, adminOrganizations: [] } },
};

const renderComponent = (storeOverride) => {
  const history = createBrowserHistory();

  const store = storeOverride || mockStore(defaultState);

  return renderWithProviders(
    <BrowserRouter history={history}>
      <App />
    </BrowserRouter>,
    { store },
  );
};

describe('<App />', () => {
  it('renders correctly', () => {
    renderComponent();
  });
});
