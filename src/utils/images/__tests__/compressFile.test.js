import { describe, it, expect, vi } from 'vitest';
import imageCompression from 'browser-image-compression';

import compressFile from '../compressFile';
import { MAX_IMAGE_SIZE, MAX_WIDTH_OR_HEIGHT } from '../constants';

vi.mock('browser-image-compression', () => {
  return {
    default: vi.fn().mockImplementation((file, options) => {
      return Promise.resolve({
        ...file,
        size: file.size * 0.5, // Simulate compression by halving the file size
        compressedWith: options
      });
    })
  };
});

describe('compressFile', () => {
  it('should call imageCompression with the correct parameters', async () => {
    const mockFile = new File(['mock content'], 'test-image.jpg', { type: 'image/jpeg' });
    const maxSizeMB = MAX_IMAGE_SIZE;
    const maxWidthOrHeight = MAX_WIDTH_OR_HEIGHT;
    const fileType = 'image/webp';

    const result = await compressFile(mockFile, maxSizeMB, maxWidthOrHeight, fileType);

    expect(imageCompression).toHaveBeenCalledWith(mockFile, {
      maxSizeMB,
      fileType,
      maxWidthOrHeight
    });

    expect(result).toBeDefined();
    expect(result.size).toBeLessThan(mockFile.size);
    expect(result.compressedWith).toEqual({
      maxSizeMB,
      fileType,
      maxWidthOrHeight
    });
  });

  it('should handle errors from the compression library', async () => {
    const mockFile = new File(['mock content'], 'test-image.jpg', { type: 'image/jpeg' });
    const compressionError = new Error('Compression failed');

    imageCompression.mockImplementationOnce(() => Promise.reject(compressionError));

    await expect(compressFile(mockFile, 1, 960, 'image/webp')).rejects.toThrow('Compression failed');
  });
});
