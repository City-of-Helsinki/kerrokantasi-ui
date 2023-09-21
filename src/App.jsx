/* eslint-disable react/no-unused-prop-types */
/* eslint-disable react/forbid-prop-types */
/* eslint-disable camelcase */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage, IntlProvider } from 'react-intl';
import Helmet from 'react-helmet';
import { withRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import classNames from 'classnames';
import { HashLink } from 'react-router-hash-link';

import messages from './i18n';
import Header from './components/Header';
import Footer from './components/Footer';
import { fetchApiToken } from './actions';
import config from './config';
import Routes from './routes';
import { checkHeadlessParam } from './utils/urlQuery';
import CookieBar from './components/CookieBar/CookieBar';
import MaintenanceNotification from './components/MaintenanceNotification';
import { getCookieScripts, checkCookieConsent, cookieOnComponentWillUnmount } from './utils/cookieUtils';
import { isCookiebotEnabled, getCookieBotConsentScripts } from './utils/cookiebotUtils';

class App extends React.Component {
  getChildContext() {
    return {
      language: this.props.language,
    };
  }

  componentDidMount() {
    config.activeLanguage = this.props.language; // for non react-intl localizations

    getCookieScripts();

    if (config.enableCookies) {
      checkCookieConsent();
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.oidc.user && nextProps.oidc.user !== this.props.oidc.user && !nextProps.apitoken.isFetching) {
      nextProps.fetchApiToken();
    }
  }

  componentWillUnmount() {
    cookieOnComponentWillUnmount();
  }

  render() {
    const locale = this.props.language;
    const contrastClass = classNames({ 'high-contrast': this.props.isHighContrast });
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
    const fullscreen = this.props.match.params.fullscreen === 'true';
    const headless = checkHeadlessParam(this.props.location.search);
    const fonts = `"HelsinkiGrotesk",
      Arial, -apple-system,
      BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen",
      "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif`;

    let header = null;
    if (!fullscreen && !headless) {
      header = <Header slim={this.props.history.location.pathname !== '/'} history={this.props.history} />;
    }
    const mainContainerId = 'main-container';
    const skipTo = `${this.props.location.pathname}${this.props.location.search}#${mainContainerId}`;
    return (
      <IntlProvider locale={locale} messages={messages[locale] || {}}>
        <div className={contrastClass}>
          {config.enableCookies && !isCookiebotEnabled() && <CookieBar language={locale} />}
          <HashLink className='skip-to-main-content' to={skipTo}>
            <FormattedMessage id='skipToMainContent' />
          </HashLink>
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
}

const mapStateToProps = (state) => ({
  oidc: state.oidc,
  language: state.language,
  apitoken: state.apitoken,
  isHighContrast: state.accessibility.isHighContrast,
});

const mapDispatchToProps = (dispatch) => ({
  fetchApiToken: (accessToken) => {
    dispatch(fetchApiToken(accessToken));
  },
});

App.propTypes = {
  history: PropTypes.object,
  match: PropTypes.object,
  language: PropTypes.string,
  location: PropTypes.object,
  apitoken: PropTypes.any,
  oidc: PropTypes.any,
  dispatch: PropTypes.func,
  fetchApiToken: PropTypes.func,
  isHighContrast: PropTypes.bool,
};
App.childContextTypes = {
  language: PropTypes.string,
};
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
