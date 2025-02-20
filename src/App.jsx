/* eslint-disable react/forbid-prop-types */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage, IntlProvider } from 'react-intl';
import Helmet from 'react-helmet';
import classNames from 'classnames';
import { useApiTokens } from 'hds-react';
import { useLocation, useParams } from 'react-router-dom';

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
import { setOidcUser } from './actions';
import getUser from './selectors/user';
import enrichUserData from './actions/user';
import Toast from './components/Toast';

function App({ language, isHighContrast, history, ...props }) {
  const { user, dispatchSetOidcUser, dispatchEnrichUser } = props;
  const { fullscreen } = useParams();
  const location = useLocation();

  getCookieScripts();
  if (config.enableCookies) {
    checkCookieConsent();
  }
  const { authenticated, user: oidcUser, logout } = useAuthHook();
  const { getStoredApiTokens } = useApiTokens();
  getStoredApiTokens();

  useEffect(() => {
    config.activeLanguage = language; // for non react-intl localizations
    return () => {
      cookieOnComponentWillUnmount();
    };
  }, [language]);

  useEffect(() => {
    if (!user && authenticated) {
      try {
        dispatchSetOidcUser(oidcUser);
        dispatchEnrichUser();
      } catch (e) {
        logout();
      }
    }
  }, [user, authenticated, dispatchSetOidcUser, oidcUser, logout, dispatchEnrichUser]);
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
  const headless = checkHeadlessParam(location.search);

  let header = null;
  if (!fullscreen && !headless) {
    header = <Header slim={location.pathname !== '/'} history={history} />;
  }
  const mainContainerId = 'main-container';
  return (
    <IntlProvider locale={language} messages={messages[language] || {}}>
      <div className={contrastClass}>
        {config.enableCookies && !isCookiebotEnabled() && <CookieBar />}
        <InternalLink className='skip-to-main-content' destinationId={mainContainerId}>
          <FormattedMessage id='skipToMainContent' />
        </InternalLink>
        <Helmet titleTemplate='%s - Kerrokantasi' link={favlinks} meta={favmeta}>
          <html lang={language} />
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
        <Footer />
        <Toast />
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
  dispatchEnrichUser: () => dispatch(enrichUserData()),
});

App.propTypes = {
  history: PropTypes.object,
  language: PropTypes.string,
  location: PropTypes.object,
  isHighContrast: PropTypes.bool,
  user: PropTypes.object,
  dispatchEnrichUser: PropTypes.func,
  dispatchSetOidcUser: PropTypes.func,
};
export default connect(mapStateToProps, mapDispatchToProps)(App);
