import { UpcastWriter } from 'ckeditor5';

// Same check CKEditor's ImageUploadEditing uses to decide which pasted images it
// uploads through the upload adapter.
const UPLOADABLE_SOURCE = /^(data:image\/\w+;base64,|blob:)/;

/**
 * Whether a pasted or dropped image may stay in the content.
 * Allowed are images CKEditor uploads itself (base64 / blob sources) and images
 * already stored by our API, e.g. copied from another hearing. Anything else
 * would hotlink an external site, which the old Draft.js editor did not allow.
 * @param {string} src image src attribute
 * @param {string} allowedOrigin origin of the API serving uploaded images
 * @returns {boolean}
 */
export const isAllowedPastedImageSource = (src, allowedOrigin) => {
  if (!src) return false;
  if (UPLOADABLE_SOURCE.test(src)) return true;
  try {
    return new URL(src, window.location.href).origin === allowedOrigin;
  } catch {
    return false;
  }
};

/**
 * Returns a CKEditor plugin (function form) that removes disallowed images from
 * pasted and dropped content before it is inserted.
 * @param {string} allowedOrigin origin of the API serving uploaded images
 */
export const createPastedImageFilterPlugin = (allowedOrigin) =>
  function PastedImageFilterPlugin(editor) {
    editor.plugins.get('ClipboardPipeline').on(
      'inputTransformation',
      (evt, data) => {
        const images = Array.from(
          editor.editing.view.createRangeIn(data.content)
        )
          .map(({ item }) => item)
          .filter(
            (item) =>
              item.is('element', 'img') &&
              !isAllowedPastedImageSource(
                item.getAttribute('src'),
                allowedOrigin
              )
          );
        if (!images.length) return;

        const writer = new UpcastWriter(editor.editing.view.document);
        images.forEach((image) => writer.remove(image));
      },
      // Run before ImageUploadEditing picks up base64 / blob images for upload.
      { priority: 'high' }
    );
  };
