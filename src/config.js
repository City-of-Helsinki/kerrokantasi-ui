const config = {
  languages: ['fi', 'sv', 'en'],
  apiBaseUrl: (typeof window !== 'undefined' ? window.API_BASE_URL : null) || 'http://localhost:8000/'
};
export default config;
