/* eslint-disable sonarjs/todo-tag */
import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, FormattedMessage } from 'react-intl';

import TextInput from './TextInput';
import TextArea from './TextArea';
import RichTextEditor from '../RichTextEditor';
import { textEditorHideControlsShape } from '../../types';

export const TextFieldTypes = {
  INPUT: 'input',
  TEXTAREA: 'textarea',
};

const TextFields = {
  [TextFieldTypes.INPUT]: TextInput,
  [TextFieldTypes.TEXTAREA]: TextArea,
};

const getTextField = (fieldType) => TextFields[fieldType] || TextInput;

const DEFAULT_HIDE_CONTROLS = {
  hideBlockStyleControls: false,
  hideInlineStyleControls: false,
  hideIframeControls: false,
  hideImageControls: false,
  hideSkipLinkControls: false,
  hideLinkControls: false,
};

function MultiLanguageTextField({
  fieldType = TextFieldTypes.INPUT,
  hideControls = DEFAULT_HIDE_CONTROLS,
  languages,
  value,
  labelId,
  hint,
  required,
  richTextEditor,
  // Remove event listeners from ...rest
  onBlur,
  onChange,
  helperText,
  ...rest
}) {
  const proxyInputNonEvent = (newValue, handler, lang) => {
    if (typeof handler === 'function') {
      handler({ ...value, [lang]: newValue });
    }
  };

  const proxyInputEvent = (event, handler, lang) => {
    if (typeof handler === 'function') {
      handler({ ...value, [lang]: event.target.value });
    }
  };

  const TextField = getTextField(fieldType);
  const requiredAsterisk = required ? '*' : '';
  return (
    <fieldset className='multi-language-text-field'>
      <legend>
        <FormattedMessage id={labelId}>
          {(txt) => txt + requiredAsterisk}
        </FormattedMessage>
      </legend>
      {languages.map((lang) => {
        const currentValue = value[lang];
        if (richTextEditor) {
          return (
            <RichTextEditor
              hideControls={hideControls}
              key={lang}
              labelId={`inLanguage-${lang}`}
              value={currentValue}
              onChange={(newValue) =>
                proxyInputNonEvent(newValue, onChange, lang)
              }
              onBlur={(newValue) => proxyInputNonEvent(newValue, onBlur, lang)}
              {...rest}
            />
          );
        }
        return (
          <TextField
            key={lang}
            value={currentValue}
            onChange={(ev) => proxyInputEvent(ev, onChange, lang)}
            onBlur={(ev) => proxyInputEvent(ev, onBlur, lang)}
            labelId={`inLanguage-${lang}`}
            hint={hint}
            required={required}
            helperText={helperText}
            {...rest}
          />
        );
      })}
    </fieldset>
  );
}

MultiLanguageTextField.propTypes = {
  defaultValue: PropTypes.object, // TODO: create shape! {'fi': ..., 'sv': ..., 'en': ...}
  fieldType: PropTypes.string,
  hideControls: textEditorHideControlsShape,
  labelId: PropTypes.string,
  hint: PropTypes.object,
  languages: PropTypes.arrayOf(PropTypes.string),
  onBlur: PropTypes.func,
  onChange: PropTypes.func,
  required: PropTypes.bool,
  richTextEditor: PropTypes.bool,
  placeholderId: PropTypes.string,
  helperText: PropTypes.string,
  value: PropTypes.object, // TODO: create shape
};

export default injectIntl(MultiLanguageTextField);
