import React, { useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import 'ckeditor5/ckeditor5.css';

import config from '../../config';
import { getApiURL } from '../../api';
import getMessage from '../../utils/getMessage';
import { ClassicEditor, buildEditorConfig } from './ckeditor/editorConfig';
import { createUploadAdapterPlugin } from './ckeditor/uploadAdapter';
import { fromAppHtml, toAppHtml } from './ckeditor/htmlPostProcess';
import IframeModal from './Iframe/IframeModal';
import SkipLinkModal from './SkipLink/SkipLinkModal';

const buildIframeHtml = ({ title, src, width, height, scrolling, allow }) => {
  const attributes = [
    `src="${src}"`,
    title && `title="${title}"`,
    width && `width="${width}"`,
    height && `height="${height}"`,
    scrolling && `scrolling="${scrolling}"`,
    allow && `allow="${allow}"`,
  ]
    .filter(Boolean)
    .join(' ');
  return `<iframe ${attributes}></iframe>`;
};

const buildSkipLinkHtml = (text, ownId, targetId, isHidden) => {
  const className = isHidden ? ' class="hidden-link"' : '';
  return `<a href="#${targetId}" id="${ownId}"${className}>${text}</a>`;
};

const RichTextEditor = ({
  intl,
  labelId,
  value,
  onChange,
  onBlur,
  placeholderId,
}) => {
  const editorRef = useRef(null);
  const [showIframeModal, setShowIframeModal] = useState(false);
  const [showSkipLinkModal, setShowSkipLinkModal] = useState(false);

  const externalLinkMessage = intl.formatMessage({ id: 'linkLeadsToExternal' });

  // Initialise once and stay uncontrolled afterwards (matches the old editor):
  // the parent owns the value through onChange/onBlur, so re-feeding it as the
  // `data` prop would reset the editor mid-edit.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const initialData = useMemo(() => fromAppHtml(value), []);

  const editorConfig = useMemo(
    () =>
      buildEditorConfig({
        language: intl.locale,
        licenseKey: config.ckeditorLicenseKey,
        uploadAdapterPlugin: createUploadAdapterPlugin(
          getApiURL(config.imageUploadEndpoint)
        ),
        placeholder: placeholderId
          ? intl.formatMessage({ id: placeholderId })
          : '',
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [intl.locale]
  );

  const emit = (handler) => {
    const editor = editorRef.current;
    if (editor && typeof handler === 'function') {
      handler(toAppHtml(editor.getData(), externalLinkMessage));
    }
  };

  const insertHtml = (html) => {
    const editor = editorRef.current;
    if (!editor) return;
    const viewFragment = editor.data.processor.toView(html);
    const modelFragment = editor.data.toModel(viewFragment);
    editor.model.insertContent(modelFragment);
    editor.editing.view.focus();
    emit(onChange);
  };

  const handleIframeSubmit = (fields) => {
    insertHtml(buildIframeHtml(fields));
    setShowIframeModal(false);
  };

  const handleSkipLinkSubmit = (text, ownId, targetId, isHidden) => {
    insertHtml(buildSkipLinkHtml(text, ownId, targetId, isHidden));
    setShowSkipLinkModal(false);
  };

  const handleReady = (editor) => {
    editorRef.current = editor;
    // Associate the visible label with the editable region for screen readers.
    editor.editing.view.change((writer) => {
      writer.setAttribute(
        'aria-label',
        intl.formatMessage({ id: labelId }),
        editor.editing.view.document.getRoot()
      );
    });
  };

  return (
    <div className='rich-text-editor'>
      <span className='form-label'>
        <FormattedMessage id={labelId} />
      </span>
      <div className='rich-text-editor-extra-controls'>
        <button
          type='button'
          className='rich-text-editor-extra-button'
          onClick={() => setShowIframeModal(true)}
        >
          {getMessage('iframeAddButton')}
        </button>
        <button
          type='button'
          className='rich-text-editor-extra-button'
          onClick={() => setShowSkipLinkModal(true)}
        >
          {getMessage('skipLinkAddButton')}
        </button>
      </div>
      <CKEditor
        editor={ClassicEditor}
        config={editorConfig}
        data={initialData}
        onReady={handleReady}
        onChange={() => emit(onChange)}
        onBlur={() => emit(onBlur)}
      />
      <IframeModal
        isOpen={showIframeModal}
        onClose={() => setShowIframeModal(false)}
        onSubmit={handleIframeSubmit}
      />
      <SkipLinkModal
        isOpen={showSkipLinkModal}
        onClose={() => setShowSkipLinkModal(false)}
        onSubmit={handleSkipLinkSubmit}
      />
    </div>
  );
};

RichTextEditor.propTypes = {
  intl: PropTypes.object,
  labelId: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  placeholderId: PropTypes.string,
};

export default injectIntl(RichTextEditor);
