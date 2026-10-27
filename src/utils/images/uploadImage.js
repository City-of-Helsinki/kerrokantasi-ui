import compressFile from './compressFile';
import { MAX_IMAGE_SIZE, MAX_WIDTH_OR_HEIGHT } from './constants';

// Backend endpoint for both section-level and inline (CKEditor) images.
export const IMAGE_UPLOAD_ENDPOINT = '/v1/image/';

const toWebpName = (name) => `${name.replace(/\.[^.]+$/, '')}.webp`;

/**
 * Compress an image to WebP and build the multipart body for an image upload.
 * @param {File} file image selected or pasted by the user
 * @param {string} purpose one of SECTION_IMAGE_PURPOSE
 * @returns {Promise<FormData>}
 */
export const buildImageUploadData = async (file, purpose) => {
  const compressed = await compressFile(
    file,
    MAX_IMAGE_SIZE,
    MAX_WIDTH_OR_HEIGHT,
    'image/webp'
  );
  const data = new FormData();
  data.append('image', compressed, toWebpName(file.name));
  data.append('purpose', purpose);
  return data;
};

/**
 * Localization key for a failed image upload.
 * @param {number} [status] HTTP status of the response, if one was received
 * @returns {string}
 */
export const getImageUploadErrorKey = (status) => {
  if (status === 413) return 'imageUploadTooLarge';
  if (status === 401 || status === 403) return 'imageUploadNotAllowed';
  return 'imageFileUploadError';
};
