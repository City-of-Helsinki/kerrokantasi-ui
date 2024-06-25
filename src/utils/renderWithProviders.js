/* eslint react/prop-types: 0 */
import React from 'react';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import { LoginProvider } from 'hds-react';
import { IntlProvider } from 'react-intl';

import createStore from "../createStore";
import { userOidcConfig, apiTokenClientConfig } from './oidcConfig';

const loginProviderConfig = {
  userManagerSettings: userOidcConfig,
  apiTokensClientSettings: apiTokenClientConfig,
  sessionPollerSettings: { pollIntervalInMs: 10000 },
}

const renderWithProviders = (
  ui,
  { preloadedState = {}, locale = 'fi', history, store = createStore(preloadedState), ...renderOptions } = {},
) => {
  const Wrapper = ({ children }) => (
    <LoginProvider {...loginProviderConfig}>
      <IntlProvider locale={locale}>
        <Provider store={store}>{children}</Provider>
      </IntlProvider>
    </LoginProvider>
  );
  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
};


export default renderWithProviders;
