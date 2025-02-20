import React from 'react';
import { Provider } from 'react-redux';
import { isIE } from 'react-device-detect';
import { LoginProvider } from 'hds-react';
import { BrowserRouter } from 'react-router-dom';
import { IntlProvider } from 'react-intl';

import { history } from './createStore';
import App from './App';
import ScrollToTop from './scrollToTop';
import BrowserWarning from './views/BrowserWarning';
import { userOidcConfig, apiTokenClientConfig } from './utils/oidcConfig';
import messages from './i18n';

const loginProviderProps = {
  userManagerSettings: userOidcConfig,
  apiTokensClientSettings: apiTokenClientConfig,
  sessionPollerSettings: { pollIntervalInMs: 10000 },
};

const locale = 'fi';

export default function getRoot(store) {
  return isIE ? (
    <BrowserWarning />
  ) : (
    <LoginProvider {...loginProviderProps}>
      <Provider store={store}>
        <IntlProvider locale={locale} language={locale} messages={messages[locale] || {}}>
          <BrowserRouter history={history}>
            <ScrollToTop>
              <App history={history} />
            </ScrollToTop>
          </BrowserRouter>
        </IntlProvider>
      </Provider>
    </LoginProvider>
  );
}
