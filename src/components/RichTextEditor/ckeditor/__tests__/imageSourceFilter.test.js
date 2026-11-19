import { ClassicEditor, buildEditorConfig } from '../editorConfig';
import {
  createImageSourceFilterPlugin,
  isAllowedImageSource,
} from '../imageSourceFilter';

const API_ORIGIN = 'https://api.test';
const API_IMAGE = 'https://api.test/media/images/2026/10/abc.webp';
const EXTERNAL_IMAGE = 'https://example.com/cat.png';

describe('isAllowedImageSource', () => {
  it.each([
    'data:image/png;base64,iVBORw0KGgo=',
    'blob:https://ui.test/1234',
    API_IMAGE,
  ])('allows %s', (src) => {
    expect(isAllowedImageSource(src, API_ORIGIN)).toBe(true);
  });

  it.each([
    EXTERNAL_IMAGE,
    'http://api.test/media/image.webp',
    'data:image/svg+xml;base64,PHN2Zz4=',
    '/media/image.webp',
    '',
    undefined,
  ])('rejects %s', (src) => {
    expect(isAllowedImageSource(src, API_ORIGIN)).toBe(false);
  });
});

// Runs the real editor with the app's configuration, so these cover the
// actual conversion and not a mock of it.
describe('createImageSourceFilterPlugin', () => {
  let editor;
  let element;

  // jsdom has no layout, and the clipboard pipeline scrolls to the selection
  // after a paste.
  const rangeLayoutStubs = {
    getClientRects: () => [],
    getBoundingClientRect: () => new DOMRect(),
  };
  const addedRangeMethods = [];

  beforeAll(() => {
    Object.entries(rangeLayoutStubs).forEach(([name, stub]) => {
      if (Range.prototype[name]) return;
      Range.prototype[name] = stub;
      addedRangeMethods.push(name);
    });
  });

  afterAll(() => {
    addedRangeMethods.forEach((name) => delete Range.prototype[name]);
  });

  beforeEach(async () => {
    element = document.createElement('div');
    document.body.appendChild(element);
    editor = await ClassicEditor.create(
      element,
      buildEditorConfig({
        language: 'en',
        // An upload that never finishes, so pasted images stay placeholders.
        uploadAdapterPlugin: function PendingUploadAdapter(e) {
          e.plugins.get('FileRepository').createUploadAdapter = () => ({
            upload: () => new Promise(() => {}),
            abort: () => {},
          });
        },
        imageSourceFilterPlugin: createImageSourceFilterPlugin(API_ORIGIN),
      })
    );
  });

  afterEach(async () => {
    await editor.destroy();
    element.remove();
  });

  // What pasting, dropping and RichTextEditor's insertHtml do after the
  // clipboard pipeline: convert HTML to the model and insert it.
  const insertHtml = (html) => {
    editor.setData('<p>text</p>');
    const viewFragment = editor.data.processor.toView(html);
    editor.model.insertContent(editor.data.toModel(viewFragment));
    return editor.getData();
  };

  // A paste through the clipboard pipeline, where the upload plugin replaces
  // base64 / blob images with upload placeholders before upcast. The DOM paste
  // handler passes the pasted HTML on as `content`.
  const pasteHtml = (html) => {
    editor.setData('<p>text</p>');
    editor.editing.view.document.fire('clipboardInput', {
      method: 'paste',
      content: html,
      dataTransfer: {
        files: [],
        types: ['text/html'],
        getData: (type) => (type === 'text/html' ? html : ''),
      },
    });
  };

  const getModelImages = () =>
    Array.from(
      editor.model.createRangeIn(editor.model.document.getRoot()).getItems()
    ).filter((item) => item.is('element') && item.name.startsWith('image'));

  it('keeps pasted base64 images so that they are uploaded', () => {
    pasteHtml(
      '<p>pasted <img src="data:image/png;base64,iVBORw0KGgo="> image</p>'
    );

    const images = getModelImages();
    expect(images).toHaveLength(1);
    expect(images[0].getAttribute('uploadId')).toBeTruthy();
  });

  it('drops pasted images linked from other sites', () => {
    pasteHtml(`<p>pasted <img src="${EXTERNAL_IMAGE}"> image</p>`);

    expect(getModelImages()).toHaveLength(0);
    expect(editor.getData()).toContain('pasted');
  });

  it('drops images with an empty src that are not being uploaded', () => {
    const data = insertHtml('<img src="" uploadId="not-an-upload">');

    expect(getModelImages()).toHaveLength(0);
    expect(data).not.toContain('<img');
  });

  it('drops images linked from other sites when loading content', () => {
    editor.setData(
      `<figure class="image"><img src="${EXTERNAL_IMAGE}"></figure>` +
        `<p>before <img src="${EXTERNAL_IMAGE}"> after</p>`
    );

    const data = editor.getData();
    expect(data).not.toContain('example.com');
    expect(data).toContain('before');
    expect(data).toContain('after');
  });

  it('drops images linked from other sites when inserting HTML', () => {
    const data = insertHtml(
      `<p>a</p><img src="${EXTERNAL_IMAGE}">` +
        `<a href="https://x.example"><img src="${EXTERNAL_IMAGE}"></a>`
    );

    expect(data).not.toContain('example.com');
  });

  it('keeps images stored by the API and images waiting for upload', () => {
    editor.setData(
      `<figure class="image"><img src="${API_IMAGE}" alt="kuva"></figure>` +
        '<p><img src="data:image/png;base64,iVBORw0KGgo="></p>'
    );

    const data = editor.getData();
    expect(data).toContain(`src="${API_IMAGE}"`);
    expect(data).toContain('alt="kuva"');
    expect(data).toContain('data:image/png;base64');
  });

  it('removes srcset and sizes, which would load another image', () => {
    const data = insertHtml(
      `<img src="${API_IMAGE}" srcset="${EXTERNAL_IMAGE} 2x" sizes="100vw">`
    );

    expect(data).toContain(`src="${API_IMAGE}"`);
    expect(data).not.toContain('srcset');
    expect(data).not.toContain('sizes');
  });

  it.each([
    `background-image:url(${EXTERNAL_IMAGE})`,
    `background-image:URL(${EXTERNAL_IMAGE})`,
    `background-image:image-set("${EXTERNAL_IMAGE}" 1x)`,
    `background:no-repeat url(${EXTERNAL_IMAGE})`,
    `border-image:url(${EXTERNAL_IMAGE}) 30`,
  ])('removes image styles that could load another image: %s', (style) => {
    editor.setData(
      `<figure class="image image_resized" style="width:50%;">` +
        // Single quotes, as the image-set() value contains double quotes.
        `<img src="${API_IMAGE}" style='${style};'>` +
        '</figure>'
    );

    const data = editor.getData();
    expect(data).toContain(`src="${API_IMAGE}"`);
    expect(data).not.toContain('example.com');
    expect(data).toContain('width:50%');
  });

  it('keeps the size of a resized inline image', () => {
    editor.setData(
      `<p><img class="image_resized" src="${API_IMAGE}" style="width:120px;"></p>`
    );

    expect(editor.getData()).toContain('width:120px');
  });
});

describe('buildEditorConfig image insertion', () => {
  it('offers upload only, without inserting images by URL', () => {
    const { plugins, toolbar } = buildEditorConfig();

    expect(plugins.map((plugin) => plugin.pluginName)).not.toContain(
      'ImageInsert'
    );
    expect(toolbar.items).toContain('uploadImage');
    expect(toolbar.items).not.toContain('insertImage');
  });
});
