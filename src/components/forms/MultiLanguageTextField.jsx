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

class MultiLanguageTextField extends React.Component {
  static getTextField(fieldType) {
    return TextFields[fieldType] || TextInput;
  }

  onChange(event, lang) {
    this.proxyInputEvent(event, this.props.onChange, lang);
  }

  onBlur(event, lang) {
    this.proxyInputEvent(event, this.props.onBlur, lang);
  }

  proxyInputNonEvent(newValue, handler, lang) {
    const { value } = this.props;

    if (typeof handler === 'function') {
      handler({ ...value, [lang]: newValue });
    }
  }

  proxyInputEvent(event, handler, lang) {
    const { value } = this.props;

    if (typeof handler === 'function') {
      handler({ ...value, [lang]: event.target.value });
    }
  }

  render() {
    const {
      fieldType,
      hideControls,
      languages,
      value,
      labelId,
      hint,
      required,
      richTextEditor,
      // Remove event listeners from ...rest
      onBlur, // eslint-disable-line
      onChange, // eslint-disable-line
      helperText,
      ...rest
    } = this.props;

    const TextField = MultiLanguageTextField.getTextField(fieldType);
    const requiredAsterisk = required ? '*' : '';
    return (
      <fieldset className='multi-language-text-field'>
        <legend>
          <FormattedMessage id={labelId}>{(txt) => txt + requiredAsterisk}</FormattedMessage>
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
                onChange={(newValue) => this.proxyInputNonEvent(newValue, this.props.onChange, lang)}
                onBlur={(newValue) => this.proxyInputNonEvent(newValue, this.props.onBlur, lang)}
                {...rest}
              />
            );
          }
          return (
            <TextField
              key={lang}
              value={currentValue}
              onChange={(ev) => this.onChange(ev, lang)}
              onBlur={(ev) => this.onBlur(ev, lang)}
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

MultiLanguageTextField.defaultProps = {
  fieldType: TextFieldTypes.INPUT,
  hideControls: {
    hideBlockStyleControls: false,
    hideInlineStyleControls: false,
    hideIframeControls: false,
    hideImageControls: false,
    hideSkipLinkControls: false,
    hideLinkControls: false,
  },
};

export default injectIntl(MultiLanguageTextField);
