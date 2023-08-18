import React from 'react';
import PropTypes from 'prop-types';
import FormControl from 'react-bootstrap/lib/FormControl';

class FormControlOnChange extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: this.props.defaultValue || ''
    };
  }

  onChange = (event) => {
    this.setState({
      value: event.target.value
    });
  }

  componentWillReceiveProps(newProps) {
    this.setState({
      value: newProps.defaultValue || ''
    });
  }

  render() {
    const {type, onBlur, maxLength} = this.props;
    return (
      <FormControl
        maxLength={maxLength}
        onChange={this.onChange}
        value={this.state.value}
        type={type}
        onBlur={onBlur}
      />
    );
  }
}

FormControlOnChange.propTypes = {
  defaultValue: PropTypes.string,
  type: PropTypes.string,
  onBlur: PropTypes.func,
  maxLength: PropTypes.string
};

export default FormControlOnChange;
