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
vi.mock('../utils/notificationService', () => ({
  getNotifications: vi.fn().mockResolvedValue([])
}));

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

vi.mock('react-router-dom', async () => {
  const actual = await import('react-router-dom');
  return {
    ...actual,
    useSearchParams: vi.fn().mockImplementation(() => [new URLSearchParams({ lang: 'fi' })]),
  };
});
vi.mock('react-helsinki-notification-manager', () => ({
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
  beforeEach(() => {
    global.ResizeObserver = vi.fn().mockImplementation(() => ({
      observe: vi.fn(),
      unobserve: vi.fn(),
      disconnect: vi.fn(),
    }));
  });
  afterEach(() => {
    vi.clearAllMocks();
  });
  it('renders correctly', async () => {
    await act(() => {
      renderComponent();
    })
    expect(screen.getByText("NotificationService")).toBeInTheDocument();
  });
});
