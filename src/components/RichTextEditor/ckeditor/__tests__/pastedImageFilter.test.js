import { HtmlDataProcessor, StylesProcessor, ViewDocument } from 'ckeditor5';

import {
  createPastedImageFilterPlugin,
  isAllowedPastedImageSource,
} from '../pastedImageFilter';

const API_ORIGIN = 'https://api.test';

describe('isAllowedPastedImageSource', () => {
  it.each([
    'data:image/png;base64,iVBORw0KGgo=',
    'blob:https://ui.test/1234',
    'https://api.test/media/images/2026/10/abc.webp',
  ])('allows %s', (src) => {
    expect(isAllowedPastedImageSource(src, API_ORIGIN)).toBe(true);
  });

  it.each([
    'https://example.com/image.png',
    'http://api.test/media/image.webp',
    'data:image/svg+xml;base64,PHN2Zz4=',
    '/media/image.webp',
    '',
    undefined,
  ])('rejects %s', (src) => {
    expect(isAllowedPastedImageSource(src, API_ORIGIN)).toBe(false);
  });
});

describe('createPastedImageFilterPlugin', () => {
  const setup = () => {
    const viewDocument = new ViewDocument(new StylesProcessor());
    const processor = new HtmlDataProcessor(viewDocument);
    let listener;
    let options;
    const editor = {
      plugins: {
        get: () => ({
          on: (event, callback, opts) => {
            listener = callback;
            options = opts;
          },
        }),
      },
      editing: {
        view: {
          document: viewDocument,
          createRangeIn: (element) => ({
            *[Symbol.iterator]() {
              const walk = function* walk(node) {
                for (const child of node.getChildren()) {
                  yield { item: child };
                  if (child.is('element')) yield* walk(child);
                }
              };
              yield* walk(element);
            },
          }),
        },
      },
    };
    createPastedImageFilterPlugin(API_ORIGIN)(editor);

    const paste = (html) => {
      const data = { content: processor.toView(html) };
      listener({}, data);
      return processor.toData(data.content);
    };

    return { paste, options };
  };

  it('removes images hotlinked from other sites and keeps the rest', () => {
    const { paste } = setup();

    const result = paste(
      '<p>Text <img src="https://example.com/a.png"></p>' +
        '<p><img src="https://api.test/media/b.webp"></p>' +
        '<p><img src="data:image/png;base64,iVBORw0KGgo="></p>'
    );

    expect(result).not.toContain('example.com');
    expect(result).toContain('Text');
    expect(result).toContain('https://api.test/media/b.webp');
    expect(result).toContain('data:image/png;base64');
  });

  it('runs before the image upload plugin', () => {
    const { options } = setup();
    expect(options).toEqual({ priority: 'high' });
  });
});
