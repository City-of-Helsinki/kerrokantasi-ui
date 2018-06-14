const config = {
  languages: ['fi', 'sv', 'en'],
  activeLanguage: 'fi',
  apiBaseUrl: (typeof window !== 'undefined' ? window.API_BASE_URL : null) || 'http://localhost:8000/',
  uiConfig: typeof window !== 'undefined' ? window.UI_CONFIG : null,
  heroImageURL: (typeof window !== 'undefined' ? window.HERO_IMAGE_URL : null) || 'http://materialbank.myhelsinki.fi/detail/1192/download/7',
};
export default config;
