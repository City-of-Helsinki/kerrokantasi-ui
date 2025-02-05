import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import { thunk } from 'redux-thunk';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import Header from '../Header';
import renderWithProviders from '../../../utils/renderWithProviders';
import { mockUser } from '../../../../test-utils';
import * as useAuthMock from '../../../hooks/useAuth';

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

const defaultLocale = 'fi';
const mockSetLocale = jest.fn();

const defaultState = {
  language: defaultLocale,
  user: { data: { ...mockUser } },
};

const renderComponent = (storeOverride, authMock = {}) => {
  jest.spyOn(useAuthMock, 'default').mockImplementation(() => ({
    authenticated: authMock.authenticated ?? false,
    login: authMock.login ?? jest.fn(),
    logout: authMock.logout ?? jest.fn(),
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
    const stateWithoutUser = {
      language: 'fi',
      user: { data: null },
    };

    const store = mockStore(stateWithoutUser);

    renderComponent(store);

    expect(await screen.findByRole('button', { name: 'login' })).toBeInTheDocument();
  });

  it('calls login function when login button is clicked', async () => {
    const user = userEvent.setup();

    const stateWithoutUser = {
      language: 'fi',
      user: { data: null },
    };

    const mockLogin = jest.fn();

    const store = mockStore(stateWithoutUser);

    renderComponent(store, { login: mockLogin });

    await user.click(await screen.findByRole('button', { name: 'login' }));

    expect(mockLogin).toHaveBeenCalled();
  });

  it('calls logout function when logout button is clicked', async () => {
    const user = userEvent.setup();
    const mockLogout = jest.fn();

    renderComponent(undefined, { authenticated: true, logout: mockLogout });

    await user.click(await screen.findByRole('button', { name: 'Mock von User' }));
    await user.click(await screen.findByRole('button', { name: 'logout' }));

    expect(mockLogout).toHaveBeenCalled();
  });

  it('changes language when language selector is used', async () => {
    const user = userEvent.setup();

    renderComponent();

    await user.click(await screen.findByRole('button', { name: 'English' }));

    expect(mockSetLocale).toHaveBeenCalled();
  });
});
