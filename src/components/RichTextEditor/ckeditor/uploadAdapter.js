import { getApiTokenFromStorage } from '../../../api';
import { SECTION_IMAGE_PURPOSE } from '../../../constants';
import getMessage from '../../../utils/getMessage';
import {
  buildImageUploadData,
  getImageUploadErrorKey,
} from '../../../utils/images/uploadImage';

/**
 * CKEditor upload adapter that compresses an image to WebP client-side and
 * uploads it to the backend as an inline image, then inserts the returned URL
 * into the editor. The backend attaches the image to the section when the
 * section is saved with the URL in its content.
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
    let data;
    try {
      data = await buildImageUploadData(file, SECTION_IMAGE_PURPOSE.INLINE);
    } catch {
      throw getMessage(getImageUploadErrorKey());
    }
    return this.sendRequest(data);
  }

  sendRequest(data) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      this.xhr = xhr;
      xhr.open('POST', this.uploadUrl, true);
      xhr.responseType = 'json';

      const token = getApiTokenFromStorage();
      if (token) {
        xhr.setRequestHeader('Authorization', `Bearer ${token}`);
      }

      // CKEditor shows the rejection reason to the user.
      xhr.addEventListener('error', () =>
        reject(getMessage(getImageUploadErrorKey()))
      );
      xhr.addEventListener('abort', () => reject());
      xhr.addEventListener('load', () => {
        const { response } = xhr;
        if (xhr.status >= 400 || !response?.url) {
          reject(getMessage(getImageUploadErrorKey(xhr.status)));
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
