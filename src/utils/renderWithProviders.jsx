/* eslint react/prop-types: 0 */
import React from 'react';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import { LoginProvider } from 'hds-react';
import { IntlProvider } from 'react-intl';
import { HelmetProvider } from 'react-helmet-async';

import createStore from '../createStore'; // Add missing import statement
import { userOidcConfig, apiTokenClientConfig } from './oidcConfig';

const loginProviderConfig = {
  userManagerSettings: userOidcConfig,
  apiTokensClientSettings: apiTokenClientConfig,
  sessionPollerSettings: { pollIntervalInMs: 10000 },
};

const renderWithProviders = (
  ui,
  {
    preloadedState = {},
    locale = 'fi',
    store = createStore(preloadedState),
    ...renderOptions
  } = {}
) => {
  const Wrapper = ({ children }) => (
    <HelmetProvider>
      <LoginProvider {...loginProviderConfig}>
        <IntlProvider locale={locale}>
          <Provider store={store}>{children}</Provider>
        </IntlProvider>
      </LoginProvider>
    </HelmetProvider>
  );
  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
};

export default renderWithProviders;
