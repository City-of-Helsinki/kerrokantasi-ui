import {
  getApiTokenFromStorage,
  isApiTokenExpired,
  storeApiTokenToStorage,
  getBaseApiURL,
  getApiURL,
  apiCall,
  jsonRequest,
  post,
  put,
  patch,
  apiDelete,
  get,
  getAllFromEndpoint,
} from '../api';

vi.mock('../config', async () => ({
  default: {
    apiBaseUrl: 'http://example.com/api',
    openIdAudience: 'test-audience',
  },
}));

describe('api.js', () => {
  const storageKey = 'hds_login_api_token_storage_key';

  beforeEach(() => {
    fetch.resetMocks();

    sessionStorage.clear();
  });

  describe('getApiTokenFromStorage', () => {
    it('should return the token from storage if it exists', () => {
      const token = 'test-token';
      sessionStorage.setItem(storageKey, JSON.stringify({ 'test-audience': token }));
      expect(getApiTokenFromStorage()).toBe(token);
    });

    it('should return null if no token exists in storage', () => {
      expect(getApiTokenFromStorage()).toBeNull();
    });
  });

  describe('isApiTokenExpired', () => {
    it('should return false if the token exists in storage', () => {
      const token = 'test-token';
      sessionStorage.setItem(storageKey, JSON.stringify({ 'test-audience': token }));
      expect(isApiTokenExpired()).toBe(false);
    });

    it('should return true if no token exists in storage', () => {
      expect(isApiTokenExpired()).toBe(true);
    });
  });

  describe('storeApiTokenToStorage', () => {
    it('should store the token in sessionStorage', () => {
      const token = 'test-token';
      storeApiTokenToStorage(token);
      expect(JSON.parse(sessionStorage.getItem(storageKey))).toEqual({ 'test-audience': token });
    });
  });

  describe('getBaseApiURL', () => {
    it('should return the base URL without trailing slash', () => {
      expect(getBaseApiURL('http://example.com/')).toBe('http://example.com');
    });

    it('should return the base URL as is if no trailing slash', () => {
      expect(getBaseApiURL('http://example.com')).toBe('http://example.com');
    });
  });

  describe('getApiURL', () => {
    it('should return the full API URL with endpoint', () => {
      expect(getApiURL('test-endpoint')).toBe('http://example.com/api/test-endpoint/');
    });

    it('should append query parameters to the URL', () => {
      expect(getApiURL('test-endpoint', { param1: 'value1' })).toBe(
        'http://example.com/api/test-endpoint/?param1=value1',
      );
    });

    it('should throw an error if there is a double query string', () => {
      expect(() => getApiURL('test-endpoint?existing=query', { param1: 'value1' })).toThrow('Double query string');
    });
  });

  describe('apiCall', () => {
    it('should make a GET request with default options', async () => {
      fetch.mockResolvedValue({ status: 200, json: vi.fn().mockResolvedValue({}) });
      await apiCall('test-endpoint');

      expect(fetch).toHaveBeenCalledWith(
        'http://example.com/api/test-endpoint/',
        expect.objectContaining({ method: 'GET', credentials: 'include' }),
      );
    });

    it('should include Authorization header if token exists', async () => {
      const token = 'test-token';
      sessionStorage.setItem(storageKey, JSON.stringify({ 'test-audience': token }));
      fetch.mockResolvedValue({ status: 200, json: vi.fn().mockResolvedValue({}) });
      await apiCall('test-endpoint');
      expect(fetch).toHaveBeenCalledWith(
        'http://example.com/api/test-endpoint/',
        expect.objectContaining({ headers: expect.objectContaining({ Authorization: `Bearer ${token}` }) }),
      );
    });
  });

  describe('jsonRequest', () => {
    it('should make a JSON request with the given method', async () => {
      fetch.mockResolvedValue({ status: 200, json: vi.fn().mockResolvedValue({}) });
      await jsonRequest('POST', 'test-endpoint', { key: 'value' });
      expect(fetch).toHaveBeenCalledWith(
        'http://example.com/api/test-endpoint/?',
        expect.objectContaining({ method: 'POST', body: JSON.stringify({ key: 'value' }) }),
      );
    });
  });

  describe('HTTP Methods', () => {
    it('should make a POST request', async () => {
      fetch.mockResolvedValue({ status: 200, json: vi.fn().mockResolvedValue({}) });
      await post('test-endpoint', { key: 'value' });
      expect(fetch).toHaveBeenCalledWith(
        'http://example.com/api/test-endpoint/?',
        expect.objectContaining({ method: 'POST', body: JSON.stringify({ key: 'value' }) }),
      );
    });

    it('should make a PUT request', async () => {
      fetch.mockResolvedValue({ status: 200, json: vi.fn().mockResolvedValue({}) });
      await put('test-endpoint', { key: 'value' });
      expect(fetch).toHaveBeenCalledWith(
        'http://example.com/api/test-endpoint/?',
        expect.objectContaining({ method: 'PUT', body: JSON.stringify({ key: 'value' }) }),
      );
    });

    it('should make a PATCH request', async () => {
      fetch.mockResolvedValue({ status: 200, json: vi.fn().mockResolvedValue({}) });
      await patch('test-endpoint', { key: 'value' });
      expect(fetch).toHaveBeenCalledWith(
        'http://example.com/api/test-endpoint/?',
        expect.objectContaining({ method: 'PATCH', body: JSON.stringify({ key: 'value' }) }),
      );
    });

    it('should make a DELETE request', async () => {
      fetch.mockResolvedValue({ status: 200, json: vi.fn().mockResolvedValue({}) });
      await apiDelete('test-endpoint');
      expect(fetch).toHaveBeenCalledWith(
        'http://example.com/api/test-endpoint/?',
        expect.objectContaining({ method: 'DELETE' }),
      );
    });

    it('should make a GET request', async () => {
      fetch.mockResolvedValue({ status: 200, json: vi.fn().mockResolvedValue({}) });
      await get('test-endpoint');
      expect(fetch).toHaveBeenCalledWith(
        'http://example.com/api/test-endpoint/?',
        expect.objectContaining({ method: 'GET' }),
      );
    });
  });

  describe('getAllFromEndpoint', () => {
    it('should fetch all paginated results', async () => {
      const firstPage = { results: [{ id: 1 }], next: 'http://example.com/api/test-endpoint/?page=2' };
      const secondPage = { results: [{ id: 2 }], next: null };
      fetch.mockResolvedValueOnce({ status: 200, json: vi.fn().mockResolvedValue(firstPage) });
      fetch.mockResolvedValueOnce({ status: 200, json: vi.fn().mockResolvedValue(secondPage) });

      const results = await getAllFromEndpoint('test-endpoint');
      expect(results).toEqual([{ id: 1 }, { id: 2 }]);
    });
  });
});
