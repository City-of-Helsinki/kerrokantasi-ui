import React from 'react';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';
import { isIE } from 'react-device-detect';

import App from './App';
import { history } from './createStore';
import ScrollToTop from './scrollToTop';
import BrowserWarning from './views/BrowserWarning';
import { LoginProvider } from 'hds-react';
import { profiiliConfig } from './utils/userManager';

  
const loginProviderProps = {
  userManagerSettings: profiiliConfig,
  sessionPollerSettings: { pollIntervalInMs: 10000 },
  debug: true,
}

export default function getRoot(store) {
  return isIE ? (
    <BrowserWarning />
  ) : (
    <div>
      <LoginProvider {...loginProviderProps}>
        <Provider store={store}>
          <ConnectedRouter history={history}>
            <ScrollToTop>
              <App />
            </ScrollToTop>
          </ConnectedRouter>
        </Provider>
      </LoginProvider>
    </div>
  );
}
