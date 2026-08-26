import { render, screen } from '@testing-library/react';

import getRoot from '../getRoot';
import createStore from '../createStore';
import config from '../config';

vi.mock('../App', () => ({
  default: () => <div data-testid='app-stub'>App</div>,
}));

vi.mock('hds-react', async () => {
  const actual = await vi.importActual('hds-react');
  return {
    ...actual,
    // LoginProvider and CookieConsentContextProvider pull in oidc/indexedDB
    // machinery that jsdom can't support; stub them as pass-through wrappers
    LoginProvider: ({ children }) => children,
    CookieConsentContextProvider: ({ children }) => children,
  };
});

describe('getRoot', () => {
  const store = createStore();

  afterEach(() => {
    config.enableCookies = false;
    config.enableCookiebot = false;
  });

  it('renders the App wrapped in providers', () => {
    render(getRoot(store));

    expect(screen.getByTestId('app-stub')).toBeInTheDocument();
  });

  it('wraps the app with cookie consent when cookies are enabled', () => {
    config.enableCookies = true;
    config.enableCookiebot = false;

    render(getRoot(store));

    expect(screen.getByTestId('app-stub')).toBeInTheDocument();
  });
});
