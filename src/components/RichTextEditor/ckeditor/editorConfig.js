import {
  Essentials,
  Paragraph,
  Heading,
  Bold,
  Italic,
  Link,
  AutoLink,
  LinkImage,
  List,
  Image,
  ImageToolbar,
  ImageCaption,
  ImageResize,
  ImageResizeButtons,
  ImageUpload,
  FileRepository,
  GeneralHtmlSupport,
  Style,
  PasteFromOffice,
  Autoformat,
} from 'ckeditor5';
import coreTranslationsFi from 'ckeditor5/translations/fi.js';
import coreTranslationsSv from 'ckeditor5/translations/sv.js';
import coreTranslationsEn from 'ckeditor5/translations/en.js';

import isExternalLink from '../../../utils/isExternalLink';

export { ClassicEditor } from 'ckeditor5';

const TRANSLATIONS = {
  fi: coreTranslationsFi,
  sv: coreTranslationsSv,
  en: coreTranslationsEn,
};

// Fixes CKEditor's texts for the image caption button, added after its own
// translations so they win. The image and table plugins share these texts, and
// CKEditor's Finnish one is the table's ("Lisää taulukon kuvaus") and its
// Swedish one means heading ("Slå på rubrik").
const TRANSLATION_FIXES = {
  fi: {
    dictionary: {
      'Toggle caption on': 'Lisää kuvateksti',
      'Toggle caption off': 'Poista kuvateksti',
    },
  },
  sv: {
    dictionary: {
      'Toggle caption on': 'Lägg till bildtext',
      'Toggle caption off': 'Ta bort bildtext',
    },
  },
};

// The legacy Draft.js editor showed these block/style labels in Finnish for all
// locales; kept here for parity. The `lead` class is what the published hearing
// page styles against.
const LABELS = {
  paragraph: 'Kappale',
  subheading: 'Väliotsikko',
  lead: 'Korostettu kappale',
};

// Paragraph classes kept in content written with the Draft.js editor.
// `image-caption` paragraphs were its image captions; images now have their
// own caption, so the class is no longer offered in the style menu.
export const LEGACY_BLOCK_CLASSES = ['lead', 'image-caption'];

/**
 * Build the ClassicEditor configuration.
 * @param {object} opts
 * @param {string} opts.language app locale (fi | sv | en)
 * @param {string} opts.licenseKey CKEditor license key ('GPL' for the open-source build)
 * @param {Function} [opts.uploadAdapterPlugin] CKEditor plugin registering the image upload adapter
 * @param {Function} [opts.imageSourceFilterPlugin] CKEditor plugin removing images linked from other sites
 * @param {string} [opts.placeholder] editor placeholder text
 * @param {string} [opts.label] accessible name of the editing area
 */
export const buildEditorConfig = ({
  language = 'fi',
  licenseKey = 'GPL',
  uploadAdapterPlugin,
  imageSourceFilterPlugin,
  placeholder = '',
  label,
} = {}) => ({
  licenseKey,
  language,
  translations: [
    TRANSLATIONS[language] || coreTranslationsFi,
    TRANSLATION_FIXES,
  ],
  placeholder,
  // CKEditor adds the "Press Alt+0 for help" hint after this label.
  ...(label && { label }),
  plugins: [
    Essentials,
    Paragraph,
    Heading,
    Bold,
    Italic,
    Autoformat,
    Link,
    AutoLink,
    LinkImage,
    List,
    Image,
    ImageToolbar,
    ImageCaption,
    ImageResize,
    ImageResizeButtons,
    ImageUpload,
    FileRepository,
    GeneralHtmlSupport,
    Style,
    PasteFromOffice,
  ],
  extraPlugins: [uploadAdapterPlugin, imageSourceFilterPlugin].filter(Boolean),
  toolbar: {
    items: [
      'undo',
      'redo',
      '|',
      'heading',
      '|',
      'bold',
      'italic',
      '|',
      'bulletedList',
      'numberedList',
      '|',
      'link',
      // Upload only: the API does not accept images linked by URL, so no
      // ImageInsert, which would add an "Insert via URL" option.
      'uploadImage',
      '|',
      'style',
    ],
    shouldNotGroupWhenFull: true,
  },
  heading: {
    options: [
      {
        model: 'paragraph',
        title: LABELS.paragraph,
        class: 'ck-heading_paragraph',
      },
      {
        model: 'heading3',
        view: 'h3',
        title: LABELS.subheading,
        class: 'ck-heading_heading3',
      },
    ],
  },
  style: {
    definitions: [{ name: LABELS.lead, element: 'p', classes: ['lead'] }],
  },
  link: {
    addTargetToExternalLinks: false,
    // Preserve id/class on anchors (skip links) via GHS rather than stripping them.
    allowedProtocols: ['https?', 'ftp', 'mailto', 'tel', '#'],
    decorators: {
      external: {
        mode: 'automatic',
        callback: (url) => isExternalLink(url),
        attributes: {
          class: 'hds-link',
          target: '_self',
          'data-external': 'true',
        },
      },
    },
  },
  image: {
    // Images are left-aligned blocks of their own, as in the old Draft.js
    // editor: no ImageStyle plugin, so no alignment or text wrapping.
    toolbar: ['toggleImageCaption', 'imageTextAlternative', '|', 'resizeImage'],
    insert: { type: 'block' },
  },
  // GeneralHtmlSupport keeps the markup of existing hearings intact on load/save.
  htmlSupport: {
    allow: [
      { name: 'iframe', attributes: true, classes: true, styles: true },
      // No `target` here: the external link decorator sets it, and allowing it
      // in both places splits a link into two nested anchors.
      {
        name: 'a',
        attributes: ['id', 'rel', 'title', 'data-external', 'aria-label'],
        classes: true,
      },
      { name: 'p', classes: LEGACY_BLOCK_CLASSES },
      { name: 'span', classes: true, attributes: ['aria-hidden'] },
      { name: 'img', attributes: true, classes: true, styles: true },
    ],
  },
});
