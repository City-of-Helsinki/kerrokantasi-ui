import { ClassicEditor, buildEditorConfig } from '../editorConfig';

const IMAGE = 'https://api.test/media/images/2026/11/abc.webp';
const CAPTIONED_IMAGE =
  `<figure class="image"><img src="${IMAGE}">` +
  '<figcaption>Kuvateksti</figcaption></figure>';

// These rules were checked against stored Draft.js content in a real browser:
// each one, if reverted, corrupts existing hearings on the first save.
describe('buildEditorConfig html support', () => {
  const { allow } = buildEditorConfig().htmlSupport;

  it('does not allow target on links, which splits a link into two anchors', () => {
    const anchorRule = allow.find((rule) => rule.name === 'a');
    expect(anchorRule.attributes).not.toContain('target');
  });

  it('does not keep iframe wrapper divs, which are re-added on save', () => {
    expect(allow.some((rule) => rule.name === 'div')).toBe(false);
  });
});

const IMAGE_STYLE_BUTTONS = buildEditorConfig()
  .image.toolbar.filter((item) => item.startsWith('imageStyle:'))
  .map((item) => item.replace('imageStyle:', ''));

// Runs the real editor with the app's configuration.
describe('buildEditorConfig in the editor', () => {
  let editor;
  let element;

  const createEditor = async (options) => {
    editor = await ClassicEditor.create(element, buildEditorConfig(options));
  };

  const selectFirstBlock = () =>
    editor.model.change((writer) =>
      writer.setSelection(editor.model.document.getRoot().getChild(0), 'on')
    );

  beforeEach(() => {
    element = document.createElement('div');
    document.body.appendChild(element);
  });

  afterEach(async () => {
    await editor?.destroy();
    editor = undefined;
    element.remove();
  });

  it('offers left, center and right alignment, as blocks only', () => {
    expect(IMAGE_STYLE_BUTTONS).toEqual([
      'alignBlockLeft',
      'block',
      'alignBlockRight',
    ]);
  });

  it.each(IMAGE_STYLE_BUTTONS)(
    'keeps the image caption when the image style is set to %s',
    async (style) => {
      await createEditor();
      editor.setData(`${CAPTIONED_IMAGE}<p>text</p>`);
      selectFirstBlock();

      editor.execute('imageStyle', { value: style });

      expect(editor.getData()).toContain('<figcaption>Kuvateksti</figcaption>');
    }
  );

  it('inserts images as blocks, also in the middle of text', async () => {
    await createEditor();
    editor.setData('<p>before after</p>');
    editor.model.change((writer) =>
      writer.setSelection(editor.model.document.getRoot().getChild(0), 6)
    );

    editor.execute('insertImage', { source: IMAGE });

    const blocks = Array.from(editor.model.document.getRoot().getChildren());
    expect(blocks.map((block) => block.name)).toContain('imageBlock');
    expect(editor.getData()).toContain(
      `<figure class="image"><img src="${IMAGE}">`
    );
  });

  it('still loads inline and side images in existing content', async () => {
    await createEditor();
    const data =
      `<p>text <img src="${IMAGE}"> text</p>` +
      `<figure class="image image-style-side"><img src="${IMAGE}"></figure>`;

    editor.setData(data);

    expect(editor.getData()).toBe(data);
  });

  it('gives the editing area the label and the keyboard help hint', async () => {
    await createEditor({ language: 'en', label: 'Section content' });

    const ariaLabel = editor.ui.getEditableElement().getAttribute('aria-label');
    expect(ariaLabel).toContain('Section content');
    expect(ariaLabel).toContain('Alt+0');
  });
});
