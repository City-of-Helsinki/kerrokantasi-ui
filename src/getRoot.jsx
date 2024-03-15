import React from 'react';
import { Provider } from 'react-redux';
import { isIE } from 'react-device-detect';
import { LoginProvider } from 'hds-react';
import { history } from './createStore';
import App from './App';
import ScrollToTop from './scrollToTop';
import BrowserWarning from './views/BrowserWarning';
import { userOidcConfig, apiTokenClientConfig } from './utils/oidcConfig';
import { BrowserRouter } from 'react-router-dom';

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
        <BrowserRouter history={history}>
          <ScrollToTop>
            <App history={history} />
          </ScrollToTop>
        </BrowserRouter>
      </Provider>
    </LoginProvider>
  );
}
