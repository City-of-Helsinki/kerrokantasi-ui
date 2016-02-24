const config = {
  languages: ['fi'],
  apiBaseUrl: (typeof window !== 'undefined' ? window.API_BASE_URL : null) || 'http://localhost:8000/'
};
export default config;
