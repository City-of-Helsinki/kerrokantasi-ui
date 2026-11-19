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

// Styles an image keeps: the sizing CKEditor writes itself (ImageResize,
// ImageSizeAttributes). Everything else is dropped, because many properties
// can load an image (background, border-image, list-style, mask, ...) in
// many forms (url(), URL(), image-set("..."), ...).
const KEPT_STYLES = new Set([
  'width',
  'height',
  'aspect-ratio',
  'max-width',
  'max-height',
  'min-width',
  'min-height',
]);

const getDroppedStyles = (img) =>
  Array.from(img.getStyleNames()).filter(
    (name) => !KEPT_STYLES.has(name.toLowerCase())
  );

// A pasted or dropped base64 / blob image that CKEditor is uploading: the
// upload plugin clears its src and links it to an upload loader before
// upcast. The src is set to the API URL once the upload finishes.
const isUploadPlaceholder = (img, editor) => {
  const uploadId = img.getAttribute('uploadId');
  if (img.getAttribute('src') !== '' || !uploadId) return false;
  if (!editor.plugins.has('FileRepository')) return false;
  return Boolean(editor.plugins.get('FileRepository').loaders.get(uploadId));
};

// Upcast listener for <img>. Consuming the whole element leaves nothing for the
// image converters, so the image is dropped; consuming attributes or styles
// drops just those.
const createImgUpcastFilter =
  (allowedOrigin, editor) =>
  (evt, { viewItem: img }, { consumable }) => {
    if (
      !isAllowedImageSource(img.getAttribute('src'), allowedOrigin) &&
      !isUploadPlaceholder(img, editor)
    ) {
      consumable.consume(img, { name: true });
      return;
    }

    const attributes = getExtraSourceAttributes(img);
    const styles = getDroppedStyles(img);
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
 * Disallowed images are dropped, except images CKEditor is uploading. Allowed
 * images lose srcset / sizes and all styles except sizing, which could
 * otherwise load another image.
 * @param {string} allowedOrigin origin of the API serving uploaded images
 */
export const createImageSourceFilterPlugin = (allowedOrigin) =>
  function ImageSourceFilterPlugin(editor) {
    const filterImg = createImgUpcastFilter(allowedOrigin, editor);
    editor.conversion.for('upcast').add((dispatcher) => {
      // Before the image and General HTML Support converters.
      dispatcher.on('element:img', filterImg, { priority: 'highest' });
    });
  };
