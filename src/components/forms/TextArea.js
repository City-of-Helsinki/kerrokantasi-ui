import React from 'react';
import PropTypes from 'prop-types';
import {injectIntl, intlShape} from 'react-intl';

import FormControl from 'react-bootstrap/lib/FormControl';

import InputBase from './InputBase';


class TextArea extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: this.props.value,
    };
    this.onBlur = this.onBlur.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  onBlur(event) {
    this.props.onBlur(event);
  }

  onChange(event) {
    const value = event.target.value;
    this.setState({value});
  }

  getPlaceholder() {
    const {formatMessage} = this.props.intl;
    if (this.props.placeholderId) {
      return formatMessage({id: this.props.placeholderId});
    }
    return "";
  }

  render() {
    return (
      <InputBase
        labelId={this.props.labelId}
        maxLength={this.props.maxLength}
        name={this.props.name}
        value={this.state.value}
        required={this.props.required}
      >
        <FormControl
          componentClass="textarea"
          maxLength={this.props.maxLength}
          name={this.props.name}
          onBlur={this.onBlur}
          rows={this.props.rows}
          defaultValue={this.props.value}
          placeholder={this.getPlaceholder()}
        />
      </InputBase>
    );
  }
}

TextArea.defaultProps = {
  rows: "3"
};

TextArea.propTypes = {
  labelId: PropTypes.string,
  maxLength: PropTypes.number,
  required: PropTypes.bool,
  name: PropTypes.string,
  onBlur: PropTypes.func,
  rows: PropTypes.string,
  value: PropTypes.string,
  intl: intlShape.isRequired,
  placeholderId: PropTypes.string,
};

export default injectIntl(TextArea);
