/* eslint-disable func-names */
import fileToDataUri from '../fileToDataUri';

describe('fileToDataUri', () => {
  it('should resolve to a data URI string when file reading is successful', async () => {
    const mockFile = new Blob(['file content'], { type: 'text/plain' });
    const expectedDataUri = 'data:text/plain;base64,ZmlsZSBjb250ZW50';

    const result = await fileToDataUri(mockFile);

    expect(result).toBe(expectedDataUri);
  });

  it('should reject with an error when file reading fails', async () => {
    const mockFile = new Blob(['file content'], { type: 'text/plain' });
    const mockError = new Error('File reading failed');

    vi.spyOn(FileReader.prototype, 'readAsDataURL').mockImplementation(function () {
      this.onerror(mockError);
    });

    await expect(fileToDataUri(mockFile)).rejects.toThrow('File reading failed');
  });
});
