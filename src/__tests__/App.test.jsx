import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import configureStore from 'redux-mock-store';
import { thunk } from 'redux-thunk';
import { act, screen } from '@testing-library/react';

import renderWithProviders from '../utils/renderWithProviders';
import App from '../App';
import { mockStore as mockData, mockUser } from '../../test-utils';

// Mock getNotifications to return an empty array
jest.mock('../utils/notificationService', () => ({
  getNotifications: jest.fn().mockResolvedValue([])
}));

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useSearchParams: jest.fn().mockImplementation(() => [new URLSearchParams({ lang: 'fi' })]),
}));
jest.mock('react-helsinki-notification-manager', () => ({
  NotificationService: () => <div data-testid="notification-service">NotificationService</div>,
}))

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
<<<<<<< HEAD
  beforeEach(() => {
    global.ResizeObserver = vi.fn().mockImplementation(() => ({
      observe: vi.fn(),
      unobserve: vi.fn(),
      disconnect: vi.fn(),
    }));
  });

  it('renders correctly', () => {
    renderComponent();
=======
  it('renders correctly', async () => {
    await act(() => {
      renderComponent();
    })
    expect(screen.getByText("NotificationService")).toBeInTheDocument();
>>>>>>> 01090038 (feat: notification manager implementation)
  });
});
