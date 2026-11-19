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

  beforeEach(async () => {
    element = document.createElement('div');
    document.body.appendChild(element);
    editor = await ClassicEditor.create(
      element,
      buildEditorConfig({
        language: 'en',
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

  it('removes styles that load a URL and keeps the image size', () => {
    editor.setData(
      `<figure class="image image_resized" style="width:50%;">` +
        `<img src="${API_IMAGE}" style="background-image:url(${EXTERNAL_IMAGE});">` +
        '</figure>'
    );

    const data = editor.getData();
    expect(data).toContain(`src="${API_IMAGE}"`);
    expect(data).not.toContain('example.com');
    expect(data).toContain('width:50%');
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
