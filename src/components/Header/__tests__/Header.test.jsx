import { MemoryRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import { thunk } from 'redux-thunk';
import { screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import Header from '../Header';
import renderWithProviders from '../../../utils/renderWithProviders';
import { mockUser } from '../../../../test-utils';
import * as useAuthMock from '../../../hooks/useAuth';
import * as actionsMock from '../../../actions';

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

const defaultLocale = 'fi';
const mockSetLocale = vi.fn();

const defaultState = {
  language: defaultLocale,
  user: { data: { ...mockUser } },
};
const stateWithoutUser = {
  language: 'fi',
  user: { data: null },
};

const renderComponent = (storeOverride, authMock = {}) => {
  vi.spyOn(actionsMock, 'setLanguage').mockImplementation(() => vi.fn());

  vi.spyOn(useAuthMock, 'default').mockImplementation(() => ({
    authenticated: authMock.authenticated ?? false,
    login: authMock.login ?? vi.fn(),
    logout: authMock.logout ?? vi.fn(),
  }));

  const store = storeOverride || mockStore(defaultState);

  renderWithProviders(
    <MemoryRouter>
      <Header locale={defaultLocale} setLocale={mockSetLocale} />
    </MemoryRouter>,
    { store },
  );
};

describe('<Header />', () => {
  it('renders correctly', () => {
    renderComponent();
  });

  it('displays login button when user is not logged in', async () => {
    const store = mockStore(stateWithoutUser);

    renderComponent(store);

    // Find the button by its text content inside the span
    expect(await screen.findByText('login')).toBeInTheDocument();
  });

  it('calls login function when login button is clicked', async () => {
    const user = userEvent.setup();

    const mockLogin = vi.fn();

    const store = mockStore(stateWithoutUser);

    renderComponent(store, { login: mockLogin });

    // Find and click the button containing the login text
    const loginButton = await screen.findByText('login');
    // Get the closest button element (parent or ancestor)
    const button = loginButton.closest('button');
    await user.click(button);

    expect(mockLogin).toHaveBeenCalled();
  });

  it('calls logout function when logout button is clicked', async () => {
    const user = userEvent.setup();
    const mockLogout = vi.fn();

    renderComponent(undefined, { authenticated: true, logout: mockLogout });
    await act(async () => {
      const userButton = await screen.findByText('Mock von User');
      const userButtonElement = userButton.closest('button');
      await user.click(userButtonElement);
    });
    await act(async () => {
      const logoutButton = await screen.findByText('logout');
      const logoutButtonElement = logoutButton.closest('button');
      await user.click(logoutButtonElement);
    });

    expect(mockLogout).toHaveBeenCalled();
  });

  it('changes language when language selector is used', async () => {
    const user = userEvent.setup();

    const store = mockStore(stateWithoutUser);
    renderComponent(store);

    await user.click(await screen.findByRole('button', { name: 'English' }));

    expect(actionsMock.setLanguage).toHaveBeenCalled();
  });
});
