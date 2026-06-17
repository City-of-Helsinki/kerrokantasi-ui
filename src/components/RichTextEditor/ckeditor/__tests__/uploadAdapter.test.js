import KerrokantasiUploadAdapter, {
  createUploadAdapterPlugin,
} from '../uploadAdapter';

vi.mock('../../../../utils/images/compressFile', () => ({
  default: vi.fn(async (file) => file),
}));

vi.mock('../../../../api', () => ({
  getApiTokenFromStorage: vi.fn(() => 'test-token'),
}));

const UPLOAD_URL = 'https://api.test/v1/image/';

class MockXHR {
  constructor() {
    this.upload = { addEventListener: vi.fn() };
    this.listeners = {};
    this.requestHeaders = {};
  }

  open(method, url) {
    this.method = method;
    this.url = url;
  }

  setRequestHeader(key, value) {
    this.requestHeaders[key] = value;
  }

  addEventListener(type, cb) {
    this.listeners[type] = cb;
  }

  send(body) {
    this.body = body;
    this.status = MockXHR.status;
    this.response = MockXHR.response;
    queueMicrotask(() => this.listeners.load && this.listeners.load());
  }

  abort() {
    this.listeners.abort && this.listeners.abort();
  }
}
MockXHR.status = 200;
MockXHR.response = { url: 'https://api.test/media/image.webp' };

const makeLoader = () => ({
  file: Promise.resolve(new File(['x'], 'photo.png', { type: 'image/png' })),
});

describe('KerrokantasiUploadAdapter', () => {
  let originalXHR;

  beforeEach(() => {
    originalXHR = global.XMLHttpRequest;
    global.XMLHttpRequest = MockXHR;
    MockXHR.status = 200;
    MockXHR.response = { url: 'https://api.test/media/image.webp' };
  });

  afterEach(() => {
    global.XMLHttpRequest = originalXHR;
    vi.clearAllMocks();
  });

  it('uploads with auth header and resolves with the returned url', async () => {
    const adapter = new KerrokantasiUploadAdapter(makeLoader(), UPLOAD_URL);

    const result = await adapter.upload();

    expect(result).toEqual({ default: 'https://api.test/media/image.webp' });
    expect(adapter.xhr.method).toBe('POST');
    expect(adapter.xhr.url).toBe(UPLOAD_URL);
    expect(adapter.xhr.requestHeaders.Authorization).toBe('Bearer test-token');
    expect(adapter.xhr.body).toBeInstanceOf(FormData);
  });

  it('rejects on a server error status', async () => {
    MockXHR.status = 500;
    MockXHR.response = { error: { message: 'boom' } };
    const adapter = new KerrokantasiUploadAdapter(makeLoader(), UPLOAD_URL);

    await expect(adapter.upload()).rejects.toBe('boom');
  });

  it('registers an adapter factory on FileRepository', () => {
    const fileRepository = {};
    const editor = { plugins: { get: () => fileRepository } };

    createUploadAdapterPlugin(UPLOAD_URL)(editor);

    expect(typeof fileRepository.createUploadAdapter).toBe('function');
    expect(fileRepository.createUploadAdapter(makeLoader())).toBeInstanceOf(
      KerrokantasiUploadAdapter
    );
  });
});
