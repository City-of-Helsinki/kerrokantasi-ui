import { sendMessageToPluginFrame } from '../pluginUtils';

describe('pluginUtils', () => {
  describe('sendMessageToPluginFrame', () => {
    let mockFrame;
    let mockContentWindow;

    beforeEach(() => {
      mockContentWindow = {
        postMessage: vi.fn(),
      };

      mockFrame = {
        src: '',
        contentWindow: mockContentWindow,
      };

      // Mock globalThis.location.href for relative URL resolution
      Object.defineProperty(globalThis, 'location', {
        value: { href: 'https://example.com/' },
        writable: true,
      });
    });

    afterEach(() => {
      vi.clearAllMocks();
    });

    describe('when frame.src is missing', () => {
      it.each(['', null, undefined])(
        'should not send message when src is %p',
        (srcValue) => {
          mockFrame.src = srcValue;

          sendMessageToPluginFrame(mockFrame, { message: 'test' });

          expect(mockContentWindow.postMessage).not.toHaveBeenCalled();
        }
      );
    });

    describe('when frame.src is provided', () => {
      it.each([
        ['https://example.com/plugin.html', 'https://example.com'],
        [
          'https://example.com/plugin.html?param=value#hash',
          'https://example.com',
        ],
        ['/assets/plugin.html', expect.any(String)],
      ])(
        'should extract origin from %p and send message',
        (src, expectedOrigin) => {
          mockFrame.src = src;
          const message = { type: 'test' };

          sendMessageToPluginFrame(mockFrame, message);

          expect(mockContentWindow.postMessage).toHaveBeenCalledWith(
            message,
            expectedOrigin
          );
        }
      );

      it.each([
        { type: 'userData' },
        'string',
        {
          geojson: { type: 'FeatureCollection', features: [] },
          comments: null,
        },
        null,
        42,
      ])('should send message %p to the iframe', (message) => {
        mockFrame.src = 'https://example.com/plugin.html';

        sendMessageToPluginFrame(mockFrame, message);

        expect(mockContentWindow.postMessage).toHaveBeenCalledWith(
          message,
          'https://example.com'
        );
      });
    });
  });
});
