import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';
import { TextArea as HDSTextArea } from 'hds-react';

const TextArea = ({
  hint,
  labelId,
  name,
  maxLength,
  required,
  value: initialValue,
  helperText,
  placeholderId,
  rows = '3',
  onBlur: onBlurFn,
}) => {
  const { formatMessage } = useIntl();
  const [inputValue, setInputValue] = useState(initialValue);

  const onBlur = (event) => onBlurFn(event);

  const onChange = (event) => {
    const { value } = event.target;

    setInputValue(value);
  };

  const placeholder = placeholderId ? formatMessage({ id: placeholderId }) : '';

  return (
    <HDSTextArea
      style={{ marginBlock: 'var(--spacing-s)' }}
      id={name}
      name={name}
      label={
        <>
          <FormattedMessage id={labelId} />
          {hint ? <span> ({hint})</span> : null}
        </>
      }
      value={inputValue}
      maxLength={maxLength}
      required={required}
      onBlur={onBlur}
      rows={rows}
      placeholder={placeholder}
      helperText={helperText}
      onChange={onChange}
    />
  );
};

TextArea.propTypes = {
  labelId: PropTypes.string,
  hint: PropTypes.object,
  maxLength: PropTypes.number,
  required: PropTypes.bool,
  name: PropTypes.string,
  onBlur: PropTypes.func,
  rows: PropTypes.string,
  value: PropTypes.string,
  placeholderId: PropTypes.string,
  helperText: PropTypes.string,
};

export default TextArea;
