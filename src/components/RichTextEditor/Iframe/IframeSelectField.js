import React from 'react';
import PropTypes from 'prop-types';

function IframeSelectField(props) {
  const {name, label, handleInputChange, value, options, isRequired, errorMsg} = props;
  const errorId = `iframe-input-error-${name}`;

  // options = [{value: "value", text: "text"}]
  const optionElements = options.map(option => (
      <option value={option.value} key={option.value}>{option.text}</option>
    ));

  return (
    <div className="input-container">
      <label htmlFor={`iframe-${name}`}>{label} {isRequired && '*'}</label>
      <select
        id={`iframe-${name}`}
        className="rich-text-editor-form-select-input"
        name={name}
        value={value}
        onChange={handleInputChange}
      >
        {optionElements}
      </select>
      {errorMsg && <p id={errorId} role="alert" className="iframe-input-error">{errorMsg}</p>}
    </div>
  );
}

IframeSelectField.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  handleInputChange: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
  options: PropTypes.array.isRequired,
  isRequired: PropTypes.bool,
  errorMsg: PropTypes.string,
};

export default IframeSelectField;
