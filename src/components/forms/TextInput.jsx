/* eslint-disable react/forbid-prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';
import { TextInput as HDSTextInput } from 'hds-react';

/*
 * Text Input component with basic validation support.
 * You can pass a validation function as a validate prop.
 * If validate function returns a non empty string it will
 * be shown as an error message.
 */
class TextInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      value: this.props.value,
    };
    this.onBlur = this.onBlur.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.error !== this.props.error) {
      this.setErrorUpdate(this.props.error);
    }
  }

  onBlur(event) {
    this.props.onBlur(event);
  }

  onChange(event) {
    const { value } = event.target;
    this.setState({ value });
    this.validate(value);
  }

  setErrorUpdate(prop) {
    this.setState({ error: prop });
  }

  getPlaceholder() {
    const { formatMessage } = this.props.intl;
    if (this.props.placeholderId) {
      return formatMessage({ id: this.props.placeholderId });
    }
    return '';
  }

  /*
   * Call the passed validation function and assign
   * valid return value to error state.
   */
  validate(value) {
    if (!this.props.validate) {
      return;
    }
    const error = this.props.validate(value);
    if (typeof error === 'string') {
      this.setState({ error });
    }
  }

  render() {
    return (
      <HDSTextInput
        style={{ marginBlock: 'var(--spacing-s)' }}
        label={
          <>
            <FormattedMessage id={this.props.labelId} />
            {this.props.hint ? <span> ({this.props.hint})</span> : null}
          </>
        }
        id={this.props.name}
        name={this.props.name}
        maxLength={this.props.maxLength}
        value={this.state.value}
        required={this.props.required}
        errorText={this.state.error}
        placeholder={this.getPlaceholder()}
        onBlur={this.onBlur}
        onChange={this.onChange}
        helperText={this.props.helperText}
      />
    );
  }
}

TextInput.propTypes = {
  error: PropTypes.any,
  labelId: PropTypes.string,
  hint: PropTypes.string,
  maxLength: PropTypes.number,
  required: PropTypes.bool,
  name: PropTypes.string,
  onBlur: PropTypes.func,
  placeholderId: PropTypes.string,
  validate: PropTypes.func,
  value: PropTypes.string,
  intl: PropTypes.object,
  helperText: PropTypes.string,
};

export default injectIntl(TextInput);
