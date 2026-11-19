// Same check CKEditor's ImageUploadEditing uses to decide which pasted images it
// uploads through the upload adapter.
const UPLOADABLE_SOURCE = /^(data:image\/\w+;base64,|blob:)/;

/**
 * Whether an image may stay in the editor content.
 * Allowed are images CKEditor uploads itself (base64 / blob sources) and images
 * already stored by our API, e.g. copied from another hearing. The API rejects
 * content that links images from anywhere else.
 * @param {string} src image src attribute
 * @param {string} allowedOrigin origin of the API serving uploaded images
 * @returns {boolean}
 */
export const isAllowedImageSource = (src, allowedOrigin) => {
  if (!src) return false;
  if (UPLOADABLE_SOURCE.test(src)) return true;
  try {
    return new URL(src, window.location.href).origin === allowedOrigin;
  } catch {
    return false;
  }
};

// Attributes that would load an image from a URL other than src. Uploaded
// images only ever get a src, so nothing the app creates is lost.
const EXTRA_SOURCE_ATTRIBUTES = ['srcset', 'sizes'];

const getExtraSourceAttributes = (img) =>
  EXTRA_SOURCE_ATTRIBUTES.filter((name) => img.hasAttribute(name));

const getUrlStyles = (img) =>
  Array.from(img.getStyleNames()).filter((name) =>
    img.getStyle(name)?.includes('url(')
  );

// Upcast listener for <img>. Consuming the whole element leaves nothing for the
// image converters, so the image is dropped; consuming attributes or styles
// drops just those.
const createImgUpcastFilter =
  (allowedOrigin) =>
  (evt, { viewItem: img }, { consumable }) => {
    if (!isAllowedImageSource(img.getAttribute('src'), allowedOrigin)) {
      consumable.consume(img, { name: true });
      return;
    }

    const attributes = getExtraSourceAttributes(img);
    const styles = getUrlStyles(img);
    if (attributes.length || styles.length) {
      consumable.consume(img, { attributes, styles });
    }
  };

/**
 * Returns a CKEditor plugin (function form) that keeps images linked from other
 * sites out of the editor content.
 *
 * It hooks into upcast, which every way of getting HTML into the editor goes
 * through: loading stored content, pasting, dropping and inserting HTML.
 * Disallowed images are dropped. Allowed images lose srcset / sizes and any
 * style that loads a URL (e.g. background-image), which would otherwise load
 * another image.
 * @param {string} allowedOrigin origin of the API serving uploaded images
 */
export const createImageSourceFilterPlugin = (allowedOrigin) => {
  const filterImg = createImgUpcastFilter(allowedOrigin);
  return function ImageSourceFilterPlugin(editor) {
    editor.conversion.for('upcast').add((dispatcher) => {
      // Before the image and General HTML Support converters.
      dispatcher.on('element:img', filterImg, { priority: 'highest' });
    });
  };
};
