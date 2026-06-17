import {
  ClassicEditor,
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
  ImageStyle,
  ImageResize,
  ImageResizeButtons,
  ImageUpload,
  ImageInsert,
  ImageInsertViaUrl,
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

export { ClassicEditor };

const TRANSLATIONS = {
  fi: coreTranslationsFi,
  sv: coreTranslationsSv,
  en: coreTranslationsEn,
};

// The legacy Draft.js editor showed these block/style labels in Finnish for all
// locales; kept here for parity. The matching CSS classes (`lead`, `image-caption`)
// are what the published hearing page styles against.
const LABELS = {
  paragraph: 'Kappale',
  subheading: 'Väliotsikko',
  lead: 'Korostettu kappale',
  imageCaption: 'Kuvateksti',
};

export const LEGACY_BLOCK_CLASSES = ['lead', 'image-caption'];

/**
 * Build the ClassicEditor configuration.
 * @param {object} opts
 * @param {string} opts.language app locale (fi | sv | en)
 * @param {string} opts.licenseKey CKEditor license key ('GPL' for the open-source build)
 * @param {Function} [opts.uploadAdapterPlugin] CKEditor plugin registering the image upload adapter
 * @param {string} [opts.placeholder] editor placeholder text
 */
export const buildEditorConfig = ({
  language = 'fi',
  licenseKey = 'GPL',
  uploadAdapterPlugin,
  placeholder = '',
} = {}) => ({
  licenseKey,
  language,
  translations: [TRANSLATIONS[language] || coreTranslationsFi],
  placeholder,
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
    ImageStyle,
    ImageResize,
    ImageResizeButtons,
    ImageUpload,
    ImageInsert,
    ImageInsertViaUrl,
    FileRepository,
    GeneralHtmlSupport,
    Style,
    PasteFromOffice,
  ],
  extraPlugins: uploadAdapterPlugin ? [uploadAdapterPlugin] : [],
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
      'insertImage',
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
    definitions: [
      { name: LABELS.lead, element: 'p', classes: ['lead'] },
      { name: LABELS.imageCaption, element: 'p', classes: ['image-caption'] },
    ],
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
    toolbar: [
      'toggleImageCaption',
      'imageTextAlternative',
      '|',
      'imageStyle:inline',
      'imageStyle:block',
      'imageStyle:side',
      '|',
      'resizeImage',
    ],
    insert: { type: 'auto' },
  },
  // GeneralHtmlSupport keeps the markup of existing hearings intact on load/save.
  htmlSupport: {
    allow: [
      { name: 'iframe', attributes: true, classes: true, styles: true },
      {
        name: 'a',
        attributes: [
          'id',
          'rel',
          'title',
          'target',
          'data-external',
          'aria-label',
        ],
        classes: true,
      },
      { name: 'p', classes: LEGACY_BLOCK_CLASSES },
      { name: 'div', classes: ['iframe-wrapper'] },
      { name: 'span', classes: true, attributes: ['aria-hidden'] },
      { name: 'img', attributes: true, classes: true, styles: true },
    ],
  },
});
