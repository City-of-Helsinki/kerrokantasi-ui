import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage, useIntl } from 'react-intl';
import Helmet from 'react-helmet';
import classNames from 'classnames';
import { useApiTokens, CookieBanner } from 'hds-react';
import { useLocation, useParams } from 'react-router-dom';

import Header from './components/Header/Header';
import Footer from './components/Footer';
import InternalLink from './components/InternalLink';
import config from './config';
import Routes from './routes';
import { checkHeadlessParam } from './utils/urlQuery';
import MaintenanceNotification from './components/MaintenanceNotification';
import { getCookieScripts, checkCookieConsent, cookieOnComponentWillUnmount } from './utils/cookieUtils';
import { isCookiebotEnabled, getCookieBotConsentScripts } from './utils/cookiebotUtils';
import useAuthHook from './hooks/useAuth';
import { setOidcUser } from './actions';
import getUser from './selectors/user';
import enrichUserData from './actions/user';
import Toast from './components/Toast';

function App({ isHighContrast, history, ...props }) {
  const { user, dispatchSetOidcUser, dispatchEnrichUser, onChangeLanguage } = props;
  const { fullscreen } = useParams();
  const location = useLocation();
  const { locale } = useIntl();

  getCookieScripts();
  if (config.enableCookies) {
    checkCookieConsent();
  }
  const { authenticated, user: oidcUser, logout } = useAuthHook();
  const { getStoredApiTokens } = useApiTokens();
  getStoredApiTokens();

  useEffect(() => {
    config.activeLanguage = locale; // for non react-intl localizations
    
    return () => {
      cookieOnComponentWillUnmount();
    };
  }, [locale]);

  useEffect(() => {
    if (!user && authenticated) {
      try {
        dispatchSetOidcUser(oidcUser);
        dispatchEnrichUser();
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error(e);

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
    header = <Header slim={location.pathname !== '/'} onChangeLanguage={onChangeLanguage} history={history}  />;
  }
  const mainContainerId = 'main-container';
  return (
    <div className={contrastClass}>
      {config.enableCookies && !isCookiebotEnabled() && <CookieBanner />}
      <InternalLink className='skip-to-main-content' destinationId={mainContainerId}>
        <FormattedMessage id='skipToMainContent' />
      </InternalLink>
      <Helmet titleTemplate='%s - Kerrokantasi' link={favlinks} meta={favmeta}>
        <html lang={locale} />
        {isCookiebotEnabled() && getCookieBotConsentScripts()}
      </Helmet>
      {header}
      <MaintenanceNotification language={locale} />
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
  );
}

const mapStateToProps = (state) => ({
  isHighContrast: state.accessibility.isHighContrast,
  user: getUser(state),
});

const mapDispatchToProps = (dispatch) => ({
  dispatchSetOidcUser: (user) => dispatch(setOidcUser(user)),
  dispatchEnrichUser: () => dispatch(enrichUserData()),
});

App.propTypes = {
  history: PropTypes.object,
  location: PropTypes.object,
  isHighContrast: PropTypes.bool,
  user: PropTypes.object,
  dispatchEnrichUser: PropTypes.func,
  dispatchSetOidcUser: PropTypes.func,
  onChangeLanguage: PropTypes.func,
};
export default connect(mapStateToProps, mapDispatchToProps)(App);
