import React, {PropTypes} from 'react';
import {injectIntl, FormattedMessage} from 'react-intl';
import TextInput from './TextInput';
import TextArea from './TextArea';

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
      // Remove event listeners from ...rest
      onBlur, // eslint-disable-line
      onChange, // eslint-disable-line
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
          return (
            <TextField
              key={lang}
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
  value: PropTypes.object, // TODO: create shape
};

MultiLanguageTextField.defaultProps = {
  fieldType: TextFieldTypes.INPUT
};

export default injectIntl(MultiLanguageTextField);
