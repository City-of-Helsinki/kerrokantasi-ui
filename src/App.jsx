/* eslint-disable react/no-unused-prop-types */
/* eslint-disable react/forbid-prop-types */
/* eslint-disable camelcase */
import React, { useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage, IntlProvider } from 'react-intl';
import Helmet from 'react-helmet';
import { withRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import classNames from 'classnames';
import { useApiTokens } from 'hds-react';

import messages from './i18n';
import Header from './components/Header/Header';
import Footer from './components/Footer';
import InternalLink from './components/InternalLink';
import config from './config';
import Routes from './routes';
import { checkHeadlessParam } from './utils/urlQuery';
import CookieBar from './components/CookieBar/CookieBar';
import MaintenanceNotification from './components/MaintenanceNotification';
import { getCookieScripts, checkCookieConsent, cookieOnComponentWillUnmount } from './utils/cookieUtils';
import { isCookiebotEnabled, getCookieBotConsentScripts } from './utils/cookiebotUtils';
import useAuthHook from './hooks/useAuth';  
import { setOidcUser, setApiToken } from './actions';
import { getUser } from './selectors/user';

function App({
  language,
  isHighContrast,
  location,
  history,
  match,
  ...props
}) {
  const { user, dispatchSetOidcUser, dispatchSetApiToken} = props;
  getCookieScripts();
  if (config.enableCookies) {
    checkCookieConsent();
  }
  const { authenticated, user: oidcUser, logout } = useAuthHook();
  const { getStoredApiTokens } = useApiTokens();
  const [intervalSet, setIntervalSet] = useState(false);

  const storeApiToken = useCallback(() => {
    const tmpToken = getStoredApiTokens().filter(token => token);
    try {
      dispatchSetApiToken(tmpToken);
    } catch (e) {
      logout();
    }
  }, [dispatchSetApiToken, getStoredApiTokens, logout]);

  useEffect(() => {
    config.activeLanguage = language; // for non react-intl localizations
    return () => {
      cookieOnComponentWillUnmount();
    }
  }, [language]);

  useEffect(() => { 
    if (!intervalSet && user) {
      setInterval(storeApiToken, 1000 * 60);
      setIntervalSet(true);
    }
  }, [intervalSet, user, storeApiToken])

  useEffect(() => {
    if (!user && authenticated) {
      try {
        dispatchSetOidcUser(oidcUser);
        storeApiToken();
      } catch (e) {
        logout();
      }
    }
  }, [user, authenticated, dispatchSetOidcUser, oidcUser, logout, storeApiToken]);

  const locale = language;
  const contrastClass = classNames({ 'high-contrast': isHighContrast });
  const favlinks = [
    { rel: 'apple-touch-icon', sizes: '180x180', href: '/favicon/apple-touch-icon.png' },
    { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon/favicon-32x32.png' },
    { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon/favicon-16x16.png' },
    { rel: 'manifest', href: '/favicon/manifest.json' },
    { rel: 'mask-icon', href: '/favicon/safari-pinned-tab.svg', color: '#0072c6' },
    { rel: 'shortcut icon', type: 'image/x-icon', href: '/favicon/favicon.ico' },
  ];
  const favmeta = [
    { name: 'msapplication-config', content: '/favicon/browserconfig.xml' },
    { name: 'theme-color', content: '#ffffff' },
  ];
  const fullscreen = match.params.fullscreen === 'true';
  const headless = checkHeadlessParam(location.search);
  const fonts = `"HelsinkiGrotesk",
    Arial, -apple-system,
    BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen",
    "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif`;

  let header = null;
  if (!fullscreen && !headless) {
    header = <Header slim={history.location.pathname !== '/'} history={history} />;
  }
  const mainContainerId = 'main-container';
  return (
    <IntlProvider locale={locale} messages={messages[locale] || {}}>
      <div className={contrastClass}>
        {config.enableCookies && !isCookiebotEnabled() && <CookieBar language={locale} />}
        <InternalLink className='skip-to-main-content' destinationId={mainContainerId}>
          <FormattedMessage id='skipToMainContent' />
        </InternalLink>
        <Helmet titleTemplate='%s - Kerrokantasi' link={favlinks} meta={favmeta}>
          <html lang={locale} />
          {isCookiebotEnabled() && getCookieBotConsentScripts()}
        </Helmet>
        {header}
        {config.maintenanceShowNotification && <MaintenanceNotification />}
        <main
          className={fullscreen ? 'fullscreen' : classNames('main-content', { headless })}
          id={mainContainerId}
          role='main'
          tabIndex='-1'
        >
          <Routes />
        </main>
        <Footer language={locale} />
        <ToastContainer
          bodyClassName={{
            padding: '7px 7px 7px 12px',
            fontFamily: fonts,
          }}
        />
      </div>
    </IntlProvider>
  );
}

const mapStateToProps = (state) => ({
  language: state.language,
  isHighContrast: state.accessibility.isHighContrast,
  user: getUser(state),
});

const mapDispatchToProps = (dispatch) => ({
    dispatchSetOidcUser: (user) => dispatch(setOidcUser(user)),
    dispatchSetApiToken: (token) => dispatch(setApiToken(token)),
  })

App.propTypes = {
  history: PropTypes.object,
  match: PropTypes.object,
  language: PropTypes.string,
  location: PropTypes.object,
  isHighContrast: PropTypes.bool,
  user: PropTypes.object,
  dispatchSetApiToken: PropTypes.func,
  dispatchSetOidcUser: PropTypes.func,
};
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
