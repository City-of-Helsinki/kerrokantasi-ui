import React from 'react';
import PropTypes from 'prop-types';
import {injectIntl, FormattedMessage} from 'react-intl';

import ControlLabel from 'react-bootstrap/lib/ControlLabel';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import HelpBlock from 'react-bootstrap/lib/HelpBlock';


class InputBase extends React.Component {

  getLabelHint() {
    const {maxLength, value, required} = this.props;

    const LengthHint = () => (maxLength && value ? (
      <span>
        {` (${value.length} / ${maxLength} `}
        <FormattedMessage id="characters"/>)
      </span>
    ) : null);

    const RequiredHint = () => (required ? (
      <span>*</span>
    ) : null);

    return (
      <small className="field-hint">
        <LengthHint/>
        <RequiredHint/>
      </small>
    );
  }

  render() {
    const error = this.props.error;

    return (
      <FormGroup controlId={this.props.name} validationState={error ? "error" : null}>
        <ControlLabel>
          <FormattedMessage id={this.props.labelId}/>
          {this.getLabelHint()}
        </ControlLabel>
        {this.props.children}
        {error ? <HelpBlock>{error}</HelpBlock> : null}
      </FormGroup>
    );
  }
}

InputBase.propTypes = {
  children: PropTypes.element,
  error: PropTypes.string,
  labelId: PropTypes.string,
  maxLength: PropTypes.number,
  required: PropTypes.bool,
  name: PropTypes.string,
  value: PropTypes.string,
};

export default injectIntl(InputBase);
