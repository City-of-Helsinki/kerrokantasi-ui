import React from 'react';
import PropTypes from 'prop-types';
import {injectIntl, FormattedMessage} from 'react-intl';
import TextInput from './TextInput';
import TextArea from './TextArea';
import RichTextEditor from '../RichTextEditor';

export const TextFieldTypes = {
  INPUT: 'input',
  TEXTAREA: 'textarea'
};

const TextFields = {
  [TextFieldTypes.INPUT]: TextInput,
  [TextFieldTypes.TEXTAREA]: TextArea
};

class MultiLanguageTextField extends React.Component {
  static getTextField(fieldType) {
    return TextFields[fieldType] || TextInput;
  }

  proxyInputEvent(event, handler, lang) {
    const {value} = this.props;

    if (typeof handler === 'function') {
      handler(Object.assign({}, value, {[lang]: event.target.value}));
    }
  }

  proxyInputNonEvent(newValue, handler, lang) {
    const {value} = this.props;

    if (typeof handler === 'function') {
      handler(Object.assign({}, value, {[lang]: newValue}));
    }
  }

  onChange(event, lang) {
    this.proxyInputEvent(event, this.props.onChange, lang);
  }

  onBlur(event, lang) {
    this.proxyInputEvent(event, this.props.onBlur, lang);
  }

  render() {
    const {
      fieldType,
      languages,
      value,
      labelId,
      required,
      richTextEditor,
      sectionId,
      // Remove event listeners from ...rest
      onBlur, // eslint-disable-line
      onChange, // eslint-disable-line
      showLabel,
      label,
      ...rest
    } = this.props;

    const TextField = MultiLanguageTextField.getTextField(fieldType);

    return (
      <fieldset className="multi-language-text-field">
        <legend>
          <FormattedMessage id={labelId}/>
          {required ? '*' : ''}
        </legend>
        {languages.map((lang) => {
          const currentValue = value[lang];
          if (richTextEditor) {
            return (
              <RichTextEditor
                key={lang}
                labelId={`inLanguage-${lang}`}
                value={currentValue}
                sectionId={sectionId}
                onChange={(newValue) => this.proxyInputNonEvent(newValue, this.props.onChange, lang)}
                onBlur={(newValue) => this.proxyInputNonEvent(newValue, this.props.onBlur, lang)}
                {...rest}
              />
            );
          }
          return (
            <TextField
              key={lang}
              label={label}
              showLabel={showLabel}
              value={currentValue}
              onChange={(ev) => this.onChange(ev, lang)}
              onBlur={(ev) => this.onBlur(ev, lang)}
              labelId={`inLanguage-${lang}`}
              required={required}
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
  labelId: PropTypes.string,
  languages: PropTypes.arrayOf(PropTypes.string),
  onBlur: PropTypes.func,
  onChange: PropTypes.func,
  required: PropTypes.bool,
  richTextEditor: PropTypes.bool,
  placeholderId: PropTypes.string,
  value: PropTypes.object, // TODO: create shape
  showLabel: PropTypes.bool,
  label: PropTypes.string
};

MultiLanguageTextField.defaultProps = {
  fieldType: TextFieldTypes.INPUT
};

export default injectIntl(MultiLanguageTextField);
