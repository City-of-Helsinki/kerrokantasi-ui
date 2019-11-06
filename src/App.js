import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {FormattedMessage, IntlProvider} from 'react-intl';
import messages from './i18n';
import Helmet from 'react-helmet';
import Header from './components/Header';
import Footer from './components/Footer';
import {fetchApiToken} from './actions';
import config from './config';
import Routes from './routes';
import {withRouter} from 'react-router-dom';
import {ToastContainer} from 'react-toastify';
import {checkHeadlessParam} from './utils/urlQuery';
// eslint-disable-next-line import/no-unresolved
import urls from '@city-assets/urls.json';

class App extends React.Component {
  getChildContext() {
    return {
      language: this.props.language,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.oidc.user && !nextProps.apitoken.apiToken && !nextProps.apitoken.isFetching) {
      nextProps.fetchApiToken(nextProps.oidc.user.access_token);
    }
  }

  componentDidMount() {
    config.activeLanguage = this.props.language; // for non react-intl localizations
  }

  render() {
    const locale = this.props.language;
    const favlinks = [
      {rel: 'apple-touch-icon', sizes: '180x180', href: '/favicon/apple-touch-icon.png'},
      {rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon/favicon-32x32.png'},
      {rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon/favicon-16x16.png'},
      {rel: 'manifest', href: '/favicon/manifest.json'},
      {rel: 'mask-icon', href: '/favicon/safari-pinned-tab.svg', color: '#0072c6'},
      {rel: 'shortcut icon', type: 'image/x-icon', href: '/favicon/favicon.ico'},
    ];
    const favmeta = [
      {name: 'msapplication-config', content: '/favicon/browserconfig.xml'},
      {name: 'theme-color', content: '#ffffff'},
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
    return (
      <IntlProvider locale={locale} messages={messages[locale] || {}}>
        <div>
          <a href="#main-container" className="skip-to-main-content">
            <FormattedMessage id="skipToMainContent" />
          </a>
          <Helmet
            titleTemplate="%s - Kerrokantasi"
            link={favlinks}
            meta={favmeta}
            script={[{src: urls.analytics, type: 'text/javascript'}]}
          >
            <html lang={locale} />
          </Helmet>
          {header}
          <main className={fullscreen ? 'fullscreen' : 'main-content'} id="main-container" role="main" tabIndex="-1">
            <Routes />
          </main>
          <Footer language={locale} />
          <ToastContainer
            bodyClassName={
              {
                padding: '7px 7px 7px 12px',
                fontFamily: fonts,
              }
            }
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
};
App.childContextTypes = {
  language: PropTypes.string,
};
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
