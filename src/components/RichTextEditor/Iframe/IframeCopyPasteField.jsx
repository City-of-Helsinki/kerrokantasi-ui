import React, { useState } from 'react';
import PropTypes from 'prop-types';

import getMessage from '../../../utils/getMessage';
import {
  parseIframeHtml,
  convertStyleDimensionSettings,
} from '../../../utils/iframeUtils';

const IframeCopyPasteField = ({ updateAttributes }) => {
  const [htmlCopyPaste, setHtmlCopyPaste] = useState('');

  const handleCopyPasteChange = (event) => {
    const { value } = event.target;
    setHtmlCopyPaste(value);
    // if iframe has width and/or height in the style attribute
    // convert the dimensions into their own attributes
    updateAttributes(convertStyleDimensionSettings(parseIframeHtml(value)));
  };

  return (
    <div className='input-container html-copy-paste-input'>
      <label htmlFor='iframe-html-copy-paste'>
        {getMessage('iframeHtmlCopyPaste')}
      </label>
      <textarea
        id='iframe-html-copy-paste'
        name='htmlCopyPaste'
        className='form-control'
        onChange={handleCopyPasteChange}
        value={htmlCopyPaste}
      />
    </div>
  );
};

IframeCopyPasteField.propTypes = {
  updateAttributes: PropTypes.func,
};

export default IframeCopyPasteField;
