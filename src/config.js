import pluginMap from './shared_config.json';

const config = {
  pluginMap,
  languages: ['fi', 'sv', 'en'],
  activeLanguage: 'fi',
  publicUrl: (typeof window !== 'undefined' ? window.PUBLIC_URL : null) || 'http://localhost:8086/',
  apiBaseUrl: (typeof window !== 'undefined' ? window.API_BASE_URL : null) || 'http://localhost:8000/',
  uiConfig: typeof window !== 'undefined' ? window.UI_CONFIG : null,
  openIdClientId: typeof window !== 'undefined' ? window.OPENID_CLIENT_ID : null,
  openIdAudience: typeof window !== 'undefined' ? window.OPENID_AUDIENCE : null,
  openIdAuthority: typeof window !== 'undefined' ? window.OPENID_AUTHORITY : null,
  openIdApiTokenUrl: typeof window !== 'undefined' ? window.OPENID_APITOKEN_URL : null,
  heroImageURL: (typeof window !== 'undefined' ? window.HERO_IMAGE_URL : null)
    || 'http://materialbank.myhelsinki.fi/detail/1192/download/7',
  showAccessibilityInfo: typeof window !== 'undefined' ? window.SHOW_ACCESSIBILITY_INFO : false,
  showSocialMediaSharing: typeof window !== 'undefined' ? window.SHOW_SOCIAL_MEDIA_SHARING : true,
  enableHighContrast: typeof window !== 'undefined' ? window.ENABLE_HIGHCONTRAST : false,
  enableCookies: typeof window !== 'undefined' ? window.ENABLE_COOKIES : false,
  matomoCookieDomain: typeof window !== 'undefined' ? window.MATOMO_COOKIE_DOMAIN : '',
  matomoDomains: typeof window !== 'undefined' ? window.MATOMO_DOMAINS : [],
  matomoSiteId: typeof window !== 'undefined' ? window.MATOMO_SITE_ID : '',
  matomoScriptUrl: typeof window !== 'undefined' ? window.MATOMO_SCRIPT_URL : '',
  matomoScriptFilename: typeof window !== 'undefined' ? window.MATOMO_SCRIPT_FILENAME : '',
  enableCookiebot: typeof window !== 'undefined' ? window.ENABLE_COOKIEBOT : false,
  cookiebotDataCbid: typeof window !== 'undefined' ? window.COOKIEBOT_DATA_CBID : null,
  enableStrongAuth: typeof window !== 'undefined' ? window.ENABLE_STRONG_AUTH : false,
  adminHelpUrl: typeof window !== 'undefined' ? window.ADMIN_HELP_URL : "",
  emptyCommentString: typeof window !== 'undefined' ? window.EMPTY_COMMENT_STRING : "",
};

export default config;
