import React from 'react';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';
import { isIE } from 'react-device-detect';
import { LoginProvider } from 'hds-react';

import App from './App';
import { history } from './createStore';
import ScrollToTop from './scrollToTop';
import BrowserWarning from './views/BrowserWarning';
import { userOidcConfig, apiTokenClientConfig } from './utils/oidcConfig';

  
const loginProviderProps = {
  userManagerSettings: userOidcConfig,
  apiTokensClientSettings: apiTokenClientConfig,
  sessionPollerSettings: { pollIntervalInMs: 10000 }, 
}

export default function getRoot(store) {
  return isIE ? (
    <BrowserWarning />
  ) : (
    <LoginProvider {...loginProviderProps}>
      <Provider store={store}>
        <ConnectedRouter history={history}>
          <ScrollToTop>
            <App />
          </ScrollToTop>
        </ConnectedRouter>
      </Provider>
    </LoginProvider>
  );
}
