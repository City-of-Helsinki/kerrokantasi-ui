import React from 'react';
import PropTypes from 'prop-types';

function RichTextModalTextField(props) {
  const {name, label, handleInputChange, handleInputBlur, value, isRequired, errorMsg, formName} = props;
  const errorId = `${formName}-input-error-${name}`;

  return (
    <div className="input-container">
      <label htmlFor={`${formName}-${name}`}>{label} {isRequired && '*'}</label>
      <input
        id={`${formName}-${name}`}
        name={name}
        className="form-control"
        onChange={handleInputChange}
        onBlur={handleInputBlur}
        value={value}
        type="text"
        required={isRequired}
        aria-describedby={errorMsg ? errorId : undefined}
      />
      {errorMsg && <p id={errorId} role="alert" className="rich-text-editor-form-input-error">{errorMsg}</p>}
    </div>
  );
}

RichTextModalTextField.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  handleInputChange: PropTypes.func.isRequired,
  handleInputBlur: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
  isRequired: PropTypes.bool,
  errorMsg: PropTypes.string,
  formName: PropTypes.string,
};

export default RichTextModalTextField;
