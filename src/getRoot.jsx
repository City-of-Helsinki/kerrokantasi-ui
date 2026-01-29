import React, { useMemo, useState } from 'react';
import { CookieConsentContextProvider, LoginProvider } from 'hds-react';
import { Provider } from 'react-redux';
import { isIE } from 'react-device-detect';
import { BrowserRouter } from 'react-router-dom';
import { IntlProvider } from 'react-intl';
import PropTypes from 'prop-types';

import { history } from './createStore';
import App from './App';
import ScrollToTop from './scrollToTop';
import BrowserWarning from './views/BrowserWarning';
import { userOidcConfig, apiTokenClientConfig } from './utils/oidcConfig';
import messages from './i18n';
import MatomoTracker from './components/Matomo/MatomoTracker';
import MatomoContext from './components/Matomo/matomo-context';
import config from './config';
import useCookieConsentSettings from './hooks/useCookieConsentSettings';

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
    setLocale(language);
  };

  const matomoTracker = useMemo(
    () =>
      new MatomoTracker({
        urlBase: config.matomoUrlBase,
        siteId: config.matomoSiteId,
        srcUrl: config.matomoSrcUrl,
        enabled: config.matomoEnabled,
        configurations: {
          ...(config.matomoCookieDomain && { setCookieDomain: config.matomoCookieDomain }),
          ...(config.matomoDomains && { setDomains: config.matomoDomains.split(',') }),
          setDoNotTrack: true,
        },
      }),
    [],
  );

  const cookieConsentProps = useCookieConsentSettings(locale);

  if (isIE) {
    return <BrowserWarning />;
  }

  return (
    <LoginProvider {...loginProviderProps}>
      <IntlProvider locale={locale} messages={messages[locale]}>
        <Provider store={store}>
          <CookieConsentContextProvider {...cookieConsentProps}>
            <MatomoContext.Provider value={matomoTracker}>
              <BrowserRouter history={history}>
                <ScrollToTop>
                  <App history={history} onChangeLanguage={changeLanguage} />
                </ScrollToTop>
              </BrowserRouter>
            </MatomoContext.Provider>
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
