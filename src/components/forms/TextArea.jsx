/* eslint-disable react/forbid-prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';
import { TextArea as HDSTextArea } from 'hds-react';

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
    const { value } = event.target;
    this.setState({ value });
  }

  getPlaceholder() {
    const { formatMessage } = this.props.intl;
    if (this.props.placeholderId) {
      return formatMessage({ id: this.props.placeholderId });
    }
    return '';
  }

  render() {
    return (
      <HDSTextArea
        style={{ marginBlock: 'var(--spacing-s)' }}
        id={this.props.name}
        name={this.props.name}
        label={
          <>
            <FormattedMessage id={this.props.labelId} />
            {this.props.hint ? <span> ({this.props.hint})</span> : null}
          </>
        }
        value={this.state.value}
        maxLength={this.props.maxLength}
        required={this.props.required}
        onBlur={this.onBlur}
        rows={this.props.rows}
        placeholder={this.getPlaceholder()}
        helperText={this.props.helperText}
      />
    );
  }
}

TextArea.defaultProps = {
  rows: '3',
};

TextArea.propTypes = {
  labelId: PropTypes.string,
  hint: PropTypes.string,
  maxLength: PropTypes.number,
  required: PropTypes.bool,
  name: PropTypes.string,
  onBlur: PropTypes.func,
  rows: PropTypes.string,
  value: PropTypes.string,
  placeholderId: PropTypes.string,
  intl: PropTypes.object,
  helperText: PropTypes.string,
  intl: PropTypes.object,
};

export default injectIntl(TextArea);
