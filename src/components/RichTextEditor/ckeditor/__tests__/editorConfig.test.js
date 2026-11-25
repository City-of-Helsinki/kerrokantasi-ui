import { ClassicEditor, buildEditorConfig } from '../editorConfig';

const IMAGE = 'https://api.test/media/images/2026/11/abc.webp';

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

// Runs the real editor with the app's configuration.
describe('buildEditorConfig in the editor', () => {
  let editor;
  let element;

  const createEditor = async (options) => {
    editor = await ClassicEditor.create(element, buildEditorConfig(options));
  };

  beforeEach(() => {
    element = document.createElement('div');
    document.body.appendChild(element);
  });

  afterEach(async () => {
    await editor?.destroy();
    editor = undefined;
    element.remove();
  });

  it('offers no image alignment, as the old Draft.js editor', async () => {
    await createEditor();

    expect(editor.plugins.has('ImageStyle')).toBe(false);
    expect(buildEditorConfig().image.toolbar).toEqual([
      'toggleImageCaption',
      'imageTextAlternative',
      '|',
      'resizeImage',
    ]);
  });

  it('offers only the lead paragraph style, as images have their own caption', () => {
    expect(buildEditorConfig().style.definitions).toEqual([
      { name: 'Korostettu kappale', element: 'p', classes: ['lead'] },
    ]);
  });

  it('keeps image caption paragraphs written with the Draft.js editor', async () => {
    await createEditor();
    const data =
      '<p class="lead">Lead</p><p class="image-caption">Kuvateksti</p>';

    editor.setData(data);

    expect(editor.getData()).toBe(data);
  });

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

  it.each([
    ['fi', 'Lisää kuvateksti', 'Poista kuvateksti', 'Syötä kuvateksti'],
    ['sv', 'Lägg till bildtext', 'Ta bort bildtext', 'Fyll i bildtext'],
    ['en', 'Toggle caption on', 'Toggle caption off', 'Enter image caption'],
  ])(
    'labels the image caption button correctly in %s',
    async (language, addLabel, removeLabel, captionPlaceholder) => {
      await createEditor({ language });
      editor.setData(`<figure class="image"><img src="${IMAGE}"></figure>`);
      editor.model.change((writer) =>
        writer.setSelection(editor.model.document.getRoot().getChild(0), 'on')
      );
      const button = editor.ui.componentFactory.create('toggleImageCaption');

      expect(button.label).toBe(addLabel);
      editor.execute('toggleImageCaption');
      expect(button.label).toBe(removeLabel);
      // CKEditor's other texts are still used.
      expect(editor.t('Enter image caption')).toBe(captionPlaceholder);
    }
  );

  it('gives the editing area the label and the keyboard help hint', async () => {
    await createEditor({ language: 'en', label: 'Section content' });

    const ariaLabel = editor.ui.getEditableElement().getAttribute('aria-label');
    expect(ariaLabel).toContain('Section content');
    expect(ariaLabel).toContain('Alt+0');
  });
});
