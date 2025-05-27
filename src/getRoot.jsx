/* eslint-disable import/no-unresolved */
import React from 'react';
import { CookieConsentContextProvider, LoginProvider } from 'hds-react';
import { Provider } from 'react-redux';
import { isIE } from 'react-device-detect';
import { BrowserRouter } from 'react-router-dom';
import siteSettings from '@city-assets/cookieConfig.json';

import { history } from './createStore';
import App from './App';
import ScrollToTop from './scrollToTop';
import BrowserWarning from './views/BrowserWarning';
import { userOidcConfig, apiTokenClientConfig } from './utils/oidcConfig';

const loginProviderProps = {
  userManagerSettings: userOidcConfig,
  apiTokensClientSettings: apiTokenClientConfig,
  sessionPollerSettings: { pollIntervalInMs: 10000 },
};

export default function getRoot(store) {
  return isIE ? (
    <BrowserWarning />
  ) : (
    <LoginProvider {...loginProviderProps}>
      <Provider store={store}>
        <CookieConsentContextProvider siteSettings={siteSettings}>
          <BrowserRouter history={history}>
            <ScrollToTop>
              <App history={history} />
            </ScrollToTop>
          </BrowserRouter>
        </CookieConsentContextProvider>
      </Provider>
    </LoginProvider>
  );
}
