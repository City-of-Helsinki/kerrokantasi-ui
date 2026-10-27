import compressFile from '../compressFile';
import {
  IMAGE_UPLOAD_ENDPOINT,
  buildImageUploadData,
  getImageUploadErrorKey,
} from '../uploadImage';

vi.mock('../compressFile', () => ({
  default: vi.fn(async (file) => file),
}));

describe('uploadImage', () => {
  it('uses the backend image endpoint', () => {
    expect(IMAGE_UPLOAD_ENDPOINT).toBe('/v1/image/');
  });

  it('compresses the image to WebP and builds the upload body', async () => {
    const file = new File(['x'], 'my.photo.JPG', { type: 'image/jpeg' });

    const data = await buildImageUploadData(file, 'inline');

    expect(compressFile).toHaveBeenCalledWith(file, 1, 960, 'image/webp');
    expect(data.get('image').name).toBe('my.photo.webp');
    expect(data.get('purpose')).toBe('inline');
  });

  it.each([
    [413, 'imageUploadTooLarge'],
    [401, 'imageUploadNotAllowed'],
    [403, 'imageUploadNotAllowed'],
    [400, 'imageFileUploadError'],
    [500, 'imageFileUploadError'],
    [undefined, 'imageFileUploadError'],
  ])('maps status %s to %s', (status, key) => {
    expect(getImageUploadErrorKey(status)).toBe(key);
  });
});
