/* eslint-disable no-underscore-dangle */
import pluginMap from './shared_config.json';

const config = {
  pluginMap,
  languages: ['fi', 'sv', 'en'],
  activeLanguage: 'fi',
  apiBaseUrl: window._env_.REACT_APP_KERROKANTASI_API_BASE,
  uiConfig: window._env_.REACT_APP_UI_CONFIG,
  openIdClientId: window._env_.REACT_APP_OPENID_CLIENT_ID,
  openIdAudience: window._env_.REACT_APP_OPENID_AUDIENCE,
  openIdAuthority: window._env_.REACT_APP_OPENID_AUTHORITY,
  openIdApiTokenUrl: window._env_.REACT_APP_OPENID_APITOKEN_URL,
  openIdScope: window._env_.REACT_APP_OPENID_SCOPE,
  heroImageURL: (window._env_.REACT_APP_HERO_IMAGE_URL)
    || 'http://materialbank.myhelsinki.fi/detail/1192/download/7',
  showAccessibilityInfo: window._env_.REACT_APP_SHOW_ACCESSIBILITY_INFO === 'true',
  showSocialMediaSharing: window._env_.REACT_APP_SHOW_SOCIAL_MEDIA_SHARING === 'true',
  enableCookies: window._env_.REACT_APP_ENABLE_COOKIES === 'true',
  matomoCookieDomain: window._env_.REACT_APP_MATOMO_COOKIE_DOMAIN,
  matomoDomains: window._env_.REACT_APP_MATOMO_DOMAINS,
  matomoSiteId: window._env_.REACT_APP_MATOMO_SITE_ID,
  matomoScriptUrl: window._env_.REACT_APP_MATOMO_SCRIPT_URL,
  matomoScriptFilename: window._env_.REACT_APP_MATOMO_SCRIPT_FILENAME,
  enableCookiebot: window._env_.REACT_APP_ENABLE_COOKIEBOT === 'true',
  cookiebotDataCbid: window._env_.REACT_APP_COOKIEBOT_DATA_CBID,
  enableStrongAuth: window._env_.REACT_APP_ENABLE_STRONG_AUTH === 'true',
  adminHelpUrl: window._env_.REACT_APP_ADMIN_HELP_URL,
  emptyCommentString: window._env_.REACT_APP_EMPTY_COMMENT_STRING,
  maintenanceShowNotification: window._env_.REACT_APP_MAINTENANCE_SHOW_NOTIFICATION === 'true',
  maintenanceDisableLogin: window._env_.REACT_APP_MAINTENANCE_DISABLE_LOGIN === 'true',
  maintenanceDisableComments: window._env_.REACT_APP_MAINTENANCE_DISABLE_COMMENTS === 'true',
};

export default config;
