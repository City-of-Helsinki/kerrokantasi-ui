import React from 'react';
import PropTypes from 'prop-types';

function IframeTextField(props) {
  const {name, label, handleInputChange, handleInputBlur, value, isRequired, errorMsg} = props;
  const errorId = `iframe-input-error-${name}`;

  return (
    <div className="input-container">
      <label htmlFor={`iframe-${name}`}>{label} {isRequired && '*'}</label>
      <input
        id={`iframe-${name}`}
        name={name}
        className="form-control"
        onChange={handleInputChange}
        onBlur={handleInputBlur}
        value={value}
        type="text"
        required={isRequired}
        aria-describedby={errorMsg ? errorId : undefined}
      />
      {errorMsg && <p id={errorId} role="alert" className="iframe-input-error">{errorMsg}</p>}
    </div>
  );
}

IframeTextField.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  handleInputChange: PropTypes.func.isRequired,
  handleInputBlur: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
  isRequired: PropTypes.bool,
  errorMsg: PropTypes.string,
};

export default IframeTextField;
