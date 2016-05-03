const config = {
  languages: ['fi'],
  apiBaseUrl: (typeof window !== 'undefined' ? window.API_BASE_URL : null) || 'http://localhost:8000/',
  uiConfig: (typeof window !== 'undefined' ? window.UI_CONFIG : null) || null
};
export default config;
