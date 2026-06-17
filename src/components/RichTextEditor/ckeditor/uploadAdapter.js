import compressFile from '../../../utils/images/compressFile';
import {
  MAX_IMAGE_SIZE,
  MAX_WIDTH_OR_HEIGHT,
} from '../../../utils/images/constants';
import { getApiTokenFromStorage } from '../../../api';

/**
 * CKEditor upload adapter that compresses an image to WebP client-side and
 * uploads it to the backend, then inserts the returned URL into the editor.
 *
 * This replaces the previous behaviour of embedding images as base64 data URIs
 * in the section HTML, which bloated request bodies and forced the WAF off.
 *
 * Expected backend response: `{ url: 'https://.../image.webp' }`.
 */
class KerrokantasiUploadAdapter {
  constructor(loader, uploadUrl) {
    this.loader = loader;
    this.uploadUrl = uploadUrl;
  }

  async upload() {
    const file = await this.loader.file;
    const compressed = await compressFile(
      file,
      MAX_IMAGE_SIZE,
      MAX_WIDTH_OR_HEIGHT,
      'image/webp'
    );
    return this.sendRequest(compressed, file.name);
  }

  sendRequest(file, originalName) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      this.xhr = xhr;
      xhr.open('POST', this.uploadUrl, true);
      xhr.responseType = 'json';

      const token = getApiTokenFromStorage();
      if (token) {
        xhr.setRequestHeader('Authorization', `Bearer ${token}`);
      }

      const genericError = `Couldn't upload file: ${originalName}.`;

      xhr.addEventListener('error', () => reject(genericError));
      xhr.addEventListener('abort', () => reject());
      xhr.addEventListener('load', () => {
        const { response } = xhr;
        if (!response || xhr.status >= 400 || response.error) {
          reject(response?.error?.message || genericError);
          return;
        }
        resolve({ default: response.url });
      });

      if (xhr.upload) {
        xhr.upload.addEventListener('progress', (event) => {
          if (event.lengthComputable) {
            this.loader.uploadTotal = event.total;
            this.loader.uploaded = event.loaded;
          }
        });
      }

      const webpName = originalName.replace(/\.[^.]+$/, '') + '.webp';
      const data = new FormData();
      data.append('file', file, webpName);
      xhr.send(data);
    });
  }

  abort() {
    if (this.xhr) {
      this.xhr.abort();
    }
  }
}

/**
 * Returns a CKEditor plugin (function form) that registers the upload adapter.
 * @param {string} uploadUrl absolute URL of the image upload endpoint
 */
export const createUploadAdapterPlugin = (uploadUrl) =>
  function KerrokantasiUploadAdapterPlugin(editor) {
    editor.plugins.get('FileRepository').createUploadAdapter = (loader) =>
      new KerrokantasiUploadAdapter(loader, uploadUrl);
  };

export default KerrokantasiUploadAdapter;
