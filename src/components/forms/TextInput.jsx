import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';
import { TextInput as HDSTextInput } from 'hds-react';

const TextInput = ({
  error,
  hint,
  labelId,
  name,
  maxLength,
  required,
  value: initialValue,
  helperText,
  placeholderId,
  onBlur: onBlurFn,
  validate: validateFn,
  intl: { formatMessage },
}) => {
  const [inputError, setInputError] = useState(error);
  const [inputValue, setInputValue] = useState(initialValue);

  useEffect(() => {
    if (error) {
      setInputError(error);
    }
  }, [error]);

  const onBlur = (event) => onBlurFn(event);

  const validate = (value) => {
    if (!validateFn) {
      return;
    }
    const validationError = validateFn(value);

    if (typeof validationError === 'string') {
      setInputError(validationError);
    }
  };

  const onChange = (event) => {
    const { value } = event.target;

    setInputValue(value);
    validate(value);
  };

  const placeholder = placeholderId ? formatMessage({ id: placeholderId }) : '';

  return (
    <HDSTextInput
      style={{ marginBlock: 'var(--spacing-s)' }}
      label={
        <>
          <FormattedMessage id={labelId} />
          {hint ? <span> ({hint})</span> : null}
        </>
      }
      id={name}
      name={name}
      maxLength={maxLength}
      value={inputValue}
      required={required}
      errorText={inputError}
      placeholder={placeholder}
      onBlur={onBlur}
      onChange={onChange}
      helperText={helperText}
    />
  );
};

TextInput.propTypes = {
  error: PropTypes.any,
  labelId: PropTypes.string,
  hint: PropTypes.object,
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
