/* eslint-disable import/no-unresolved */
import React, { useState } from 'react';
import { CookieConsentContextProvider, LoginProvider } from 'hds-react';
import { Provider } from 'react-redux';
import { isIE } from 'react-device-detect';
import { BrowserRouter } from 'react-router-dom';
import { IntlProvider } from 'react-intl';
import siteSettings from '@city-assets/cookieConfig.json';
import PropTypes from 'prop-types';

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

// Convert to a React component instead of a function
const Root = ({ store }) => {
  // Use state to manage locale information
  const [locale, setLocale] = useState('fi');
  
  // This function will now update state and trigger re-renders
  const changeLanguage = (language) => {
    console.debug(`Changing language to ${language}`);
    setLocale(language);
  };
  
  if (isIE) {
    return <BrowserWarning />;
  }
  
  return (
    <LoginProvider {...loginProviderProps}>
      <IntlProvider locale={locale} messages={messages[locale]}>
        <Provider store={store}>
          <CookieConsentContextProvider siteSettings={siteSettings} options={{language: locale}} >
            <BrowserRouter history={history}>
              <ScrollToTop>
                <App history={history} onChangeLanguage={changeLanguage} />
              </ScrollToTop>
            </BrowserRouter>
          </CookieConsentContextProvider>
        </Provider>
      </IntlProvider>
    </LoginProvider>
  );
};

Root.propTypes = {
  store: PropTypes.object.isRequired,
};

// Export a function that returns the Root component with the store
export default function getRoot(store) {
  return <Root store={store} />;
}
