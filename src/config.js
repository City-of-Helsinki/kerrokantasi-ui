import { pluginMap } from './shared_config.json';

const config = {
  pluginMap,
  languages: ['fi', 'sv', 'en'],
  activeLanguage: 'fi',
  apiBaseUrl: (typeof window !== 'undefined' ? window.API_BASE_URL : null) || 'http://localhost:8000/',
  uiConfig: typeof window !== 'undefined' ? window.UI_CONFIG : null,
  heroImageURL: (typeof window !== 'undefined' ? window.HERO_IMAGE_URL : null)
    || 'http://materialbank.myhelsinki.fi/detail/1192/download/7',
  showAccessibilityInfo: typeof window !== 'undefined' ? window.SHOW_ACCESSIBILITY_INFO : false,
  showSocialMediaSharing: typeof window !== 'undefined' ? window.SHOW_SOCIAL_MEDIA_SHARING : true,
};

export default config;
